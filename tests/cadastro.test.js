const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const url = '/cadastro'

const makeUser = (overrides = {}) => ({
	name: "Teste",
	email: `teste${Date.now()}@gamil.com`,
	password: "1234",
	...overrides
})

const cadastro = (payload) => request.post(url).send(payload)

describe("Teste funcionalidade /cadastro", () => {
	test("Teste POST 201", async () => {
		const novoUsuario = makeUser()
		const response = await cadastro(novoUsuario)

		expect(response.status).toBe(201)
		expect(response.headers["content-type"]).toMatch(/json/)

		expect(response.body.data).toHaveProperty("_id")
		expect(typeof response.body.data._id).toBe("string")
		expect(response.body.data).toHaveProperty("name", novoUsuario.name)
		expect(response.body.data).toHaveProperty("email", novoUsuario.email)

		expect(response.body).not.toHaveProperty("password")
		expect(response.body).not.toHaveProperty("passwordHash")
	})
})

describe("Validação de campos obrigatórios", () => {
	test.each([
		[{ email: "teste1@example.com", password: "1234" }, "nome"],
		[{ nome: "Teste", password: "1234" }, "email"],
		[{ nome: "Teste", email: "teste2@example.com" }, "password"],
		[{}, "nome/email/password"],
	])("Erro 400 se faltar campo obrigatorio (%s)", async (payload, missingFieldDesc) => {
		const response = await cadastro(payload)
		expect(response.status).toBe(400)
		expect(response.headers["content-type"]).toMatch(/json/)
		expect(response.body.msg).toBe("Campos obrigatórios faltando")
	})
})