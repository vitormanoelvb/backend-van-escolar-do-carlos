import { PartialType } from '@nestjs/mapped-types';
import { CreateRouteStopDto } from './create-route-stop.dto';
import { IsInt, IsOptional, Min, IsString, IsNumber } from 'class-validator';

export class UpdateRouteStopDto extends PartialType(CreateRouteStopDto) {
  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;

  @IsOptional()
  @IsInt()
  routeId?: number;

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
