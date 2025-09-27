import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { CreateRouteStopDto } from './dto/create-route-stop.dto';
import { UpdateRouteStopDto } from './dto/update-route-stop.dto';
import { QueryRouteStopDto } from './dto/query-route-stop.dto';
import { Prisma, RouteStop } from '@prisma/client';

@Injectable()
export class RouteStopsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateRouteStopDto): Promise<RouteStop> {
    const routeId = BigInt(dto.routeId);

    const clash = await this.prisma.routeStop.findFirst({
      where: { routeId, orderIndex: dto.orderIndex },
    });
    if (clash) {
      throw new BadRequestException(`Já existe uma parada com ordem ${dto.orderIndex} nesta rota.`);
    }

    try {
      return await this.prisma.routeStop.create({
        data: {
          orderIndex: dto.orderIndex,
          route: { connect: { id: routeId } },
          label: dto.label ?? null,
          street: dto.street ?? null,
          number: dto.number ?? null,
          neighborhood: dto.neighborhood ?? null,
          latitude: dto.latitude ?? null,
          longitude: dto.longitude ?? null,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException(
          `Combinação routeId/orderIndex já existe (rota ${dto.routeId}, ordem ${dto.orderIndex}).`,
        );
      }
      throw e;
    }
  }

  async findAll(query: QueryRouteStopDto): Promise<RouteStop[]> {
    return this.prisma.routeStop.findMany({
      where: query.routeId ? { routeId: BigInt(query.routeId) } : undefined,
      orderBy: { orderIndex: 'asc' },
    });
  }

  async findOne(id: bigint): Promise<RouteStop> {
    const stop = await this.prisma.routeStop.findUnique({ where: { id } });
    if (!stop) throw new NotFoundException('Parada não encontrada.');
    return stop;
  }

  async update(id: bigint, dto: UpdateRouteStopDto): Promise<RouteStop> {
    await this.ensureExists(id);

    const current = await this.prisma.routeStop.findUnique({
      where: { id },
      select: { routeId: true, orderIndex: true },
    });
    const targetRouteId = dto.routeId !== undefined ? BigInt(dto.routeId) : current!.routeId;
    const targetOrderIndex =
      dto.orderIndex !== undefined ? dto.orderIndex : (current!.orderIndex as number);

    const clash = await this.prisma.routeStop.findFirst({
      where: {
        routeId: targetRouteId,
        orderIndex: targetOrderIndex,
        id: { not: id },
      },
    });
    if (clash) {
      throw new BadRequestException(
        `Já existe uma parada com ordem ${targetOrderIndex} nesta rota.`,
      );
    }

    const data: Prisma.RouteStopUpdateInput = {};
    if (dto.orderIndex !== undefined) data.orderIndex = dto.orderIndex;
    if (dto.routeId !== undefined) {
      data.route = { connect: { id: BigInt(dto.routeId) } };
    }

    if (dto.label !== undefined) data.label = dto.label ?? null;
    if (dto.street !== undefined) data.street = dto.street ?? null;
    if (dto.number !== undefined) data.number = dto.number ?? null;
    if (dto.neighborhood !== undefined) data.neighborhood = dto.neighborhood ?? null;
    if (dto.latitude !== undefined) data.latitude = dto.latitude ?? null;
    if (dto.longitude !== undefined) data.longitude = dto.longitude ?? null;

    try {
      return await this.prisma.routeStop.update({ where: { id }, data });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') {
        throw new BadRequestException('Combinação routeId/orderIndex já existe.');
      }
      throw e;
    }
  }

  async remove(id: bigint): Promise<void> {
    await this.ensureExists(id);
    await this.prisma.routeStop.delete({ where: { id } });
  }

  private async ensureExists(id: bigint) {
    const stop = await this.prisma.routeStop.findUnique({ where: { id } });
    if (!stop) throw new NotFoundException('Parada não encontrada.');
  }
}
