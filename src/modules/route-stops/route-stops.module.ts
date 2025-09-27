import { Module } from '@nestjs/common';
import { RouteStopsController } from './route-stops.controller';
import { RouteStopsService } from './route-stops.service';
import { PrismaService } from '../../database/PrismaService';

@Module({
  controllers: [RouteStopsController],
  providers: [RouteStopsService, PrismaService],
  exports: [RouteStopsService],
})
export class RouteStopsModule {}
