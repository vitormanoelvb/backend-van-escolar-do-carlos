import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Query } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { QueryPaymentDto } from './dto/query-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly service: PaymentsService) {}

  @Post()
  async create(@Body() dto: CreatePaymentDto) {
    const payment = await this.service.create(dto);
    return { message: 'Pagamento criado com sucesso.', data: payment };
  }

  @Get()
  async findAll(@Query() q: QueryPaymentDto) {
    const result = await this.service.findAll(q);
    return {
      message: 'Pagamentos',
      ...result,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const payment = await this.service.findOne(BigInt(id));
    return { message: 'Pagamento encontrado.', data: payment };
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    const payment = await this.service.update(BigInt(id), dto);
    return { message: 'Pagamento atualizado com sucesso.', data: payment };
  }

  @Delete(':id')
  @HttpCode(200)
  async remove(@Param('id') id: string) {
    await this.service.remove(BigInt(id));
    return { message: 'Pagamento removido com sucesso.' };
  }
}
