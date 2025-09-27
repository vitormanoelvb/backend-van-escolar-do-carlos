import { IsEnum, IsInt, IsOptional, Matches } from 'class-validator';
import { PaymentStatus } from '@prisma/client';

export class QueryPaymentDto {
  @IsOptional()
  @Matches(/^\d{4}-(0[1-9]|1[0-2])$/)
  month?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsInt()
  studentId?: number;
}
