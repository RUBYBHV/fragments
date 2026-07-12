const request = require('supertest');
const app = require('../../src/app');

describe('GET /v1/fragments/:id', () => {
  test('unauthenticated requests are denied', () => request(app).get('/v1/fragments/123').expect(401));

  test('getting a non-existent fragment returns 404', () =>
    request(app).get('/v1/fragments/invalid-id').auth('test-user1@fragments-testing.com', 'test-password1').expect(404));

  test('can get an existing text/plain fragment', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('hello');
    
    expect(postRes.statusCode).toBe(201);
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/plain');
    expect(res.text).toBe('hello');
  });

  test('can get an existing text/markdown fragment and convert to HTML', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/markdown')
      .send('# Hello');
    
    expect(postRes.statusCode).toBe(201);
    const id = postRes.body.fragment.id;

    // Get as markdown
    const mdRes = await request(app)
      .get(`/v1/fragments/${id}`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(mdRes.statusCode).toBe(200);
    expect(mdRes.headers['content-type']).toContain('text/markdown');
    expect(mdRes.text).toBe('# Hello');

    // Get as HTML using .ext
    const htmlRes = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(htmlRes.statusCode).toBe(200);
    expect(htmlRes.headers['content-type']).toContain('text/html');
    expect(htmlRes.text).toContain('<h1>Hello</h1>');
  });

  test('unsupported conversion returns 415', async () => {
    const postRes = await request(app)
      .post('/v1/fragments')
      .auth('test-user1@fragments-testing.com', 'test-password1')
      .set('Content-Type', 'text/plain')
      .send('hello');
    
    expect(postRes.statusCode).toBe(201);
    const id = postRes.body.fragment.id;

    const res = await request(app)
      .get(`/v1/fragments/${id}.html`)
      .auth('test-user1@fragments-testing.com', 'test-password1');

    expect(res.statusCode).toBe(415);
  });
});
