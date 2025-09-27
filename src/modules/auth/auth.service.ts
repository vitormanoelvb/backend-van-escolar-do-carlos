import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../database/PrismaService';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

type JwtPayload = { sub: bigint; email: string };

type SensitiveFields = {
  passwordHash?: unknown;
  resetToken?: unknown;
  resetExpires?: unknown;
};

type PublicUser = Omit<User & SensitiveFields, keyof SensitiveFields>;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  private async hashPassword(plain: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(plain, saltRounds);
  }

  private async checkPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }

  private signToken(userId: bigint, email: string): string {
    const payload: JwtPayload = { sub: userId, email };
    return this.jwt.sign(payload);
  }

  private sanitizeUser<T extends object>(
    user: T & SensitiveFields,
  ): Omit<T & SensitiveFields, keyof SensitiveFields> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, resetToken, resetExpires, ...rest } = user;
    return rest;
  }

  private toPtUser(user: User) {
    return {
      id: user.id,
      nome: user.name,
      email: user.email,
      cargo: user.role,
      criadoEm: user.createdAt,
      atualizadoEm: user.updatedAt,
    };
  }

  async login(dto: LoginDto): Promise<{ message: string; token: string; user: PublicUser }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (!user) {
      throw new UnauthorizedException('Usuário não existe.');
    }

    const ok = await this.checkPassword(dto.password, user.passwordHash);
    if (!ok) {
      throw new UnauthorizedException('Senha incorreta.');
    }

    const token = this.signToken(user.id, user.email);

    return {
      message: 'Login realizado com sucesso.',
      token,
      user: this.toPtUser(user) as unknown as PublicUser,
    };
  }

  async me(userId: bigint): Promise<{ message: string; data: PublicUser }> {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuário não encontrado.');
    }

    return {
      message: 'Perfil carregado com sucesso.',
      data: this.toPtUser(user) as unknown as PublicUser,
    };
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
    });

    if (user) {
      const token = crypto.randomBytes(32).toString('hex');
      const expires = new Date(Date.now() + 1000 * 60 * 30);
      await this.prisma.user.update({
        where: { id: user.id },
        data: { resetToken: token, resetExpires: expires },
      });
    }

    return {
      message: 'Se o e-mail existir, enviaremos instruções para redefinir a senha.',
    };
  }

  async resetPassword(dto: ResetPasswordDto): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: {
        resetToken: dto.token,
        resetExpires: { gt: new Date() },
      },
    });

    if (!user) {
      throw new BadRequestException('Token inválido ou expirado.');
    }

    const newHash = await this.hashPassword(dto.newPassword);

    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: newHash,
        resetToken: null,
        resetExpires: null,
      },
    });

    return { message: 'Senha redefinida com sucesso.' };
  }
}
