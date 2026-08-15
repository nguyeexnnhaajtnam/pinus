import 'dart:convert';

import 'package:crypto/crypto.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/features/auth/data/apple_login_adapter.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';

class FakeAppleClient implements AppleProviderClient {
  bool available = true;
  String? token = 'apple-identity-token';
  Object? error;
  String? receivedHash;

  @override
  Future<String?> authenticate(String hashedNonce) async {
    receivedHash = hashedNonce;
    if (error case final value?) throw value;
    return token;
  }

  @override
  Future<bool> isAvailable() async => available;
}

void main() {
  test('configuration and runtime availability are both required', () async {
    final client = FakeAppleClient();
    expect(
      await AppleLoginAdapter(configured: false, client: client).isAvailable(),
      isFalse,
    );
    client.available = false;
    final adapter = AppleLoginAdapter(configured: true, client: client);
    expect(await adapter.isAvailable(), isFalse);
    expect(await adapter.authenticate(), isA<ProviderLoginUnavailable>());
  });

  test('binds a random raw nonce hash and succeeds without email', () async {
    final client = FakeAppleClient();
    final adapter = AppleLoginAdapter(configured: true, client: client);

    final result = await adapter.authenticate() as ProviderLoginSuccess;

    expect(result.identityToken, 'apple-identity-token');
    expect(result.rawNonce, hasLength(32));
    expect(
      client.receivedHash,
      sha256.convert(utf8.encode(result.rawNonce!)).toString(),
    );
  });

  test('generates a fresh nonce per authentication attempt', () async {
    final client = FakeAppleClient();
    final adapter = AppleLoginAdapter(configured: true, client: client);
    final first = await adapter.authenticate() as ProviderLoginSuccess;
    final second = await adapter.authenticate() as ProviderLoginSuccess;
    expect(first.rawNonce, isNot(second.rawNonce));
  });

  test('maps cancellation, provider failure and missing token', () async {
    final cancelledClient = FakeAppleClient()
      ..error = const AppleProviderCancelled();
    expect(
      await AppleLoginAdapter(
        configured: true,
        client: cancelledClient,
      ).authenticate(),
      isA<ProviderLoginCancelled>(),
    );

    final failedClient = FakeAppleClient()..error = Exception('secret detail');
    expect(
      await AppleLoginAdapter(
        configured: true,
        client: failedClient,
      ).authenticate(),
      isA<ProviderLoginFailure>(),
    );

    final missingClient = FakeAppleClient()..token = null;
    expect(
      await AppleLoginAdapter(
        configured: true,
        client: missingClient,
      ).authenticate(),
      isA<ProviderLoginFailure>(),
    );
  });
}
