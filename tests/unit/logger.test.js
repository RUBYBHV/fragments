describe('Logger configuration', () => {
  const originalLogLevel = process.env.FRAGMENTS_LOG_LEVEL;

  beforeEach(() => {
    jest.resetModules();
  });

  afterAll(() => {
    process.env.FRAGMENTS_LOG_LEVEL = originalLogLevel;
  });

  test('should configure pino-pretty when log level is debug', () => {
    process.env.FRAGMENTS_LOG_LEVEL = 'debug';
    const logger = require('../../src/logger');
    expect(logger).toBeDefined();
    expect(logger.level).toBe('debug');
  });

  test('should default to info when no log level is specified', () => {
    delete process.env.FRAGMENTS_LOG_LEVEL;
    const logger = require('../../src/logger');
    expect(logger).toBeDefined();
    expect(logger.level).toBe('info');
  });
});
