import { IsOptional, IsString, ValidateNested, IsArray, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
import { RouteStopInputDto } from './route-stop-input.dto';

export class UpdateRouteDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Type(() => Number)
  driverId?: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RouteStopInputDto)
  stops: RouteStopInputDto[] = [];
}
