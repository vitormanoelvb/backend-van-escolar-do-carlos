import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  ConflictException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { User, Prisma } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Post()
  async create(@Body() dto: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) {
    try {
      const user = await this.service.create(dto);
      return { message: 'Usuário(a) criado com sucesso.', data: user };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Usuário(a) já existente com este e-mail.');
      }
      throw error;
    }
  }

  @Get()
  async findAll() {
    const users = await this.service.findAll();
    return {
      message: 'Usuários(as)',
      data: users,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.service.findOne(BigInt(id));
    return { message: 'Usuário(a) encontrado.', data: user };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: Partial<User>) {
    const user = await this.service.update(BigInt(id), dto);
    return { message: 'Usuário(a) atualizado com sucesso.', data: user };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(BigInt(id));
    return { message: 'Usuário(a) removido com sucesso.' };
  }
}
