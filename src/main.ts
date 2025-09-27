import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './database/PrismaService';
import { Logger, ValidationPipe } from '@nestjs/common';

const COLORS = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m',
  yellow: '\x1b[33m',
  magenta: '\x1b[35m',
};

function line(len = 60) {
  return '═'.repeat(len);
}

function center(text: string, width = 60) {
  const left = Math.floor((width - text.length) / 2);
  const right = width - text.length - left;
  return ' '.repeat(Math.max(0, left)) + text + ' '.repeat(Math.max(0, right));
}

const pause = (ms: number) => new Promise((r) => setTimeout(r, ms));

async function splash() {
  console.clear();
  const w = 60;

  console.log(COLORS.cyan + '╔' + line(w) + '╗' + COLORS.reset);

  const title = '🚐 VAN ESCOLAR - API BACKEND 🚐';
  for (let i = 1; i <= title.length; i++) {
    process.stdout.write('\r' + center(title.slice(0, i), w + 2));
    await pause(50);
  }
  console.log();

  console.log(center('Gerencie o transporte escolar com', w + 2));
  console.log(center('segurança, organização e eficiência', w + 2));
  console.log(COLORS.cyan + '╚' + line(w) + '╝' + COLORS.reset);
}

function printCreditsBlock() {
  const w = 60;
  console.log(COLORS.yellow + center('📜 Créditos', w) + COLORS.reset);
  console.log(center('Jonathan Weverton Rodriques Batista', w));
  console.log(center('José Pedro Fernandes Pereira Abreu', w));
  console.log(center('Vínicius Soares Ferreira', w));
  console.log(center('Vitor Manoel Vidal Braz', w));
  console.log(center('Protótipo (papel/digital) → API Backend', w));
  console.log(COLORS.magenta + center('Powered By JJVV Systems', w) + COLORS.reset);
  console.log(COLORS.magenta + center('Assinatura Oficial: @jjvvsystems2025', w) + COLORS.reset);
}

function printReady(port: number) {
  const w = 60;
  console.log(COLORS.cyan + '╔' + line(w) + '╗' + COLORS.reset);
  console.log(
    center(`${COLORS.green}✔ Conectado com sucesso ao banco de dados${COLORS.reset}`, w + 2),
  );
  console.log(
    center(`${COLORS.cyan}✔ Servidor iniciado em: http://localhost:${port}${COLORS.reset}`, w + 2),
  );
  console.log(center('✔ Acesse via navegador ou Insomnia/Postman', w + 2));
  console.log(COLORS.cyan + '╚' + line(w) + '╝' + COLORS.reset);

  printCreditsBlock();

  console.log(
    COLORS.gray +
      center('© ' + new Date().getFullYear() + ' — Todos os direitos reservados', w) +
      COLORS.reset,
  );
}

declare global {
  interface BigInt {
    toJSON(): string;
  }
}

BigInt.prototype.toJSON = function (this: bigint): string {
  return this.toString();
};

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, { logger });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  app.enableCors();

  const prisma = app.get(PrismaService);
  const port = Number(process.env.PORT ?? 3000);

  try {
    await prisma.$connect();
    await splash();
    await pause(250);
    console.clear();
    printReady(port);
    await app.listen(port);
  } catch (error) {
    const w = 60;
    console.log(COLORS.red + '╔' + line(w) + '╗' + COLORS.reset);
    console.error(center('✖ Erro ao conectar ao banco de dados', w + 2));
    console.log(COLORS.red + '╚' + line(w) + '╝' + COLORS.reset);
    console.error(error);
    process.exit(1);
  }
}

bootstrap().catch((err) => {
  console.error(`${COLORS.red}✖ Erro crítico no bootstrap${COLORS.reset}`, err);
  process.exit(1);
});
