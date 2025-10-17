const supertest = require('supertest')
const app = require('../app')
const request = supertest(app)

const url = '/cadastro'

describe("Teste funcionalidade /cadastro", () => {
    test("Teste POST 201", async () => {
        const response = await request.post(url).send({
            name: "Teste", email: "teste@gamil.com", PasswordHash: "1234"
        })
        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toHaveProperty("_id");
        expect(response.body).toHaveProperty("name", novoUsuario.name);
        expect(response.body).toHaveProperty("email", novoUsuario.email);
        expect(response.body).not.toHaveProperty("password");
        expect(response.body).not.toHaveProperty("PasswordHash");
    })

    test("Teste POST 400 Apenas email", async () => {
        const response = await request.post(url).send({emial: "teste@outlook.com"})
        expect(response.status).toBe(400)
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toHaveProperty("err")
    })
        test("Teste POST 400 Apenas email", async () => {
        const response = await request.post(url).send({name: "teste"})
        expect(response.status).toBe(400)
        expect(response.headers["content-type"]).toMatch(/json/);
        expect(response.body).toHaveProperty("err")
    })
})