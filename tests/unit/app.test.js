const request = require('supertest');
const express = require('express');

// Mock the routes module to add a route that throws an error
jest.mock('../../src/routes', () => {
  const express = require('express');
  const router = express.Router();
  router.get('/trigger-error', (req, res, next) => {
    next(new Error('Test error'));
  });
  return router;
});

const app = require('../../src/app');

describe('App Handler', () => {
  test('should return HTTP 404 response for unknown route', async () => {
    const res = await request(app).get('/unknown-route-that-does-not-exist');
    expect(res.statusCode).toBe(404);
    expect(res.body.status).toEqual('error');
    expect(res.body.error.message).toEqual('not found');
  });

  test('should return HTTP 500 response for an unhandled error', async () => {
    const res = await request(app).get('/trigger-error');
    expect(res.statusCode).toBe(500);
    expect(res.body.status).toEqual('error');
    expect(res.body.error.message).toBeDefined();
    expect(res.body.error.code).toBeDefined();
  });
});
