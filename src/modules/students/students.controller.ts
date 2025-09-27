import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { StudentsService } from './students.service';
import { CreateStudentDto } from './dto/create-student.dto';
import { UpdateStudentDto } from './dto/update-student.dto';
import { Student } from '@prisma/client';

@Controller('students')
export class StudentsController {
  constructor(private readonly service: StudentsService) {}

  @Post()
  async create(@Body() dto: CreateStudentDto) {
    const student: Student = await this.service.create(dto);
    return { message: 'Aluno(a) criado com sucesso.', data: student };
  }

  @Get()
  async findAll(@Query() q: any) {
    const result = await this.service.findAll(q);

    const message = 'Alunos(as)';

    return {
      message,
      items: result.items,
      total: result.total,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const student: Student = await this.service.findOne(BigInt(id));
    return { message: 'Aluno(a) encontrado.', data: student };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateStudentDto) {
    const student: Student = await this.service.update(BigInt(id), dto);
    return { message: 'Aluno(a) atualizado com sucesso.', data: student };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.service.remove(BigInt(id));
    return { message: 'Aluno(a) removido com sucesso.' };
  }
}
