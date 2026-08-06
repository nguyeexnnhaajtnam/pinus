import type { Response } from 'express';
import { PrismaService } from '../database/prisma.service';
import { HealthController } from './health.controller';

describe('HealthController', () => {
  const status = jest.fn();
  const json = jest.fn();
  const response = { status, json } as unknown as Response;

  beforeEach(() => {
    jest.clearAllMocks();
    status.mockReturnValue({ json });
  });

  it('reports healthy database connectivity', async () => {
    const prisma = { isHealthy: jest.fn().mockResolvedValue(true) };
    const controller = new HealthController(prisma as unknown as PrismaService);
    await controller.check(response);
    expect(status).toHaveBeenCalledWith(200);
    expect(json).toHaveBeenCalledWith({
      status: 'healthy',
      checks: { database: 'up' },
    });
  });

  it('sanitizes database failures', async () => {
    const prisma = {
      isHealthy: jest.fn().mockRejectedValue(new Error('secret')),
    };
    const controller = new HealthController(prisma as unknown as PrismaService);
    await controller.check(response);
    expect(status).toHaveBeenCalledWith(503);
    expect(json).toHaveBeenCalledWith({
      status: 'unhealthy',
      checks: { database: 'down' },
    });
    expect(json).not.toHaveBeenCalledWith(
      expect.objectContaining({ message: 'secret' }),
    );
  });
});
