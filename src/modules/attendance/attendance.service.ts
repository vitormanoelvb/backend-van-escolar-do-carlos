import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';
import { Attendance } from '@prisma/client';

@Injectable()
export class AttendanceService {
  constructor(private readonly prisma: PrismaService) {}

  private toPtAttendance(a: Attendance) {
    return {
      id: a.id.toString(),
      data: a.dateRef.toISOString(),
      rotaId: a.routeId.toString(),
      alunoId: a.studentId.toString(),
      status: a.status,
      observacoes: a.notes,
      marcadoPor: a.markedBy ? a.markedBy.toString() : null,
      criadoEm: a.createdAt.toISOString(),
      atualizadoEm: a.updatedAt.toISOString(),
    };
  }

  async findAll(query: QueryAttendanceDto) {
    const items = await this.prisma.attendance.findMany({
      where: {
        dateRef: query.date ? new Date(query.date) : undefined,
        routeId: query.routeId != null ? BigInt(query.routeId) : undefined,
        studentId: query.studentId != null ? BigInt(query.studentId) : undefined,
        status: query.status ?? undefined,
      },
      orderBy: [{ dateRef: 'desc' }, { createdAt: 'desc' }],
    });
    return items.map((a) => this.toPtAttendance(a));
  }

  async createOne(dto: CreateAttendanceDto) {
    try {
      const created = await this.prisma.attendance.upsert({
        where: {
          dateRef_routeId_studentId: {
            dateRef: new Date(dto.date),
            routeId: BigInt(dto.routeId),
            studentId: BigInt(dto.studentId),
          },
        },
        create: {
          dateRef: new Date(dto.date),
          routeId: BigInt(dto.routeId),
          studentId: BigInt(dto.studentId),
          status: dto.status,
          notes: dto.notes ?? null,
          markedBy: dto.markedBy != null ? BigInt(dto.markedBy) : null,
        },
        update: {
          status: dto.status,
          notes: dto.notes ?? null,
          markedBy: dto.markedBy != null ? BigInt(dto.markedBy) : null,
        },
      });
      return this.toPtAttendance(created);
    } catch {
      throw new BadRequestException('Não foi possível criar a chamada.');
    }
  }

  async findById(id: bigint) {
    const item = await this.prisma.attendance.findUnique({ where: { id } });
    if (!item) throw new NotFoundException('Chamada não encontrada.');
    return this.toPtAttendance(item);
  }

  async updateOne(id: bigint, dto: UpdateAttendanceDto) {
    await this.findById(id);

    const hasAllKeyFields =
      dto.date !== undefined && dto.routeId !== undefined && dto.studentId !== undefined;

    if (hasAllKeyFields) {
      const keyExists = await this.prisma.attendance.findUnique({
        where: {
          dateRef_routeId_studentId: {
            dateRef: new Date(dto.date as string),
            routeId: BigInt(dto.routeId as number),
            studentId: BigInt(dto.studentId as number),
          },
        },
      });
      if (keyExists && keyExists.id !== id) {
        throw new BadRequestException('Já existe chamada para este aluno nesta rota e data.');
      }
    }

    const updated = await this.prisma.attendance.update({
      where: { id },
      data: {
        dateRef: dto.date ? new Date(dto.date) : undefined,
        routeId: dto.routeId != null ? BigInt(dto.routeId) : undefined,
        studentId: dto.studentId != null ? BigInt(dto.studentId) : undefined,
        status: dto.status ?? undefined,
        notes: dto.notes ?? undefined,
        markedBy: dto.markedBy != null ? BigInt(dto.markedBy) : undefined,
      },
    });
    return this.toPtAttendance(updated);
  }

  async removeOne(id: bigint) {
    await this.findById(id);
    await this.prisma.attendance.delete({ where: { id } });
    return { ok: true };
  }
}
