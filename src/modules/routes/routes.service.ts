import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma, Route } from '@prisma/client';
import { PrismaService } from '../../database/PrismaService';
import { UpdateRouteDto } from './dto/update-route.dto';

@Injectable()
export class RoutesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.route.findMany({
      include: { stops: { orderBy: { orderIndex: 'asc' } } },
      orderBy: [{ name: 'asc' }],
    });
  }

  async findOne(id: bigint) {
    const route = await this.prisma.route.findUnique({
      where: { id },
      include: { stops: { orderBy: { orderIndex: 'asc' } } },
    });
    if (!route) throw new NotFoundException('Rota não encontrada.');
    return route;
  }

  async create(name: string): Promise<Route> {
    if (!name?.trim()) {
      throw new BadRequestException('Nome da rota é obrigatório');
    }
    return this.prisma.route.create({
      data: { name: name.trim() },
      include: { stops: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async updateAndSync(id: bigint, dto: UpdateRouteDto): Promise<Route> {
    await this.ensureExists(id);

    if (dto.stops) {
      const seen = new Set<number>();
      for (const s of dto.stops) {
        if (typeof s.orderIndex !== 'number') {
          throw new BadRequestException('Cada parada deve conter um orderIndex numérico.');
        }
        if (seen.has(s.orderIndex)) {
          throw new BadRequestException(
            `orderIndex duplicado: ${s.orderIndex}. Cada parada deve ter um índice único.`,
          );
        }
        seen.add(s.orderIndex);
      }

      const normalized = [...dto.stops]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((s, i) => ({
          routeId: id,
          label: s.label ?? null,
          street: s.street ?? null,
          number: s.number ?? null,
          neighborhood: s.neighborhood ?? null,
          latitude: s.latitude ?? null,
          longitude: s.longitude ?? null,
          orderIndex: i,
        }));

      await this.prisma.$transaction([
        this.prisma.route.update({
          where: { id },
          data: {
            name: dto.name ?? undefined,

            driver:
              dto.driverId !== undefined
                ? dto.driverId === null
                  ? { disconnect: true }
                  : { connect: { id: BigInt(dto.driverId as any) } }
                : undefined,
            // ⬆⬆⬆
          },
        }),
        this.prisma.routeStop.deleteMany({ where: { routeId: id } }),
        normalized.length
          ? this.prisma.routeStop.createMany({ data: normalized })
          : this.prisma.routeStop.deleteMany({ where: { routeId: id } }),
      ]);

      const updated = await this.prisma.route.findUnique({
        where: { id },
        include: { stops: { orderBy: { orderIndex: 'asc' } } },
      });
      if (!updated) {
        throw new NotFoundException('Rota não encontrada.');
      }
      return updated as unknown as Route;
    }

    const existing = await this.prisma.routeStop.findMany({
      where: { routeId: id },
      select: { id: true },
    });
    const existingIds = existing.map((s) => s.id);

    const incoming: NonNullable<UpdateRouteDto['stops']> = dto.stops ?? [];
    const incomingIds = incoming
      .filter((s) => s.id !== undefined)
      .map((s) => BigInt(s.id as number));

    const idsToDelete = existingIds.filter((eid) => !incomingIds.includes(eid));

    const upserts: Prisma.RouteStopUpsertWithWhereUniqueWithoutRouteInput[] = incoming
      .filter((s) => s.id !== undefined)
      .map((s) => ({
        where: { id: BigInt(s.id as number) },
        update: {
          label: s.label ?? null,
          street: s.street ?? null,
          number: s.number ?? null,
          neighborhood: s.neighborhood ?? null,
          latitude: s.latitude ?? null,
          longitude: s.longitude ?? null,
          orderIndex: s.orderIndex,
        },
        create: {
          label: s.label ?? null,
          street: s.street ?? null,
          number: s.number ?? null,
          neighborhood: s.neighborhood ?? null,
          latitude: s.latitude ?? null,
          longitude: s.longitude ?? null,
          orderIndex: s.orderIndex,
        },
      }));

    const creates: Prisma.RouteStopCreateWithoutRouteInput[] = incoming
      .filter((s) => s.id === undefined)
      .map((s) => ({
        label: s.label ?? null,
        street: s.street ?? null,
        number: s.number ?? null,
        neighborhood: s.neighborhood ?? null,
        latitude: s.latitude ?? null,
        longitude: s.longitude ?? null,
        orderIndex: s.orderIndex,
      }));

    const data: Prisma.RouteUpdateInput = {
      name: dto.name ?? undefined,
      driver:
        dto.driverId !== undefined
          ? dto.driverId === null
            ? { disconnect: true }
            : { connect: { id: BigInt(dto.driverId as any) } }
          : undefined,

      stops: {
        create: creates.length ? creates : undefined,
        upsert: upserts.length ? upserts : undefined,
        deleteMany: idsToDelete.length ? { id: { in: idsToDelete } } : undefined,
      },
    };

    return this.prisma.route.update({
      where: { id },
      data,
      include: { stops: { orderBy: { orderIndex: 'asc' } } },
    });
  }

  async remove(id: bigint): Promise<Route> {
    await this.ensureExists(id);

    try {
      await this.prisma.routeStop.deleteMany({
        where: { routeId: id },
      });

      return await this.prisma.route.delete({ where: { id } });
    } catch {
      throw new BadRequestException(
        'Não foi possível remover a rota. Verifique se existem dependências vinculadas.',
      );
    }
  }

  private async ensureExists(id: bigint) {
    const found = await this.prisma.route.findUnique({ where: { id } });
    if (!found) throw new NotFoundException('Rota não encontrada.');
  }
}
