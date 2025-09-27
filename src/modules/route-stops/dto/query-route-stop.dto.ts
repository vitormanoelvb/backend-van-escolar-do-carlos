import { IsInt, IsOptional, Min } from 'class-validator';

export class QueryRouteStopDto {
  @IsOptional()
  @IsInt()
  routeId?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  orderIndex?: number;
}
