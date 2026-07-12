const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id/info', () => {
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments/123/info').expect(401));

  test('getting info for a non-existent fragment returns 404', () =>
    request(app).get('/v1/fragments/invalid-id/info').auth('test-user1@fragments-testing.com', 'test-password1').expect(404));

  test('can get info for an existing fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'application/json')
      .send('{"test": true}');
    
    expect(postRes.statusCode).toBe(201);
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}/info`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.fragment.id).toBe(id);
    expect(res.body.fragment.type).toBe('application/json');
    expect(res.body.fragment.size).toBeGreaterThan(0);
  });
});
