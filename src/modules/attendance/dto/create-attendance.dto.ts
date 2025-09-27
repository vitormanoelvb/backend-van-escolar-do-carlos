import { IsDateString, IsEnum, IsInt, IsOptional, IsString, MaxLength } from 'class-validator';

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  JUSTIFIED = 'JUSTIFIED',
}

export class CreateAttendanceDto {
  @IsDateString({ strict: true }, { message: 'O campo "date" deve estar no formato YYYY-MM-DD.' })
  date!: string;

  @IsInt({ message: 'O campo "routeId" deve ser um número inteiro.' })
  routeId!: number;

  @IsInt({ message: 'O campo "studentId" deve ser um número inteiro.' })
  studentId!: number;

  @IsEnum(AttendanceStatus, {
    message: 'O campo "status" deve ser um dos seguintes valores: PRESENT, ABSENT ou JUSTIFIED.',
  })
  status!: AttendanceStatus;

  @IsOptional()
  @IsString({ message: 'O campo "notes" deve ser um texto.' })
  @MaxLength(255, { message: 'O campo "notes" não pode ter mais de 255 caracteres.' })
  notes?: string;

  @IsOptional()
  @IsInt({ message: 'O campo "markedBy" deve ser um número inteiro.' })
  markedBy?: number;
}
