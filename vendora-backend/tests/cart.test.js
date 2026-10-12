// @module test | Vendora v1.0 | SPIT Mini Project AY 2026-27
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');

describe('Customer cart API', () => {
  let token;
  beforeAll(async () => {
    const response = await request(app).post('/api/auth/login').send({ email: 'priya.s@gmail.com', password: 'password123' });
    token = response.body.data.token;
  });

  test('POST /api/customer/cart without auth returns 401', async () => {
    const response = await request(app).post('/api/customer/cart').send({ product_id: 9, quantity: 1 });
    expect(response.status).toBe(401);
  });

  test('POST /api/customer/cart with customer token returns 201', async () => {
    const response = await request(app).post('/api/customer/cart').set('Authorization', `Bearer ${token}`).send({ product_id: 9, quantity: 1 });
    expect(response.status).toBe(201);
  });

  test('GET /api/customer/cart returns items + product detail', async () => {
    const response = await request(app).get('/api/customer/cart').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.items.length).toBeGreaterThan(0);
  });

  test('PUT quantity=0 deletes item', async () => {
    const cart = await request(app).get('/api/customer/cart').set('Authorization', `Bearer ${token}`);
    const item = cart.body.data.items.find((row) => row.product_id === 9);
    const response = await request(app).put(`/api/customer/cart/${item.cart_id}`).set('Authorization', `Bearer ${token}`).send({ quantity: 0 });
    expect(response.status).toBe(200);
  });

  test('DELETE /api/customer/cart/:id returns 200', async () => {
    await request(app).post('/api/customer/cart').set('Authorization', `Bearer ${token}`).send({ product_id: 10, quantity: 1 });
    const cart = await request(app).get('/api/customer/cart').set('Authorization', `Bearer ${token}`);
    const item = cart.body.data.items.find((row) => row.product_id === 10);
    const response = await request(app).delete(`/api/customer/cart/${item.cart_id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
