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

```
/api-docs
```

Ou consulte o arquivo principal:

```
swagger.yaml
```

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
```

## 🔧 Configuração das Variáveis de Ambiente

O projeto já possui um arquivo `.env.example`.

Crie o `.env` baseado nele:

```bash
cp .env.example .env
```

Edite os valores conforme o seu ambiente.

## ▶️ Executando o Projeto

### Ambiente de desenvolvimento

```bash
npm run dev
```

## 🧪 Testes

```bash
npm run test
```

## 🗂 Estrutura do Projeto

```
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
├── package.json
├── .env.example
└── README.md
```

## 🔐 Autenticação & Autorização

A API utiliza:

- **JWT**
- **RBAC** (Role-Based Access Control)

Papéis disponíveis:
- **customer** → pode visualizar produtos
- **admin** → pode criar, atualizar e deletar produtos

Envio do token de autenticação:

```
Authorization: Bearer <token>
```

## 📌 Rotas Disponíveis

### 🔑 Auth (`/api/v1/auth`)

- **POST** `/api/v1/auth/register`  
  Registra um novo usuário.

- **POST** `/api/v1/auth/login`  
  Retorna um token JWT.

### 🛒 Products (`/api/v1/products`)

- **GET** `/api/v1/products`  
  Lista todos os produtos.

- **GET** `/api/v1/products/:id`  
  Retorna detalhes de um produto.

- **POST** `/api/v1/products`  
  Cria um novo produto (apenas usuario logado).

- **PUT** `/api/v1/products/:id`  
  Atualiza um produto (apenas admin e dono do produto).

- **DELETE** `/api/v1/products/:id`  
  Remove um produto (apenas admin e dono do produto).

### 📘 Documentação (`/api-docs`)

- **GET** `/api-docs`  
  Interface Swagger UI com todas as rotas e schemas.

## 📈 Respostas e Erros

Códigos de resposta utilizados:

| Código | Significado |
|--------|-------------|
| 200 | Sucesso |
| 201 | Criado |
| 400 | Erro de validação |
| 401 | Token inválido/ausente |
| 403 | Sem permissão |
| 404 | Não encontrado |
| 500 | Erro interno |
