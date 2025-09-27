# 🚐 Van Escolar do Carlos — Backend API

[![NestJS](https://img.shields.io/badge/NestJS-red?style=flat&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=flat&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![JWT](https://img.shields.io/badge/JWT-black?style=flat&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)

API REST desenvolvida em **Node.js (NestJS + Prisma + MySQL)** para gerenciamento de transporte escolar.  
O projeto faz parte do desafio final da disciplina **Desenvolvimento Web (Backend)** — 2ª Etapa.

📂 **Repositório do Código:** [GitHub - backend-van-escolar-do-carlos](https://github.com/vitormanoelvb/backend-van-escolar-do-carlos)

---

## 📚 Contexto do Projeto

Durante a concepção do **VanGo Carlos**, o empresário **Sr. Lucas Matos** deixou claro que precisava de uma solução **rápida, prática e barata** para organizar seu transporte escolar.  
O problema: **o orçamento era extremamente limitado**.

Para reduzir custos, Lucas tomou uma decisão ousada: contratou a **JJVV Systems**, uma pequena empresa americana de baixo custo e escala reduzida, especializada em desenvolvimento rápido de protótipos.  
A JJVV Systems entregava soluções funcionais, mas com um padrão bem direto — e, muitas vezes, com partes do código em **inglês**, já que os desenvolvedores eram estrangeiros e trabalhavam com templates prontos.

Assim, nasceu uma característica curiosa do projeto:

- As **mensagens para o usuário final** ficaram em **português**, para atender os pais e responsáveis.  
- As **rotas da API e parte do backend** permaneceram em **inglês**, reflexo do trabalho da empresa contratada e uma forma de **reduzir retrabalho e custos de tradução**.

O resultado foi um sistema **meio bilíngue**, mas que cumpria o objetivo principal: **cadastrar alunos, marcar presença, controlar pagamentos e organizar rotas**. Para o Sr. Lucas, isso era o que realmente importava.

No portfólio, essa escolha mostra como **fatores econômicos e de terceirização impactam diretamente as decisões técnicas**. Mesmo com recursos limitados, o projeto alcançou seus objetivos, **entregando valor ao cliente dentro da realidade financeira**.

---

## ⚙️ Tecnologias Utilizadas

- [NestJS](https://nestjs.com/) — framework Node.js para backend estruturado
- [Prisma ORM](https://www.prisma.io/) — mapeamento objeto-relacional
- [MySQL](https://www.mysql.com/) — banco de dados relacional
- [Class Validator](https://github.com/typestack/class-validator) — validação de DTOs
- [JWT](https://jwt.io/) — autenticação e autorização
- [ESLint + Prettier](https://eslint.org/) — linting e padronização de código

---

## 📦 Instalação & Execução

### 1) Pré-requisitos
- Node.js 18+ → [Baixar Node.js](https://nodejs.org/en/download/)
```bash
  node -v
  npm -v
- npm 9+
- MySQL 8.x
- NestJS CLI (instalar globalmente)
  npm install -g @nestjs/cli


### 2) Instalar dependências
```bash
npm ci
# ou
npm install
```

### 3) Configuração `.env`
Crie o arquivo `.env`:
```env
DATABASE_URL="mysql://root:senha@localhost:3306/vango_carlos"
JWT_SECRET="uma-chave-segura-aleatoria"
JWT_EXPIRES_IN="1d"
PORT=3000
```

### 4) Banco de Dados
```bash
# aplica migrations
npx prisma migrate deploy

# (opcional) roda seeds
npx prisma db seed
```

### 5) Rodar aplicação
```bash
# dev
npm run start:dev

# produção
npm run build && npm run start:prod
```

A API ficará disponível em:  
👉 http://localhost:3000

---

## 🔑 Autenticação

1. **Criar usuário**
```bash
POST /users
{
  "name": "Admin",
  "email": "admin@vango.com",
  "passwordHash": "admin123",
  "role": "OWNER"
}
```

2. **Login**
```bash
POST /auth/login
{
  "email": "admin@vango.com",
  "password": "admin123"
}
```

Resposta:
```json
{
  "message": "Login realizado com sucesso.",
  "token": "<JWT>",
  "user": { "id": "...", "email": "admin@vango.com", "role": "OWNER" }
}
```

> Utilize o **token** no header:
```
Authorization: Bearer <JWT>
```

---

## 🚀 Principais Endpoints

### Users
- `POST /users` → cria usuário  
- `GET /users` → lista todos  
- `GET /users/:id` → busca por id  
- `PATCH /users/:id` → atualiza  
- `DELETE /users/:id` → remove  

### Students
- `POST /students` → cadastra aluno  
- `GET /students` → lista (com paginação/filtros)  
- `GET /students/:id`  
- `PATCH /students/:id`  
- `DELETE /students/:id`  

### Routes
- `POST /routes` → cria rota  
- `GET /routes` / `GET /routes/:id`  
- `PATCH /routes/:id` → atualiza rota e sincroniza paradas  
- `DELETE /routes/:id`  

### Route Stops
- `POST /route-stops` → cria parada  
- `GET /route-stops?routeId=1`  
- `PATCH /route-stops/:id`  
- `DELETE /route-stops/:id`  

### Attendance (Chamadas)
- `POST /attendance` → marca presença (upsert único por aluno/rota/data)  
- `GET /attendance?date=YYYY-MM-DD&routeId=1&studentId=1`  
- `PATCH /attendance/:id`  
- `DELETE /attendance/:id`  

### Payments
- `POST /payments` → cria pagamento  
- `GET /payments?month=YYYY-MM&status=OPEN&studentId=1`  
- `PATCH /payments/:id`  
- `DELETE /payments/:id`  

---

## 📑 Documentação de Consumo

Uma **coleção Insomnia** acompanha o projeto com todas as rotas organizadas:  
- Autenticação  
- Usuários  
- Estudantes  
- Rotas  
- Paradas de Rotas  
- Chamadas  
- Pagamentos  

> Configure `{{baseUrl}}` = `http://localhost:3000`  
> Configure `{{token}}` após login.

---

## 📝 Conclusão

O projeto **van-escolar-api** demonstra a aplicação de **NestJS + Prisma + MySQL** em um contexto real, com múltiplas entidades e relacionamentos.  
A narrativa do Sr. Lucas e a contratação da JJVV Systems mostram como **decisões técnicas também são moldadas por restrições econômicas**, reforçando a autenticidade e o valor entregue pelo sistema.
