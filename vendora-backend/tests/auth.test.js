// @module test | Vendora v1.0 | SPIT Mini Project AY 2026-27
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');

describe('Authentication API', () => {
  const email = `test.customer.${Date.now()}@example.com`;
  let token;

  test('POST /api/auth/register with valid customer data returns 201 + token', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Test Customer', email, password: 'password123', role: 'customer',
    });
    expect(response.status).toBe(201);
    expect(response.body.data.token).toBeTruthy();
  });

  test('POST /api/auth/register duplicate email returns 409', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Duplicate Test', email, password: 'password123', role: 'customer',
    });
    expect(response.status).toBe(409);
  });

  test('POST /api/auth/register missing fields returns 422', async () => {
    const response = await request(app).post('/api/auth/register').send({ email: 'bad@example.com' });
    expect(response.status).toBe(422);
  });

  test('POST /api/auth/login correct credentials returns 200 + token + user', async () => {
    const response = await request(app).post('/api/auth/login').send({ email, password: 'password123' });
    expect(response.status).toBe(200);
    expect(response.body.data.token).toBeTruthy();
    expect(response.body.data.user.email).toBe(email);
    token = response.body.data.token;
  });

  test('POST /api/auth/login wrong password returns 401 INVALID_CREDENTIALS', async () => {
    const response = await request(app).post('/api/auth/login').send({ email, password: 'wrong-password' });
    expect(response.status).toBe(401);
    expect(response.body.errorCode).toBe('INVALID_CREDENTIALS');
  });

  test('GET /api/auth/me without token returns 401', async () => {
    const response = await request(app).get('/api/auth/me');
    expect(response.status).toBe(401);
  });

  test('GET /api/auth/me with valid token returns user without password_hash', async () => {
    const response = await request(app).get('/api/auth/me').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.data.password_hash).toBeUndefined();
  });
});
