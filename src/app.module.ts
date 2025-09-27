import { Module } from '@nestjs/common';
import { PrismaModule } from './database/PrismaModule';
import { StudentsModule } from './modules/students/students.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { RoutesModule } from './modules/routes/routes.module';
import { AttendanceModule } from './modules/attendance/attendance.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { RouteStopsModule } from './modules/route-stops/route-stops.module';

@Module({
  imports: [
    PrismaModule,
    StudentsModule,
    RoutesModule,
    RouteStopsModule,
    AttendanceModule,
    PaymentsModule,
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}
