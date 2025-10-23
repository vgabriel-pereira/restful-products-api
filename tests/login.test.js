const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const url = '/login'

describe("Teste rota POST /login", ()=>{
    test("POST /login retorna 200", async () => {
        const response = (await request.post(url)).send({email: "teste@gamil.com", password: "123"})

        expect(response.status).toBe(200)
    })

    test("Login retorna 401 se senha incorreta",async () => {
        const response = (await request.post(url)).send({email: "teste@gamil.com", password: "incorreta"})

        expect(response.status).toBe(401)
        expect(response.body.msg).toBe("Usuario/Senha Invalidos")
    })
})
