import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

void main() {
  const pair = TokenPair(accessToken: 'access', refreshToken: 'refresh');

  test(
    'in-memory secure storage reads, atomically writes, and deletes a pair',
    () async {
      final storage = InMemorySecureTokenStorage();
      expect(await storage.read(), isNull);
      await storage.write(pair);
      expect(await storage.read(), same(pair));
      await storage.delete();
      expect(await storage.read(), isNull);
    },
  );

  test('token pair rejects incomplete and corrupt documents', () {
    expect(() => TokenPair.fromJson({'version': 1}), throwsFormatException);
    expect(
      () => TokenPair.fromJson({
        'version': 2,
        'accessToken': 'access',
        'refreshToken': 'refresh',
      }),
      throwsFormatException,
    );
  });

  test('storage errors are surfaced', () async {
    final storage = InMemorySecureTokenStorage()
      ..readError = StateError('locked');
    await expectLater(storage.read(), throwsStateError);
  });
}
