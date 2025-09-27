import { IsNotEmpty, IsString, Length } from 'class-validator';

export class ResetPasswordDto {
  @IsString({ message: 'Token inválido.' })
  @IsNotEmpty({ message: 'Token é obrigatório.' })
  token!: string;

  @IsString({ message: 'Senha deve ser um texto.' })
  @Length(6, 72, { message: 'Digite uma senha acima de 6 caracteres.' })
  newPassword!: string;
}
