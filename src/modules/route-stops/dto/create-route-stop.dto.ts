import { IsInt, Min, IsOptional, IsString, IsNumber } from 'class-validator';

export class CreateRouteStopDto {
  @IsInt()
  @Min(0)
  orderIndex!: number;

  @IsInt()
  routeId!: number;

  @IsOptional()
  @IsString()
  label?: string;

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
  @IsNumber()
  latitude?: number;

  @IsOptional()
  @IsNumber()
  longitude?: number;
}
