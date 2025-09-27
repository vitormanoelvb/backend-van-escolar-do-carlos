import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

type JwtPayload = {
  sub: string | number;
  email: string;
};

type AuthedRequest = Request & {
  user?: { id: bigint; email: string };
};

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthedRequest>();

    const authHeader = req.headers['authorization'];
    if (typeof authHeader !== 'string') {
      throw new UnauthorizedException('Token ausente.');
    }

    const [scheme, token] = authHeader.split(' ');
    if (scheme?.toLowerCase() !== 'bearer' || !token) {
      throw new UnauthorizedException('Token ausente.');
    }

    try {
      const payload = this.jwt.verify<JwtPayload>(token, {
        secret: process.env.JWT_SECRET ?? 'dev-secret',
      });

      req.user = { id: BigInt(payload.sub), email: payload.email };
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido.');
    }
  }
}
