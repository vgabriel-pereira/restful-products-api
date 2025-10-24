const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const url = '/login'

describe("Teste rota POST /login", () => {
    test("POST /login retorna 200", async () => {
        const response = await request.post(url).send({ email: "teste@gamil.com", password: "1234" })
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toBe(200)
    })

    test("Login retorna 401 se senha incorreta", async () => {
        const response = await request.post(url).send({ email: "teste@gamil.com", password: "incorreta" })
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.status).toBe(401)
        expect(response.body.msg).toBe("Usuario ou Senha Invalido")
    })

    test("Login retorna 401 se email incorreto", async () => {
        const response = await request.post(url).send({ email: "incorreto@gamil.com", password: "1234" })
        expect(response.status).toBe(401)
        expect(response.body.msg).toBe("Usuario ou Senha Invalido")
        expect(response.headers["content-type"]).toMatch(/json/);
    })

    test("POST /login retorna 422", async () => {
        const response = await request.post(url).send({email: ""})
        expect(response.status).toBe(422)
        expect(response.body.msg).toBe("Usuario/Senha são obrigatórios")
        expect(response.headers["content-type"]).toMatch(/json/);
    })
})
