// tests/unit/get.test.js

const request = require('supertest');

const app = require('../../src/app');

describe('GET /v1/fragments', () => {
  // If the request is missing the Authorization header, it should be forbidden
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments').expect(401));

  // If the wrong username/password pair are used (no such user), it should be forbidden
  test('incorrect credentials are denied', () =>
    request(app).get('/v1/fragments').auth('invalid@email.com', 'incorrect_password').expect(401));

  // Using a valid username/password pair should give a success result with a .fragments array
  test('authenticated users get a fragments array', async () => {
    const res = await request(app)
      .get('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(Array.isArray(res.body.fragments)).toBe(true);
  });

  test('authenticated users get expanded fragments array when ?expand=1 is used', async () => {
    // Create a fragment first
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('hello');
    expect(postRes.statusCode).toBe(201);
    const fragmentId = postRes.body.fragment.id;

    // Get unexpanded fragments
    const res1 = await request(app)
      .get('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(res1.statusCode).toBe(200);
    expect(res1.body.fragments.includes(fragmentId)).toBe(true);

    // Get expanded fragments
    const res2 = await request(app)
      .get('/v1/fragments?expand=1')
      .auth('test-user1@fragments-testing.com', 'test-password1');
    expect(res2.statusCode).toBe(200);
    const fragments = res2.body.fragments;
    expect(Array.isArray(fragments)).toBe(true);
    const found = fragments.find((f) => f.id === fragmentId);
    expect(found).toBeDefined();
    expect(found.id).toBe(fragmentId);
    expect(found.type).toBe('text/plain');
  });
});
