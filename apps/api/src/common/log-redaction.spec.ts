import { Writable } from 'node:stream';
import pino from 'pino';
import { LOG_REDACTION_PATHS } from './log-redaction';

describe('social authentication log redaction', () => {
  it('removes provider proof, identity data and Pinus credentials', () => {
    let output = '';
    const destination = new Writable({
      write(
        chunk: Buffer | string,
        _encoding: BufferEncoding,
        callback: (error?: Error | null) => void,
      ) {
        output += typeof chunk === 'string' ? chunk : chunk.toString('utf8');
        callback();
      },
    });
    const logger = pino(
      { redact: { paths: [...LOG_REDACTION_PATHS], censor: '[REDACTED]' } },
      destination,
    );

    logger.info({
      identityToken: 'provider-token-secret',
      rawNonce: 'raw-nonce-secret',
      providerCredential: 'credential-secret',
      providerSubject: 'subject-secret',
      email: 'private@example.test',
      verifiedProviderPayload: 'payload-secret',
      accessToken: 'access-secret',
      refreshToken: 'refresh-secret',
    });

    for (const secret of [
      'provider-token-secret',
      'raw-nonce-secret',
      'credential-secret',
      'subject-secret',
      'private@example.test',
      'payload-secret',
      'access-secret',
      'refresh-secret',
    ]) {
      expect(output).not.toContain(secret);
    }
    expect(output).toContain('[REDACTED]');
  });
});
