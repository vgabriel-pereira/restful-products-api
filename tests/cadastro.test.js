const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const url = '/cadastro'


describe("Teste funcionalidade /cadastro", () => {
    test("Teste POST 201", async () => {
        const novoUsuario = {
            nome: "Teste", email: `teste${Date.now()}@gamil.com`, password: "1234"
        }
        const response = await request.post(url).send(novoUsuario)
        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("nome", novoUsuario.nome);
        expect(response.body).toHaveProperty("email", novoUsuario.email);
        expect(response.body).not.toBe("password");
        expect(response.body).not.toBe("PasswordHash");
    })

})

describe("Validação de campos obrigatórios", () => {
    test("Erro 400 se faltar nome", async () => {
        const response = await request.post(url).send({
            email: "teste1@example.com",
            password: "1234"
        })
        expect(response.status).toBe(400)
        expect(response.body.msg).toBe("Campos obrigatórios faltando")
    })

    test("Erro 400 se faltar email", async () => {
        const response = await request.post(url).send({
            nome: "Teste",
            password: "1234"
        })
        expect(response.status).toBe(400)
        expect(response.body.msg).toBe("Campos obrigatórios faltando")
    })

    test("Erro 400 se faltar password", async () => {
        const response = await request.post(url).send({
            nome: "Teste",
            email: "teste2@example.com"
        })
        expect(response.status).toBe(400)
        expect(response.body.msg).toBe("Campos obrigatórios faltando")
    })
})