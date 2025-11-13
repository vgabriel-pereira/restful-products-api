const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const makeUser = (overrides = {}) => ({
  name: "Teste",
  email: `teste${Date.now()}@gmail.com`,
  password: "1234",
  ...overrides
})

const register = (payload) => request.post('/api/v1/auth/register').send(payload)
const login = (payload) => request.post('/api/v1/auth/login').send(payload)
const getProfile = (token) =>
  request.get('/api/v1/auth/profile').set('Authorization', `Bearer ${token}`)
const updateUser = (token, payload) =>
  request.patch('/api/v1/auth/update').set('Authorization', `Bearer ${token}`).send(payload)
const deleteUser = (token) =>
  request.delete('/api/v1/auth/delete').set('Authorization', `Bearer ${token}`)

let authToken = null
let createdUser = null

describe("Testes da funcionalidade de Autenticação (/api/v1/auth)", () => {
  describe("POST /register", () => {
    test("Deve retornar 201 e dados do usuário criado", async () => {
      const novoUsuario = makeUser()
      const response = await register(novoUsuario)

      expect(response.status).toBe(201)
      expect(response.headers["content-type"]).toMatch(/json/)

      expect(response.body.data).toHaveProperty("_id")
      expect(typeof response.body.data._id).toBe("string")
      expect(response.body.data).toHaveProperty("name", novoUsuario.name)
      expect(response.body.data).toHaveProperty("email", novoUsuario.email)

      expect(response.body).not.toHaveProperty("password")
      expect(response.body).not.toHaveProperty("passwordHash")

      createdUser = novoUsuario
    })

    test.each([
      [{ email: "teste@example.com", password: "1234" }, "nome"],
      [{ name: "Teste", password: "1234" }, "email"],
      [{ name: "Teste", email: "teste2@example.com" }, "password"],
      [{}, "nome/email/password"],
    ])("Erro 400 se faltar campo obrigatório (%s)", async (payload, missingFieldDesc) => {
      const response = await register(payload)
      expect(response.status).toBe(400)
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.body.msg).toBe("Campos obrigatórios faltando")
    })
  })

  describe("POST /login", () => {
    test("Deve retornar 200 e token JWT válido", async () => {
      const response = await login({
        email: createdUser.email,
        password: createdUser.password,
      })

      expect(response.status).toBe(200)
      expect(response.body).toHaveProperty("token")
      expect(typeof response.body.token).toBe("string")
      expect(response.body.token.length).toBeGreaterThan(0)

      authToken = response.body.token
    })

    test("Retorna 401 se senha incorreta", async () => {
      const response = await login({
        email: createdUser.email,
        password: "errada",
      })
      expect(response.status).toBe(401)
      expect(response.body.msg).toBe("Usuário ou senha inválido")
    })

    test("Retorna 401 se email incorreto", async () => {
      const response = await login({
        email: "naoexiste@gmail.com",
        password: "1234",
      })
      expect(response.status).toBe(401)
      expect(response.body.msg).toBe("Usuário ou senha inválido")
    })

    test.each([
      [{ email: "" }, "Usuário/Senha são obrigatórios"],
      [{ password: "" }, "Usuário/Senha são obrigatórios"],
      [{}, "Usuário/Senha são obrigatórios"],
    ])("Retorna 422 quando campos obrigatórios faltam (%p)", async (payload, expectedMsg) => {
      const response = await login(payload)
      expect(response.status).toBe(422)
      expect(response.body.msg).toBe(expectedMsg)
    })
  })


  describe("GET /profile", () => {
    test("Retorna 200 e dados do usuário logado", async () => {
      const response = await getProfile(authToken)

      expect(response.status).toBe(200)
      expect(response.headers["content-type"]).toMatch(/json/)
      expect(response.body.data).toHaveProperty("email", createdUser.email)
    })

    test("Retorna 401 se token não for enviado", async () => {
      const response = await getProfile("")
      expect(response.status).toBe(401)
      expect(response.body.msg).toBe("Token de autenticação ausente ou inválido")
    })

    test("Retorna 401 se token inválido", async () => {
      const response = await getProfile("Bearer token_falso")
      expect(response.status).toBe(401)
      expect(response.body.msg).toBe("Token de autenticação ausente ou inválido")
    })
    test("Retorna 404 se usuário não existir mais", async () => {
      const fakeToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake"
      const response = await getProfile(fakeToken)
      expect(response.status).toBe(404)
      expect(response.body.msg).toBe("Usuário não encontrado")
    })
  })

  describe("PATCH /update", () => {
    test("Retorna 200 ao atualizar parcialmente o usuário", async () => {
      const response = await updateUser(authToken, { name: "Novo Nome" })

      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty("name", "Novo Nome")
    })

    test("Retorna 422 se payload estiver vazio", async () => {
      const response = await updateUser(authToken, {})
      expect(response.status).toBe(422)
      expect(response.body.msg).toBe("Nenhum campo enviado para atualização")
    })

    test("Retorna 401 se token ausente", async () => {
      const response = await request.patch('/api/v1/auth/update').send({ name: "X" })
      expect(response.status).toBe(401)
      expect(response.body.msg).toBe("Token de autenticação ausente ou inválido")
    })

    test("Retorna 404 se usuário não existir mais", async () => {
      const fakeToken = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.fake"
      const response = await updateUser(fakeToken, { name: "Fake" })
      expect(response.status).toBe(404)
      expect(response.body.msg).toBe("Usuário não encontrado")
    })
  })

  describe("DELETE /delete", () => {
    test("Retorna 204 e confirma exclusão do usuário", async () => {
      const response = await deleteUser(authToken)
      expect(response.status).toBe(204)
      expect(response.body.msg).toBe("Usuário deletado com sucesso")
    })

    test("Retorna 401 se token ausente", async () => {
      const response = await request.delete('/api/v1/auth/delete')
      expect(response.status).toBe(401)
      expect(response.body.msg).toBe("Token de autenticação ausente ou inválido")
    })

    test("Retorna 404 se usuário já foi deletado", async () => {
      const response = await deleteUser(authToken)
      expect(response.status).toBe(404)
      expect(response.body.msg).toBe("Usuário não encontrado")
    })
  })
})
