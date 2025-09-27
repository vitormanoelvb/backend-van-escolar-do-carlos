import { Controller, Get, Param, Patch, Body, ParseIntPipe, Post, Delete } from '@nestjs/common';
import { RoutesService } from './routes.service';
import { UpdateRouteDto } from './dto/update-route.dto';

@Controller('routes')
export class RoutesController {
  constructor(private readonly service: RoutesService) {}

  @Get()
  async findAll() {
    const data = await this.service.findAll();
    return {
      message: 'Rotas',
      data,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.findOne(BigInt(id));
    return {
      message: 'Rota encontrada com sucesso.',
      data,
    };
  }

  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateRouteDto) {
    const data = await this.service.updateAndSync(BigInt(id), dto);
    return {
      message: 'Rota atualizada e paradas sincronizadas com sucesso.',
      data,
    };
  }

  @Post()
  async create(@Body() body: { name: string }) {
    const data = await this.service.create(body?.name);
    return {
      message: 'Rota criada com sucesso.',
      data,
    };
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const data = await this.service.remove(BigInt(id));
    return {
      message: 'Rota removida com sucesso.',
      data,
    };
  }
}
