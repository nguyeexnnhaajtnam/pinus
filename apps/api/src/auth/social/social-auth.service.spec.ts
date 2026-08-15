import type { AuthService } from '../auth.service';
import { SocialAuthService } from './social-auth.service';
import type { SocialIdentityRepository } from './social-identity.repository';
import type {
  AppleIdentityVerifier,
  GoogleIdentityVerifier,
  VerifiedSocialIdentity,
} from './social.types';

describe('SocialAuthService', () => {
  const identity: VerifiedSocialIdentity = Object.freeze({
    provider: 'google',
    providerSubject: 'provider-subject',
  });

  it('returns no partial credentials and safely retries Session issuance', async () => {
    const google: GoogleIdentityVerifier = {
      verify: jest.fn().mockResolvedValue(identity),
    };
    const apple: AppleIdentityVerifier = {
      verify: jest.fn(),
    };
    const identities = {
      resolveOrCreate: jest.fn().mockResolvedValue('committed-user-id'),
    } as unknown as SocialIdentityRepository;
    const issueForUser = jest
      .fn()
      .mockRejectedValueOnce(new Error('session write failed'))
      .mockResolvedValueOnce({
        accessToken: 'access-token',
        refreshToken: 'refresh-token',
      });
    const auth = { issueForUser } as unknown as AuthService;
    const service = new SocialAuthService(google, apple, identities, auth);

    await expect(service.authenticateGoogle('proof')).rejects.toThrow(
      'session write failed',
    );
    await expect(service.authenticateGoogle('proof')).resolves.toEqual({
      accessToken: 'access-token',
      refreshToken: 'refresh-token',
    });
    expect(issueForUser).toHaveBeenNthCalledWith(1, 'committed-user-id');
    expect(issueForUser).toHaveBeenNthCalledWith(2, 'committed-user-id');
  });
});
