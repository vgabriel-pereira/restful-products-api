const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const url = '/login'

const validCredentials = { email: "teste@gamil.com", password: "1234" }
const wrongPassword = { email: "teste@gamil.com", password: "incorreta" }
const wrongEmail = { email: "incorreto@gamil.com", password: "1234" }

const login = (payload) => request.post(url).send(payload)

describe("Teste rota POST /login", () => {
	test("POST /login retorna 200 e body contém token", async () => {
		const response = await login(validCredentials)
		expect(response.status).toBe(200)
		expect(response.headers["content-type"]).toMatch(/json/)
		expect(response.body).toHaveProperty("token")
		expect(typeof response.body.token).toBe("string")
		expect(response.body.token.length).toBeGreaterThan(0)
	})

	test("Login retorna 401 se senha incorreta", async () => {
		const response = await login(wrongPassword)
		expect(response.status).toBe(401)
		expect(response.headers["content-type"]).toMatch(/json/)
		expect(response.body.msg).toBe("Usuario ou Senha Invalido")
	})

	test("Login retorna 401 se email incorreto", async () => {
		const response = await login(wrongEmail)
		expect(response.status).toBe(401)
		expect(response.headers["content-type"]).toMatch(/json/)
		expect(response.body.msg).toBe("Usuario ou Senha Invalido")
	})

	test.each([
		[{ email: "" }, "Usuario/Senha são obrigatórios"],
		[{ password: "" }, "Usuario/Senha são obrigatórios"],
		[{}, "Usuario/Senha são obrigatórios"],
	])("POST /login retorna 422 quando campos obrigatórios faltam (%p)", async (payload, expectedMsg) => {
		const response = await login(payload)
		expect(response.status).toBe(422)
		expect(response.headers["content-type"]).toMatch(/json/)
		expect(response.body.msg).toBe(expectedMsg)
	})
})
