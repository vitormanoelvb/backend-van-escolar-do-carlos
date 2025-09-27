import { Module } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentsController } from './students.controller';
import { PrismaModule } from '../../database/PrismaModule';

@Module({
  imports: [PrismaModule],
  controllers: [StudentsController],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
