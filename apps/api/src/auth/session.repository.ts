import { randomUUID } from 'node:crypto';
import { Injectable } from '@nestjs/common';
import { Prisma, type Session } from '@prisma/client';
import { PrismaService } from '../database/prisma.service';
import {
  MAX_ACTIVE_SESSIONS,
  REFRESH_TOKEN_TTL_SECONDS,
} from './auth.constants';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  findSession(id: string): Promise<Session | null> {
    return this.prisma.session.findUnique({ where: { id } });
  }

  async createForUser(
    userId: string,
    buildHash: (sessionId: string, expiresAt: Date) => Promise<string>,
  ): Promise<Session> {
    return this.serializable(async (tx) => {
      const now = new Date();
      const active = await tx.session.findMany({
        where: { userId, revokedAt: null, expiresAt: { gt: now } },
        orderBy: [{ createdAt: 'asc' }, { id: 'asc' }],
      });
      if (active.length >= MAX_ACTIVE_SESSIONS) {
        await tx.session.update({
          where: { id: active[0].id },
          data: { revokedAt: now },
        });
      }
      const id = randomUUID();
      const expiresAt = new Date(
        now.getTime() + REFRESH_TOKEN_TTL_SECONDS * 1000,
      );
      const refreshTokenHash = await buildHash(id, expiresAt);
      return tx.session.create({
        data: { id, userId, expiresAt, refreshTokenHash },
      });
    });
  }

  async rotate(input: {
    sessionId: string;
    userId: string;
    expectedVersion: number;
    expectedHash: string;
    nextHash: string;
  }): Promise<'rotated' | 'stale' | 'invalid'> {
    return this.prisma.$transaction(async (tx) => {
      const now = new Date();
      const updated = await tx.session.updateMany({
        where: {
          id: input.sessionId,
          userId: input.userId,
          refreshTokenVersion: input.expectedVersion,
          refreshTokenHash: input.expectedHash,
          revokedAt: null,
          expiresAt: { gt: now },
        },
        data: {
          refreshTokenHash: input.nextHash,
          refreshTokenVersion: { increment: 1 },
          lastUsedAt: now,
        },
      });
      if (updated.count === 1) return 'rotated';
      const session = await tx.session.findUnique({
        where: { id: input.sessionId },
      });
      if (
        session &&
        session.userId === input.userId &&
        !session.revokedAt &&
        session.expiresAt > now &&
        input.expectedVersion < session.refreshTokenVersion
      ) {
        await tx.session.updateMany({
          where: { id: session.id, revokedAt: null },
          data: { revokedAt: now },
        });
        return 'stale';
      }
      return 'invalid';
    });
  }

  async revokeCurrent(userId: string, sessionId: string): Promise<void> {
    await this.prisma.session.updateMany({
      where: { id: sessionId, userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  async revokeOthers(userId: string, sessionId: string): Promise<void> {
    const now = new Date();
    await this.prisma.session.updateMany({
      where: {
        userId,
        id: { not: sessionId },
        revokedAt: null,
        expiresAt: { gt: now },
      },
      data: { revokedAt: now },
    });
  }

  private async serializable<T>(
    work: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    const maximumAttempts = 8;
    for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
      try {
        return await this.prisma.$transaction(work, {
          isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
        });
      } catch (error) {
        if (
          !(error instanceof Prisma.PrismaClientKnownRequestError) ||
          error.code !== 'P2034' ||
          attempt === maximumAttempts - 1
        )
          throw error;
        await new Promise((resolve) => setTimeout(resolve, 5 * (attempt + 1)));
      }
    }
    throw new Error('Unreachable transaction retry state');
  }
}
