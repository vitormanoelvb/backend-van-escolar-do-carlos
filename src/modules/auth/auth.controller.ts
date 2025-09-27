import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

type JwtUser = { id: bigint; email: string };
type AuthedRequest = Request & { user: JwtUser };

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    const res = await this.service.login(dto);
    return {
      message: 'Login realizado com sucesso.',
      token: res.token,
      user: res.user,
    };
  }

  @Post('forgot-password')
  async forgot(@Body() dto: ForgotPasswordDto) {
    const res = await this.service.forgotPassword(dto);
    return { message: res.message };
  }

  @Post('reset-password')
  async reset(@Body() dto: ResetPasswordDto) {
    const res = await this.service.resetPassword(dto);
    return { message: res.message };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async me(@Req() req: AuthedRequest) {
    const res = await this.service.me(req.user.id);
    return {
      message: 'Perfil carregado com sucesso.',
      data: res.data,
    };
  }
}
