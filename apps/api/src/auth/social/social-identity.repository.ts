import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { SocialProviderUnavailableException } from './social.exception';
import type { VerifiedSocialIdentity } from './social.types';

@Injectable()
export class SocialIdentityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async resolveOrCreate(identity: VerifiedSocialIdentity): Promise<string> {
    const existing = await this.find(identity);
    if (existing) return existing.userId;

    const maximumAttempts = 8;
    for (let attempt = 0; attempt < maximumAttempts; attempt += 1) {
      try {
        return await this.prisma.$transaction(
          async (tx) => {
            const winner = await tx.account.findUnique({
              where: {
                provider_providerSubject: {
                  provider: identity.provider,
                  providerSubject: identity.providerSubject,
                },
              },
            });
            if (winner) return winner.userId;
            const user = await tx.user.create({ data: {} });
            await tx.account.create({
              data: {
                userId: user.id,
                provider: identity.provider,
                providerSubject: identity.providerSubject,
                email: identity.email,
              },
            });
            return user.id;
          },
          { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
        );
      } catch (error) {
        const retryable =
          error instanceof Prisma.PrismaClientKnownRequestError &&
          ['P2002', 'P2034'].includes(error.code);
        if (!retryable || attempt === maximumAttempts - 1) throw error;
        const winner = await this.find(identity);
        if (winner) return winner.userId;
        await new Promise((resolve) => setTimeout(resolve, 5 * (attempt + 1)));
      }
    }
    throw new SocialProviderUnavailableException();
  }

  private find(identity: VerifiedSocialIdentity) {
    return this.prisma.account.findUnique({
      where: {
        provider_providerSubject: {
          provider: identity.provider,
          providerSubject: identity.providerSubject,
        },
      },
    });
  }
}
