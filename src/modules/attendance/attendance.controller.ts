import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  PipeTransform,
  Query,
} from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateAttendanceDto } from './dto/update-attendance.dto';
import { QueryAttendanceDto } from './dto/query-attendance.dto';

class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    try {
      return BigInt(value);
    } catch {
      throw new BadRequestException('ID inválido.');
    }
  }
}

@Controller('attendance')
export class AttendanceController {
  constructor(private readonly service: AttendanceService) {}

  @Get()
  async findAll(@Query() query: QueryAttendanceDto) {
    const data = await this.service.findAll(query);
    return { message: 'Chamadas listadas com sucesso.', Chamadas: data };
  }

  @Post()
  async create(@Body() dto: CreateAttendanceDto) {
    const data = await this.service.createOne(dto);
    return { message: 'Chamada registrada com sucesso.', data };
  }

  @Get(':id')
  async findOne(@Param('id', ParseBigIntPipe) id: bigint) {
    const data = await this.service.findById(id);
    return { message: 'Chamada encontrada.', data };
  }

  @Patch(':id')
  async update(@Param('id', ParseBigIntPipe) id: bigint, @Body() dto: UpdateAttendanceDto) {
    const data = await this.service.updateOne(id, dto);
    return { message: 'Chamada atualizada com sucesso.', data };
  }

  @Delete(':id')
  async remove(@Param('id', ParseBigIntPipe) id: bigint) {
    await this.service.removeOne(id);
    return { message: 'Chamada excluída com sucesso.' };
  }
}
