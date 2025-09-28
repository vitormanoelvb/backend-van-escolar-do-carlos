<h1 align="center">🚐 VanGo Carlos — Backend API 📑</h1>

Projeto final da disciplina de **Desenvolvimento Web (Backend)**, desenvolvido para atender às necessidades de gestão de transporte escolar do empresário fictício **Sr. Lucas Matos**.  

O sistema foi construído em **Node.js (NestJS + Prisma + MySQL)**, com arquitetura modular, boas práticas de validação e autenticação, e integração com Insomnia para documentação interativa das rotas.  

---

## 🚀 Funcionalidades Principais

### 🔹 Alunos (/students)
- CRUD completo.  
- Filtros avançados por nome, escola, status e poltrona.  
- **Regra crítica:** apenas um aluno ativo por poltrona.  

### 🔹 Pagamentos (/payments)
- CRUD completo de mensalidades.  
- Filtros por mês (YYYY-MM), status (aberto, pago, atrasado) e aluno.  
- Relacionamento direto com estudantes (1:N).  
- Paginação otimizada para consultas.  

### 🔹 Chamadas (/attendance)
- Registro eficiente de presença por **data + rota + aluno**.  
- **Chave composta** evita duplicidade de chamadas no mesmo dia.  

### 🔹 Rotas (/routes) e Paradas (/route-stops)
- Cadastro de rotas escolares.  
- Associação de motoristas via PATCH.  
- Paradas vinculadas com validação de `orderIndex` único por rota.  

### 🔹 Usuários (/users) e Autenticação (/auth)
- Cadastro e gestão de usuários administrativos.  
- Senhas criptografadas com **bcrypt**.  
- Login com **JWT**, consulta de perfil autenticado (`/me`).  
- Fluxo de recuperação de senha seguro (`/forgot-password` + `/reset-password`).  

---

## 🛠️ Arquitetura e Banco de Dados

- **Framework:** NestJS (arquitetura modular, princípios SOLID).  
- **ORM:** Prisma ORM com migrations automáticas.  
- **Banco:** MySQL 8+ com índices e chaves compostas.  
- **Relacionamentos:**
  - 1:N → Estudante → Pagamentos  
  - 1:N → Estudante → Chamadas  
  - 1:N → Rota → Paradas  
  - 1:1 → Rota → Motorista  

**Destaques técnicos:**  
- Índices únicos em poltronas de alunos ativos.  
- Índices únicos em `orderIndex` de paradas.  
- Chaves compostas em chamadas (integridade garantida).  

---

## 🖥️ Guia de Execução

### 🔧 Pré-requisitos
- Node.js 20+  
- MySQL 8+  
- NPM ou Yarn  

### ▶️ Passos para rodar
```bash
# Clonar o repositório
git clone https://github.com/vitormanoelvb/backend-van-escolar-do-carlos.git
cd backend-van-escolar-do-carlos

# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Criar arquivo .env na raiz:
DATABASE_URL="mysql://usuario:senha@localhost:3306/van_escolar"
JWT_SECRET="sua_chave_jwt"
JWT_EXPIRES="7d"

# Rodar migrations
npx prisma migrate dev

# Executar servidor
npm run start:dev

# Acessar API
http://localhost:3000
```

---

## 📑 Documentação e Recursos

- **Insomnia Collections** exportadas para todas as entidades.  
- **Mensagens:** em português para usuários finais.  
- **Rotas:** em inglês (simulação de outsourcing de empresa americana).  
- **Repositório Oficial:** [VanGo Carlos - Backend](https://github.com/vitormanoelvb/backend-van-escolar-do-carlos/tree/main)  

---

## 👨‍💻 Autoria e Créditos

- **Desenvolvedores:**  
  - Jonathan Weverton Rodrigues Batista  
  - José Pedro Fernandes Pereira Abreu  
  - Vinícius Soares Ferreira  
  - Vitor Manoel Vidal Braz  

- **Instituição:** Univale — Universidade Vale do Rio Doce  
- **Empresa fictícia contratada:** JJVV Systems (outsourcing americano)  
- **Cliente final:** Sr. Lucas Matos — VanGo Carlos  

---

<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Project setup

```bash
$ npm install
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Run tests

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## Deployment

When you're ready to deploy your NestJS application to production, there are some key steps you can take to ensure it runs as efficiently as possible. Check out the [deployment documentation](https://docs.nestjs.com/deployment) for more information.

If you are looking for a cloud-based platform to deploy your NestJS application, check out [Mau](https://mau.nestjs.com), our official platform for deploying NestJS applications on AWS. Mau makes deployment straightforward and fast, requiring just a few simple steps:

```bash
$ npm install -g @nestjs/mau
$ mau deploy
```

With Mau, you can deploy your application in just a few clicks, allowing you to focus on building features rather than managing infrastructure.

## Resources

Check out a few resources that may come in handy when working with NestJS:

- Visit the [NestJS Documentation](https://docs.nestjs.com) to learn more about the framework.
- For questions and support, please visit our [Discord channel](https://discord.gg/G7Qnnhy).
- To dive deeper and get more hands-on experience, check out our official video [courses](https://courses.nestjs.com/).
- Deploy your application to AWS with the help of [NestJS Mau](https://mau.nestjs.com) in just a few clicks.
- Visualize your application graph and interact with the NestJS application in real-time using [NestJS Devtools](https://devtools.nestjs.com).
- Need help with your project (part-time to full-time)? Check out our official [enterprise support](https://enterprise.nestjs.com).
- To stay in the loop and get updates, follow us on [X](https://x.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs).
- Looking for a job, or have a job to offer? Check out our official [Jobs board](https://jobs.nestjs.com).

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://twitter.com/kammysliwiec)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](https://github.com/nestjs/nest/blob/master/LICENSE).
