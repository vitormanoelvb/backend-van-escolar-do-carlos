import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
  BadRequestException,
  ParseIntPipe,
  PipeTransform,
} from '@nestjs/common';
import { RouteStopsService } from './route-stops.service';
import { CreateRouteStopDto } from './dto/create-route-stop.dto';
import { UpdateRouteStopDto } from './dto/update-route-stop.dto';
import { QueryRouteStopDto } from './dto/query-route-stop.dto';
import { RouteStop } from '@prisma/client';

class ParseBigIntPipe implements PipeTransform<string, bigint> {
  transform(value: string): bigint {
    try {
      return BigInt(value);
    } catch {
      throw new BadRequestException('O ID informado não é válido.');
    }
  }
}

@Controller('route-stops')
export class RouteStopsController {
  constructor(private readonly service: RouteStopsService) {}

  @Post()
  async create(
    @Body() dto: CreateRouteStopDto,
  ): Promise<{ message: string; columns: string[]; stop: RouteStop }> {
    const stop = await this.service.create(dto);
    return {
      message: 'Parada criada com sucesso!',
      columns: ['ID', 'Rota', 'Endereço', 'Número', 'Bairro', 'Latitude', 'Longitude', 'Ordem'],
      stop,
    };
  }

  @Get()
  async findAll(
    @Query('routeId', new ParseIntPipe({ optional: true })) routeId?: number,
    @Query('orderIndex', new ParseIntPipe({ optional: true })) orderIndex?: number,
  ): Promise<{ message: string; stops: RouteStop[] }> {
    const query: QueryRouteStopDto = {};
    if (typeof routeId === 'number') query.routeId = routeId;
    if (typeof orderIndex === 'number') query.orderIndex = orderIndex;

    const stops = await this.service.findAll(query);
    if (stops.length === 0) {
      throw new NotFoundException('Nenhuma parada encontrada para esta rota.');
    }

    return {
      message: 'Lista de paradas encontrada com sucesso.',
      stops,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseBigIntPipe) id: bigint,
  ): Promise<{ message: string; stop: RouteStop }> {
    const stop = await this.service.findOne(id);
    if (!stop) {
      throw new NotFoundException(`Parada com ID ${id} não foi encontrada.`);
    }
    return {
      message: 'Parada encontrada com sucesso.',
      stop,
    };
  }

  @Patch(':id')
  async update(
    @Param('id', ParseBigIntPipe) id: bigint,
    @Body() dto: UpdateRouteStopDto,
  ): Promise<{ message: string; stop: RouteStop }> {
    const stop = await this.service.update(id, dto);
    return {
      message: 'Parada atualizada com sucesso.',
      stop,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseBigIntPipe) id: bigint): Promise<{ message: string }> {
    await this.service.remove(id);
    return {
      message: `Parada com ID ${id} removida com sucesso.`,
    };
  }
}
