const supertest = require('supertest');
const app = require('../app');
const request = supertest(app);

const BASE_URL = '/api/v1/products';

const makeProduct = (overrides = {}) => ({
  name: `Produto ${Date.now()}`,
  price: 10.0,
  description: 'Descrição padrão',
  ...overrides,
});

const withAuth = (req, token) =>
  token ? req.set('Authorization', `Bearer ${token}`) : req;

const MSG = {
  INVALID_PARAM: 'Parâmetro inválido',
  NOT_FOUND: 'Produto não encontrado',
  REQUIRED_FIELDS: 'Nome e preço do produto são obrigatórios',
  UNAUTHORIZED: 'Token não fornecido',
};

let token = null;
let productId = null;

beforeAll(async () => {
  const credentials = { email: 'teste@gamil.com', password: '1234' };

  const tryLogin = async (max = 5, delay = 200) => {
    for (let i = 0; i < max; i++) {
      const res = await request.post('/login').send(credentials);
      if (res?.body?.token) return res.body.token;
      await new Promise(r => setTimeout(r, delay));
    }
    return null;
  };

  token = await tryLogin();
  if (!token) throw new Error('Falha ao obter token de login');
});

describe('🔹 /api/v1/products', () => {
  test('POST cria produto válido (201)', async () => {
    const payload = makeProduct();
    const res = await withAuth(request.post(BASE_URL), token).send(payload);

    expect(res.status).toBe(201);
    expect(res.type).toMatch(/json/);

    const { _id, name, price } = res.body;
    expect(_id).toBeDefined();
    expect(name).toBe(payload.name);
    expect(price).toBeCloseTo(payload.price);

    productId = _id;
  });

  test.each([
    [null, 'sem body'],
    [{ name: 'SomenteNome' }, 'sem preço'],
    [{ price: 5.0 }, 'sem nome'],
    [{ name: 'x', price: 'nao-num' }, 'preço inválido'],
  ])('POST inválido retorna 422 (%s)', async (body) => {
    const req = body
      ? withAuth(request.post(BASE_URL), token).send(body)
      : withAuth(request.post(BASE_URL), token);
    const res = await req;

    expect(res.status).toBe(422);
    expect(res.body.msg).toBe(MSG.REQUIRED_FIELDS);
  });

  test('GET lista produtos (200)', async () => {
    const res = await request.get(BASE_URL);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);

    const product = res.body.find(p => p._id === productId);
    expect(product).toMatchObject({
      _id: productId,
      name: expect.any(String),
      price: expect.any(Number),
    });
  });

  describe('GET /:id', () => {
    test('retorna 200 para id válido', async () => {
      const res = await request.get(`${BASE_URL}/${productId}`);
      expect(res.status).toBe(200);
      expect(res.body._id).toBe(productId);
    });

    test('retorna 400 para id inválido', async () => {
      const res = await request.get(`${BASE_URL}/0`);
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe(MSG.INVALID_PARAM);
    });

    test('retorna 404 para id inexistente', async () => {
      const res = await request.get(`${BASE_URL}/000000000000000000000000`);
      expect(res.status).toBe(404);
      expect(res.body.msg).toBe(MSG.NOT_FOUND);
    });
  });

  describe('PUT /:id', () => {
    test('atualiza produto (200)', async () => {
      const update = { name: 'Produto Atualizado', price: 20, description: 'Nova desc' };
      const res = await withAuth(request.put(`${BASE_URL}/${productId}`), token).send(update);

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject(update);
    });

    test('retorna 400 para id inválido', async () => {
      const res = await withAuth(request.put(`${BASE_URL}/0`), token).send({ name: 'Nome', price: 15 });
      expect(res.status).toBe(400);
      expect(res.body.msg).toBe(MSG.INVALID_PARAM);
    });

    test('retorna 404 para id inexistente', async () => {
      const res = await withAuth(request.put(`${BASE_URL}/000000000000000000000000`), token).send({ name: 'Nome', price: 15 });
      expect(res.status).toBe(404);
      expect(res.body.msg).toBe(MSG.NOT_FOUND);
    });

    test('retorna 401 sem token', async () => {
      const res = await request.put(`${BASE_URL}/${productId}`).send({ name: 'Nome', price: 15 });
      expect(res.status).toBe(401);
    });

    test('retorna 422 sem campos obrigatórios', async () => {
      const res = await withAuth(request.put(`${BASE_URL}/${productId}`), token).send({ description: 'Apenas descrição' });
      expect(res.status).toBe(422);
      expect(res.body.msg).toBe(MSG.REQUIRED_FIELDS);
    });
  });
});
