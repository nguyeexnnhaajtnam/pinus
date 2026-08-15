import 'dart:convert';
import 'dart:math';

import 'package:crypto/crypto.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';

abstract interface class AppleProviderClient {
  Future<bool> isAvailable();
  Future<String?> authenticate(String hashedNonce);
}

class AppleProviderCancelled implements Exception {
  const AppleProviderCancelled();
}

class AppleSdkProviderClient implements AppleProviderClient {
  @override
  Future<bool> isAvailable() => SignInWithApple.isAvailable();

  @override
  Future<String?> authenticate(String hashedNonce) async {
    try {
      final credential = await SignInWithApple.getAppleIDCredential(
        scopes: const [AppleIDAuthorizationScopes.email],
        nonce: hashedNonce,
      );
      return credential.identityToken;
    } on SignInWithAppleAuthorizationException catch (error) {
      if (error.code == AuthorizationErrorCode.canceled) {
        throw const AppleProviderCancelled();
      }
      rethrow;
    }
  }
}

class AppleLoginAdapter implements SocialLoginProviderAdapter {
  AppleLoginAdapter({required this.configured, AppleProviderClient? client})
    : _client = client ?? AppleSdkProviderClient();
  final bool configured;
  final AppleProviderClient _client;

  @override
  Future<bool> isAvailable() async => configured && await _client.isAvailable();

  @override
  Future<ProviderLoginResult> authenticate() async {
    if (!await isAvailable()) return const ProviderLoginUnavailable();
    final rawNonce = _randomNonce();
    final nonce = sha256.convert(utf8.encode(rawNonce)).toString();
    try {
      final identityToken = await _client.authenticate(nonce);
      if (identityToken == null || identityToken.isEmpty) {
        return const ProviderLoginFailure();
      }
      return ProviderLoginSuccess(
        identityToken: identityToken,
        rawNonce: rawNonce,
      );
    } on AppleProviderCancelled {
      return const ProviderLoginCancelled();
    } on Object {
      return const ProviderLoginFailure();
    }
  }

  String _randomNonce([int length = 32]) {
    const characters =
        '0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._';
    final random = Random.secure();
    return List.generate(
      length,
      (_) => characters[random.nextInt(characters.length)],
    ).join();
  }
}
