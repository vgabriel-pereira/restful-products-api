const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const url = '/api/v1/products'


const makeProduct = (overrides = {}) => ({
	name: `Produto ${Date.now()}`,
	price: 10.0,
	description: "Descrição do produto",
	...overrides
})

const createProduct = (payload, token) => {
	const req = request.post(url)
	if (token) req.set('Authorization', `Bearer ${token}`)
	return req.send(payload)
}

let id = null
let token = null

describe("Teste rota /produtos", () => {
	// obter token válido usando as credenciais de teste existentes
	beforeAll(async () => {
		const validCredentials = { email: "teste@gamil.com", password: "1234" }

		// tentativa de login com retries (pequeno delay entre tentativas)
		const tryLogin = async (credentials, attempts = 5, delayMs = 200) => {
			for (let i = 0; i < attempts; i++) {
				const res = await request.post('/login').send(credentials)
				if (res && res.body && res.body.token) return res
				await new Promise(r => setTimeout(r, delayMs))
			}
			return null
		}

		const loginRes = await tryLogin(validCredentials, 5, 200)

		if (!loginRes || !loginRes.body || !loginRes.body.token) {
			const debugRes = loginRes ? { status: loginRes.status, body: loginRes.body } : null
			throw new Error('Não foi possível obter token de login no beforeAll usando as credenciais de teste. Última resposta: ' + JSON.stringify(debugRes))
		}

		token = loginRes.body.token
	})

	test("POST /produtos retorna 201 e body válido", async () => {
		const payload = makeProduct()
		const response = await createProduct(payload, token)

		expect(response.status).toBe(201)
		expect(response.headers["content-type"]).toMatch(/json/)

		expect(response.body._id).toBeDefined()
		expect(typeof response.body._id).toBe("string")
		expect(response.body._id.length).toBeGreaterThan(0)

		expect(response.body.name).toBe(payload.name)

		expect(typeof response.body.price).toBe("number")
		expect(response.body.price).toBeCloseTo(payload.price)
		id = response.body._id
	})

	test.each([
		[null, "sem body"],
		[{ name: "SomenteNome" }, "falta preco"],
		[{ price: 5.0 }, "falta nome"],
		[{ name: "x", price: "nao-num" }, "preco invalido"]
	])("POST /produtos retorna 422 quando %s (%s)", async (payload, desc) => {

		const req = payload === null
			? request.post(url).set('Authorization', `Bearer ${token}`)
			: createProduct(payload, token)

		const response = await req
		expect(response.status).toBe(422)
		expect(response.headers["content-type"]).toMatch(/json/)
		expect(response.body.msg).toBe("Nome e preço do produto são obrigatórios")
	})

	test("GET /produtos retorna 200", async () => {
		const response = await request.get(url)
		expect(response.status).toBe(200)
		expect(response.headers["content-type"]).toMatch(/json/)

		expect(Array.isArray(response.body)).toBe(true)
		expect(response.body.length).toBeGreaterThanOrEqual(1)

		response.body.forEach(item => {
			expect(item).toHaveProperty('_id')
			expect(item).toHaveProperty('name')
			expect(item).toHaveProperty('price')
			expect(typeof item.price).toBe('number')
		})

		if (id) {
			const found = response.body.find(p => p._id === id)
			expect(found).toBeDefined()
			expect(found.name).toBeDefined()
			expect(typeof found.price).toBe('number')
		}
	})

	test("GET /produtos/id retorna 200", async () => {
		const response = await request.get(`${url}/${id}`)
		expect(response.status).toBe(200)
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body._id).toBe(id)
		expect(response.body.price).toBe(10)

	})
	test("GET /produtos/0 retorna 400", async () => {
		const response = await request.get(`${url}/0`)
		expect(response.status).toBe(400)
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.msg).toBe("Parâmetro inválido")
	})
	test("GET /produtos/id retorna 404", async () => {
		const response = await request.get(`${url}/000000000000000000000000`)
		expect(response.status).toBe(404)
		expect(response.headers["content-type"]).toMatch(/json/);
		expect(response.body.msg).toBe("Produto não encontrado")
	})
})