const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)
jest.setTimeout(10000);

const makeUser = (overrides = {}) => ({
  name: "Teste",
  email: `teste${Date.now()}@gmail.com`,
  password: "1234",
  ...overrides
})

const register = (payload) => request.post('/api/v1/auth/register').send(payload)
const login = (payload) => request.post('/api/v1/auth/login').send(payload)
const getProfile = (token, id) =>
  request.get(`/api/v1/auth/profile/${id}`).set('Authorization', `Bearer ${token}`)
const updateUser = (token, id, payload) =>
  request.patch(`/api/v1/auth/update/${id}`).set('Authorization', `Bearer ${token}`).send(payload)
const deleteUser = (token, id) =>
  request.delete(`/api/v1/auth/delete/${id}`).set('Authorization', `Bearer ${token}`)

let authToken = null
let createdUser = null
let createdUserId = null

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

      createdUser = novoUsuario
      createdUserId = response.body.data._id
    })

    test.each([
      [{ email: "teste@example.com", password: "1234" }, "nome"],
      [{ name: "Teste", password: "1234" }, "email"],
      [{ name: "Teste", email: "teste2@example.com" }, "password"],
      [{}, "nome/email/password"],
    ])("Erro 400 se faltar campo obrigatório (%s)", async (payload, missingFieldDesc) => {
      const response = await register(payload)
      expect(response.status).toBe(400)
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
      expect(response.body.payload).toHaveProperty("email", createdUser.email)

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
  })

  describe("GET /profile/:id", () => {
    test("Retorna 200 e dados do usuário logado", async () => {
      const response = await getProfile(authToken, createdUserId)
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty("email", createdUser.email)
    })

    test("Retorna 400 se ID inválido", async () => {
      const response = await getProfile(authToken, "123")
      expect(response.status).toBe(400)
      expect(response.body.msg).toBe("Parâmetro inválido")
    })

    test("Retorna 404 se usuário não existir", async () => {
      const fakeId = "66e68c8a0f9b9a26a4e89fff"
      const response = await getProfile(authToken, fakeId)
      expect(response.status).toBe(404)
      expect(response.body.msg).toBe("Usuário não encontrado")
    })

    test("Retorna 401 se token ausente", async () => {
      const response = await request.get(`/api/v1/auth/profile/${createdUserId}`)
      expect(response.status).toBe(401)
      expect(response.body.error).toBe("Token não fornecido")
    })
  })

  describe("PATCH /update/:id", () => {
    test("Retorna 200 ao atualizar parcialmente o usuário", async () => {
      const response = await updateUser(authToken, createdUserId, { name: "Novo Nome" })
      expect(response.status).toBe(200)
      expect(response.body.data).toHaveProperty("name", "Novo Nome")
    })

    test("Retorna 400 se ID inválido", async () => {
      const response = await updateUser(authToken, "123", { name: "X" })
      expect(response.status).toBe(400)
      expect(response.body.msg).toBe("Parâmetro inválido")
    })

    test("Retorna 404 se usuário não existir", async () => {
      const fakeId = "66e68c8a0f9b9a26a4e89fff"
      const response = await updateUser(authToken, fakeId, { name: "Fake" })
      expect(response.status).toBe(404)
      expect(response.body.msg).toBe("Usuário não encontrado")
    })

    test("Retorna 401 se token ausente", async () => {
      const response = await request.patch(`/api/v1/auth/update/${createdUserId}`).send({ name: "X" })
      expect(response.status).toBe(401)
      expect(response.body.error).toBe("Token não fornecido")
    })
  })

  describe("DELETE /delete/:id", () => {
    test("Retorna 204 e confirma exclusão do usuário", async () => {
      const response = await deleteUser(authToken, createdUserId)
      expect(response.status).toBe(204)
    })

    test("Retorna 401 se token ausente", async () => {
      const response = await request.delete(`/api/v1/auth/delete/${createdUserId}`)
      expect(response.status).toBe(401)
      expect(response.body.error).toBe("Token não fornecido")
    })
  })
})
