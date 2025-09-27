import { IsDateString, IsEnum, IsInt, IsOptional } from 'class-validator';
import { AttendanceStatus } from './create-attendance.dto';

export class QueryAttendanceDto {
  @IsOptional()
  @IsDateString({ strict: true })
  date?: string;

  @IsOptional()
  @IsInt()
  routeId?: number;

  @IsOptional()
  @IsInt()
  studentId?: number;

  @IsOptional()
  @IsEnum(AttendanceStatus)
  status?: AttendanceStatus;
}
