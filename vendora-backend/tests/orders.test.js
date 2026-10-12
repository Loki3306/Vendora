// @module test | Vendora v1.1 MongoDB | SPIT Mini Project AY 2026-27
process.env.NODE_ENV = 'test';
const request = require('supertest');
const app = require('../server');
const { Product, Notification } = require('../src/models');

describe('Orders API', () => {
  let customerToken;
  let vendorToken;
  let orderId;
  let beforeStock;

  beforeAll(async () => {
    const customer = await request(app).post('/api/auth/login').send({ email: 'priya.s@gmail.com', password: 'password123' });
    customerToken = customer.body.data.token;
    const vendor = await request(app).post('/api/auth/login').send({ email: 'arjun.k@gmail.com', password: 'password123' });
    vendorToken = vendor.body.data.token;
    const product = await Product.findOne({ product_id: 9 }).lean();
    beforeStock = product.stock_qty;
  });

  test('POST /api/customer/orders returns 201 + order_id', async () => {
    const response = await request(app).post('/api/customer/orders').set('Authorization', `Bearer ${customerToken}`).send({ items: [{ product_id: 9, quantity: 1 }] });
    expect(response.status).toBe(201);
    orderId = response.body.data.order_id;
  });

  test('stock is decremented after order', async () => {
    const product = await Product.findOne({ product_id: 9 }).lean();
    expect(product.stock_qty).toBe(beforeStock - 1);
  });

  test('GET /api/customer/orders returns orders with items', async () => {
    const response = await request(app).get('/api/customer/orders').set('Authorization', `Bearer ${customerToken}`);
    expect(response.status).toBe(200);
    expect(response.body.data.some((order) => order.order_id === orderId)).toBe(true);
  });

  test('PATCH vendor order status returns 200 + notification created', async () => {
    const response = await request(app).patch(`/api/vendor/orders/${orderId}/status`).set('Authorization', `Bearer ${vendorToken}`).send({ status: 'processing' });
    expect(response.status).toBe(200);
    const count = await Notification.countDocuments({ message: `Order #${orderId} status updated to processing.` });
    expect(count).toBeGreaterThan(0);
  });
});
