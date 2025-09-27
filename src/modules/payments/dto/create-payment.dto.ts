import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '@prisma/client';

export class CreatePaymentDto {
  @IsInt()
  @IsPositive()
  studentId!: number;

  @IsNumber()
  @IsPositive()
  amount!: number;

  @IsString()
  @IsNotEmpty()
  dueDate!: string;

  @IsOptional()
  @IsString()
  paidAt?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(PaymentMethod)
  method?: PaymentMethod;

  @IsOptional()
  @IsString()
  notes?: string;
}
