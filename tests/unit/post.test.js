const request = require('supertest');
const app = require('../../src/app');

describe('POST /v1/fragments', () => {
  // We use HTTP Basic Auth for testing since it's easier to mock
  // username is user1@email.com, password is password1 (from fragments htpasswd file usually)
  // Let's assume the user is valid, we'll check if unauthenticated works
  
  test('unauthenticated requests are denied', async () => {
    const res = await request(app)
      .post('/v1/fragments')
      .send('hello world')
      .set('Content-Type', 'text/plain');
    expect(res.statusCode).toBe(401);
  });

  test('authenticated users can create a plain text fragment', async () => {
    const data = 'hello world';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send(data)
      .set('Content-Type', 'text/plain');

    const body = res.body;
    if (res.statusCode !== 201) {
      console.log('Error creating fragment:', res.statusCode, body);
    }
    expect(res.statusCode).toBe(201);
    expect(res.headers.location).toMatch(/\/v1\/fragments\/[A-Za-z0-9-]+$/);
    
    expect(body.status).toBe('ok');
    expect(body.fragment).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ownerId: expect.any(String),
        created: expect.any(String),
        updated: expect.any(String),
        type: 'text/plain',
        size: Buffer.from(data).length,
      })
    );
  });

  test('trying to create a fragment with an unsupported type errors', async () => {
    const data = 'hello world';
    const res = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .send(data)
      .set('Content-Type', 'application/json');

    expect(res.statusCode).toBe(415);
    expect(res.body.status).toBe('error');
    expect(res.body.error).toBeDefined();
  });
});
