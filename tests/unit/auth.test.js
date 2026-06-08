describe('Auth module', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('throws if both Cognito and Basic Auth are configured', () => {
    process.env.AWS_COGNITO_POOL_ID = 'pool_id';
    process.env.AWS_COGNITO_CLIENT_ID = 'client_id';
    process.env.HTPASSWD_FILE = 'file';

    expect(() => require('../../src/auth/index')).toThrow(
      'env contains configuration for both AWS Cognito and HTTP Basic Auth. Only one is allowed.'
    );
  });

  test('throws if missing all authorization configurations', () => {
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;
    delete process.env.HTPASSWD_FILE;

    expect(() => require('../../src/auth/index')).toThrow(
      'missing env vars: no authorization configuration found'
    );
  });

  test('loads cognito if configured', () => {
    process.env.AWS_COGNITO_POOL_ID = 'us-east-1_123456789';
    process.env.AWS_COGNITO_CLIENT_ID = 'client_id';
    delete process.env.HTPASSWD_FILE;

    const auth = require('../../src/auth/index');
    expect(auth).toBeDefined();
  });
});
