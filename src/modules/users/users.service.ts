import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.passwordHash, 10);
    return this.prisma.user.create({
      data: {
        ...data,
        passwordHash: hashedPassword,
      },
    });
  }

  async findAll(): Promise<User[]> {
    return this.prisma.user.findMany();
  }

  async findOne(id: bigint): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async update(id: bigint, data: Partial<User>): Promise<User> {
    const updateData = { ...data };

    if (data.passwordHash) {
      updateData.passwordHash = await bcrypt.hash(data.passwordHash, 10);
    }

    return this.prisma.user.update({
      where: { id },
      data: updateData,
    });
  }

  async remove(id: bigint): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }
}
