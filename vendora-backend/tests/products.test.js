// @module test | Vendora v1.0 | SPIT Mini Project AY 2026-27
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');

describe('Public products API', () => {
  test('GET /api/products returns array + pagination', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.pagination).toBeTruthy();
  });

  test('GET /api/products?category_id=1 returns only Electronics', async () => {
    const response = await request(app).get('/api/products?category_id=1');
    expect(response.status).toBe(200);
    expect(response.body.data.every((item) => item.category_name === 'Electronics')).toBe(true);
  });

  test('GET /api/products?search=headphone returns matching results', async () => {
    const response = await request(app).get('/api/products?search=headphone');
    expect(response.status).toBe(200);
    expect(response.body.data.some((item) => item.name.toLowerCase().includes('headphone'))).toBe(true);
  });

  test('GET /api/products/:id valid returns product + reviews', async () => {
    const response = await request(app).get('/api/products/1');
    expect(response.status).toBe(200);
    expect(response.body.data.reviews).toBeDefined();
  });

  test('GET /api/products/99999 returns 404', async () => {
    const response = await request(app).get('/api/products/99999');
    expect(response.status).toBe(404);
  });
});
