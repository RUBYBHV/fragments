// tests/unit/app.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('App 404 Handler', () => {
  test('should return HTTP 404 response for unknown route', async () => {
    const res = await request(app).get('/unknown-route-that-does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.body.error.message).toEqual('not found');
  });
});
