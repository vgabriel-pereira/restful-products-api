# 📦 RESTful Products API

API RESTful para gerenciamento de produtos, com autenticação JWT, controle de acesso baseado em papéis (customer/admin) e documentação via Swagger.  
Desenvolvida em **Node.js + Express** com banco de dados **MongoDB (Mongoose)**.

---

## 🚀 Tecnologias Utilizadas

- **Node.js**
- **Express**
- **MongoDB + Mongoose**
- **JWT**
- **Bcrypt**
- **Swagger (OpenAPI 3.0)**
- **Jest** (testes unitários)
- **dotenv**

---

## 📚 Documentação da API (Swagger)

Acesse a documentação navegável:

/api-docs

yaml
Copiar código

Ou consulte o arquivo principal:

swagger.yaml

yaml
Copiar código

---

## ⚙️ Requisitos

- Node.js **v18+**
- MongoDB (local ou remoto — Atlas)
- npm ou yarn

---

## 📥 Instalação

```bash
# Clonar repositório
git clone https://github.com/seu-usuario/restful-products-api.git

cd restful-products-api

# Instalar dependências
npm install
🔧 Configuração das Variáveis de Ambiente
O projeto já possui um arquivo .env.example.

Crie o .env baseado nele:

bash
Copiar código
cp .env.example .env
Edite os valores conforme o seu ambiente.

▶️ Executando o Projeto
Ambiente de desenvolvimento
bash
Copiar código
npm run dev
Ambiente de produção
bash
Copiar código
npm start
🧪 Testes
bash
Copiar código
npm test
🗂 Estrutura do Projeto
pgsql
Copiar código
restful-products-api/
│
├── controllers/
├── middlewares/
├── models/
├── routes/
├── utils/
│
├── swagger.yaml
├── app.js
├── server.js
├── package.json
├── .env.example
└── README.md
🔐 Autenticação & Autorização
A API utiliza:

JWT

RBAC (Role-Based Access Control)

Papéis disponíveis:
customer → pode visualizar produtos

admin → pode criar, atualizar e deletar produtos

Envio do token de autenticação:

makefile
Copiar código
Authorization: Bearer <token>
📌 Rotas Disponíveis
🔑 Auth (/api/v1/auth)
POST /api/v1/auth/register
Registra um novo usuário.

POST /api/v1/auth/login
Retorna um token JWT.

🛒 Products (/api/v1/products)
GET /api/v1/products
Lista todos os produtos.

GET /api/v1/products/:id
Retorna detalhes de um produto.

POST /api/v1/products
Cria um novo produto (apenas admin).

PUT /api/v1/products/:id
Atualiza um produto (apenas admin).

DELETE /api/v1/products/:id
Remove um produto (apenas admin).

📘 Documentação (/api-docs)
GET /api-docs
Interface Swagger UI com todas as rotas e schemas.

📈 Respostas e Erros
Códigos de resposta utilizados:

Código	Significado
200	Sucesso
201	Criado
400	Erro de validação
401	Token inválido/ausente
403	Sem permissão
404	Não encontrado
500	Erro interno

💡 Sugestões de Melhoria
✔️ Código & Arquitetura
Criar camada services/ para limpar os controllers

Criar um middleware de erro global

Implementar validações com Yup, Joi ou Zod

Adicionar logs com Pino ou Winston

✔️ Funcionalidades Futuras
Paginação em /products

Busca por nome/categoria

Upload de imagens

Soft delete

Refresh Token

Rate limiting em /auth/login

✔️ DevOps
Criar docker-compose.yml (API + MongoDB)

Pipeline CI/CD (GitHub Actions)

Publicar documentação no SwaggerHub