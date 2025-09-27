import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PaymentMethod, PaymentStatus } from '@prisma/client';
import { PrismaService } from '../../database/PrismaService';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePaymentDto) {
    return this.prisma.payment.create({
      data: {
        studentId: BigInt(dto.studentId),
        amount: new Prisma.Decimal(dto.amount),
        dueDate: new Date(dto.dueDate),
        paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
        status: dto.status ?? PaymentStatus.OPEN,
        method: dto.method ?? PaymentMethod.CASH,
        notes: dto.notes,
      },
    });
  }

  async findAll(q?: QueryPaymentDto & { page?: number | string; limit?: number | string }) {
    const page = q?.page ? Number(q.page) : 1;
    const limit = q?.limit ? Number(q.limit) : 10;

    const where: Prisma.PaymentWhereInput = {};

    if (q?.studentId != null) where.studentId = BigInt(q.studentId);
    if (q?.status) where.status = q.status;

    if (q?.month) {
      const [y, m] = q.month.split('-').map(Number);
      const gte = new Date(Date.UTC(y, (m ?? 1) - 1, 1));
      const lt = new Date(Date.UTC(y, m ?? 1, 1));
      where.dueDate = { gte, lt };
    }

    const [items, total] = await this.prisma.$transaction([
      this.prisma.payment.findMany({
        where,
        include: { student: true },
        orderBy: [{ dueDate: 'asc' }, { studentId: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.payment.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: bigint) {
    const payment = await this.prisma.payment.findUnique({ where: { id } });
    if (!payment) throw new NotFoundException('Pagamento não encontrado');
    return payment;
  }

  async update(id: bigint, dto: UpdatePaymentDto) {
    await this.findOne(id);

    return this.prisma.payment.update({
      where: { id },
      data: {
        studentId: dto.studentId != null ? BigInt(dto.studentId) : undefined,
        amount: dto.amount != null ? new Prisma.Decimal(dto.amount) : undefined,
        dueDate: dto.dueDate ? new Date(dto.dueDate) : undefined,
        paidAt: dto.paidAt ? new Date(dto.paidAt) : undefined,
        status: dto.status ?? undefined,
        method: dto.method ?? undefined,
        notes: dto.notes ?? undefined,
      },
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);
    await this.prisma.payment.delete({ where: { id } });
    return { ok: true };
  }
}
