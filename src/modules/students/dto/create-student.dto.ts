import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
} from 'class-validator';

export enum Shift {
  MANHA = 'MANHA',
  TARDE = 'TARDE',
  NOITE = 'NOITE',
  INTEGRAL = 'INTEGRAL',
}
export enum Gender {
  M = 'M',
  F = 'F',
  OUTRO = 'OUTRO',
}

export class CreateStudentDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  street?: string;

  @IsOptional()
  @IsString()
  number?: string;

  @IsOptional()
  @IsString()
  neighborhood?: string;

  @IsOptional()
  @IsString()
  school?: string;

  @IsOptional()
  @IsEnum(Shift)
  shift?: Shift;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(120)
  age?: number;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsInt()
  @IsPositive()
  seatNumber?: number;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}
