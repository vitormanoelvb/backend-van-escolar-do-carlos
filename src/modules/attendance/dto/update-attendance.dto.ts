import { PartialType } from '@nestjs/mapped-types';
import { CreateAttendanceDto } from './create-attendance.dto';
import { IsEnum, IsInt, IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';
import { AttendanceStatus } from './create-attendance.dto';

export class UpdateAttendanceDto extends PartialType(CreateAttendanceDto) {
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

  @IsOptional()
  @IsString()
  @MaxLength(255)
  notes?: string;

  @IsOptional()
  @IsInt()
  markedBy?: number;
}
