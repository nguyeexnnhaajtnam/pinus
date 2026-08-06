import { ArgumentsHost, BadRequestException } from '@nestjs/common';
import { GlobalExceptionFilter } from './global-exception.filter';

describe('GlobalExceptionFilter', () => {
  const status = jest.fn();
  let capturedBody: Record<string, unknown> = {};
  const json = jest.fn((body: Record<string, unknown>) => {
    capturedBody = body;
  });
  const host = {
    switchToHttp: () => ({
      getResponse: () => ({ status }),
      getRequest: () => ({ originalUrl: '/test', id: 'correlation-123' }),
    }),
  } as unknown as ArgumentsHost;

  beforeEach(() => {
    jest.clearAllMocks();
    capturedBody = {};
    status.mockReturnValue({ json });
  });

  it('preserves safe client errors and correlation metadata', () => {
    new GlobalExceptionFilter().catch(
      new BadRequestException('Invalid input'),
      host,
    );
    expect(json).toHaveBeenCalledWith(
      expect.objectContaining({
        statusCode: 400,
        errorId: 'HTTP_400',
        message: 'Invalid input',
        path: '/test',
        correlationId: 'correlation-123',
        timestamp: capturedBody.timestamp,
      }),
    );
  });

  it('sanitizes unexpected errors and omits stack traces', () => {
    new GlobalExceptionFilter().catch(
      new Error('database password leaked'),
      host,
    );
    expect(capturedBody).toMatchObject({
      statusCode: 500,
      errorId: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
    });
    expect(capturedBody).not.toHaveProperty('stack');
    expect(JSON.stringify(capturedBody)).not.toContain('password leaked');
  });
});
