import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Shift as PrismaShift, Gender as PrismaGender, Prisma } from '@prisma/client';

@Injectable()
export class StudentsService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreateStudentDto) {
    await this.validateSeatUniqueWhenActive(dto.seatNumber, dto.active ?? true);

    return this.prisma.student.create({
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        street: dto.street,
        number: dto.number,
        neighborhood: dto.neighborhood,
        school: dto.school,
        shift: dto.shift as PrismaShift | undefined,
        age: dto.age,
        gender: dto.gender as PrismaGender | undefined,
        seatNumber: dto.seatNumber,
        active: dto.active ?? true,
      },
    });
  }

  async findAll(q?: {
    page?: number | string;
    limit?: number | string;
    name?: string;
    school?: string;
    seat?: number | string;
    active?: boolean | string;
  }) {
    const page = q?.page ? Number(q.page) : 1;
    const limit = q?.limit ? Number(q.limit) : 10;

    const where: Prisma.StudentWhereInput = {
      fullName: q?.name ? { contains: String(q.name) } : undefined,
      school: q?.school ? { contains: String(q.school) } : undefined,
      seatNumber: q?.seat !== undefined ? Number(q.seat) : undefined,
      active: q?.active !== undefined ? q.active === 'true' || q.active === true : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.student.findMany({
        where,
        orderBy: [{ seatNumber: 'asc' }, { fullName: 'asc' }],
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.student.count({ where }),
    ]);

    return { items, total, page, limit };
  }

  async findOne(id: bigint) {
    const student = await this.prisma.student.findUnique({ where: { id } });
    if (!student) throw new NotFoundException('Aluno não encontrado');
    return student;
  }

  async update(id: bigint, dto: UpdateStudentDto) {
    await this.findOne(id);

    if (dto.seatNumber !== undefined || dto.active !== undefined) {
      await this.validateSeatUniqueWhenActive(dto.seatNumber, dto.active);
    }

    return this.prisma.student.update({
      where: { id },
      data: {
        ...dto,
        shift: dto.shift as PrismaShift | undefined,
        gender: dto.gender as PrismaGender | undefined,
      },
    });
  }

  async remove(id: bigint) {
    await this.findOne(id);
    await this.prisma.student.delete({ where: { id } });
    return { ok: true };
  }

  private async validateSeatUniqueWhenActive(seatNumber?: number, active?: boolean) {
    if (!active || seatNumber == null) return;

    const clash = await this.prisma.student.findFirst({
      where: { seatNumber, active: true },
    });

    if (clash) {
      throw new BadRequestException(`Poltrona ${seatNumber} já está ocupada por outro aluno ativo`);
    }
  }
}
