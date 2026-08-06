import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import type { App } from 'supertest/types';
import { AppModule } from '../src/app.module';
import { GlobalExceptionFilter } from '../src/common/global-exception.filter';
import { PrismaService } from '../src/database/prisma.service';

describe('Pinus API (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue({ isHealthy: jest.fn().mockResolvedValue(true) })
      .compile();
    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new GlobalExceptionFilter());
    await app.init();
  });

  afterAll(async () => app.close());

  it('GET /health reports healthy and propagates correlation ID', async () => {
    const response = await request(app.getHttpServer())
      .get('/health')
      .set('x-correlation-id', 'test-correlation');
    expect(response.status).toBe(200);
    expect(response.headers['x-correlation-id']).toBe('test-correlation');
    expect(response.body).toEqual({
      status: 'healthy',
      checks: { database: 'up' },
    });
  });

  it('normalizes unknown routes', async () => {
    const response = await request(app.getHttpServer()).get('/missing');
    expect(response.status).toBe(404);
    expect(response.body).toEqual(
      expect.objectContaining({
        statusCode: 404,
        errorId: 'HTTP_404',
        path: '/missing',
      }),
    );
    expect(response.body).not.toHaveProperty('stack');
  });
});
