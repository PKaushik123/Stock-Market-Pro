process.env.NODE_ENV = 'test';

const request = require('supertest');
const { connectDB, disconnectDB } = require('../config/db');
const app = require('../server');

jest.setTimeout(20000);

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await disconnectDB();
});

describe('Auth API', () => {
  it('registers a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.user.email).toBe('testuser@example.com');
  });

  it('logs in a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser@example.com',
        password: 'password123',
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.token).toBeTruthy();
  });
});
