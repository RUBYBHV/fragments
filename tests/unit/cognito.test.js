const mockVerify = jest.fn();
const mockHydrate = jest.fn();

// Mock aws-jwt-verify
jest.mock('aws-jwt-verify', () => ({
  CognitoJwtVerifier: {
    create: jest.fn().mockImplementation(() => ({
      hydrate: mockHydrate,
      verify: mockVerify,
    })),
  },
}));

describe('Cognito Authentication Strategy', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    mockVerify.mockReset();
    mockHydrate.mockReset();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  test('throws an error if environment variables are missing', () => {
    delete process.env.AWS_COGNITO_POOL_ID;
    delete process.env.AWS_COGNITO_CLIENT_ID;

    expect(() => require('../../src/auth/cognito')).toThrow(
      'missing expected env vars: AWS_COGNITO_POOL_ID, AWS_COGNITO_CLIENT_ID'
    );
  });

  test('successfully verifies a valid token', async () => {
    process.env.AWS_COGNITO_POOL_ID = 'us-east-1_123456789';
    process.env.AWS_COGNITO_CLIENT_ID = 'client_id';

    mockVerify.mockResolvedValue({ email: 'test@example.com' });
    mockHydrate.mockResolvedValue();

    const cognito = require('../../src/auth/cognito');
    const strategy = cognito.strategy();

    const verifyCallback = strategy._verify;
    const done = jest.fn();
    await verifyCallback('valid-token', done);

    expect(mockVerify).toHaveBeenCalledWith('valid-token');
    expect(done).toHaveBeenCalledWith(null, 'test@example.com');
  });

  test('fails verification on invalid token', async () => {
    process.env.AWS_COGNITO_POOL_ID = 'us-east-1_123456789';
    process.env.AWS_COGNITO_CLIENT_ID = 'client_id';

    mockVerify.mockRejectedValue(new Error('Invalid token'));
    mockHydrate.mockResolvedValue();

    const cognito = require('../../src/auth/cognito');
    const strategy = cognito.strategy();

    const verifyCallback = strategy._verify;
    const done = jest.fn();
    await verifyCallback('invalid-token', done);

    expect(mockVerify).toHaveBeenCalledWith('invalid-token');
    expect(done).toHaveBeenCalledWith(null, false);
  });

  test('handles hydrate failure', async () => {
    process.env.AWS_COGNITO_POOL_ID = 'us-east-1_123456789';
    process.env.AWS_COGNITO_CLIENT_ID = 'client_id';

    mockHydrate.mockRejectedValue(new Error('Network error'));

    expect(() => require('../../src/auth/cognito')).not.toThrow();
  });
});
