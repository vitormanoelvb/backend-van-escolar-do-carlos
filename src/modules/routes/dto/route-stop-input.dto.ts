import { IsInt, IsOptional, IsString, IsNumber, Min } from 'class-validator';

export class RouteStopInputDto {
  @IsOptional()
  @IsInt()
  id?: number;

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

  @IsInt()
  @Min(0)
  orderIndex!: number;
}
