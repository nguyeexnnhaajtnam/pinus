import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/auth_state.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';
import 'package:pinus_mobile/features/auth/application/social_login_controller.dart';
import 'package:pinus_mobile/features/auth/data/social_auth_api.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';

class FakeProviderAdapter implements SocialLoginProviderAdapter {
  FakeProviderAdapter({required this.available, required this.result});
  final bool available;
  ProviderLoginResult result;
  int calls = 0;
  Completer<void>? gate;

  @override
  Future<ProviderLoginResult> authenticate() async {
    calls += 1;
    await gate?.future;
    return result;
  }

  @override
  Future<bool> isAvailable() async => available;
}

class FakeSocialAuthApi extends SocialAuthApi {
  FakeSocialAuthApi() : super(Dio());
  int googleCalls = 0;
  int appleCalls = 0;
  Object? failure;

  @override
  Future<TokenPair> google(String identityToken) async {
    googleCalls += 1;
    if (failure case final error?) throw error;
    return const TokenPair(
      accessToken: 'pinus-access',
      refreshToken: 'pinus-refresh',
    );
  }

  @override
  Future<TokenPair> apple(String identityToken, String rawNonce) async {
    appleCalls += 1;
    if (failure case final error?) throw error;
    return const TokenPair(
      accessToken: 'pinus-access',
      refreshToken: 'pinus-refresh',
    );
  }
}

void main() {
  late FakeProviderAdapter google;
  late FakeProviderAdapter apple;
  late FakeSocialAuthApi api;
  late InMemorySecureTokenStorage storage;
  late ProviderContainer container;

  setUp(() async {
    google = FakeProviderAdapter(
      available: true,
      result: const ProviderLoginSuccess(identityToken: 'google-proof'),
    );
    apple = FakeProviderAdapter(
      available: true,
      result: const ProviderLoginSuccess(
        identityToken: 'apple-proof',
        rawNonce: 'raw-nonce',
      ),
    );
    api = FakeSocialAuthApi();
    storage = InMemorySecureTokenStorage();
    container = ProviderContainer(
      overrides: [
        googleLoginAdapterProvider.overrideWithValue(google),
        appleLoginAdapterProvider.overrideWithValue(apple),
        socialAuthApiProvider.overrideWithValue(api),
        secureTokenStorageProvider.overrideWithValue(storage),
      ],
    );
    addTearDown(container.dispose);
    container.read(socialLoginControllerProvider);
    await Future<void>.delayed(Duration.zero);
  });

  test('loads provider availability independently', () {
    final state = container.read(socialLoginControllerProvider);
    expect(state.googleAvailable, isTrue);
    expect(state.appleAvailable, isTrue);
  });

  test('Google exchange securely persists Pinus credentials', () async {
    await container
        .read(socialLoginControllerProvider.notifier)
        .login(SocialLoginProvider.google);

    expect(api.googleCalls, 1);
    expect(storage.value?.accessToken, 'pinus-access');
    expect(
      container.read(authenticationControllerProvider),
      isA<Authenticated>(),
    );
    expect(container.read(socialLoginControllerProvider).loading, isFalse);
  });

  test('Apple exchange uses the nonce-bound provider result', () async {
    await container
        .read(socialLoginControllerProvider.notifier)
        .login(SocialLoginProvider.apple);

    expect(api.appleCalls, 1);
    expect(storage.value?.refreshToken, 'pinus-refresh');
  });

  test(
    'cancellation returns to idle without backend exchange or error',
    () async {
      google.result = const ProviderLoginCancelled();
      await container
          .read(socialLoginControllerProvider.notifier)
          .login(SocialLoginProvider.google);

      final state = container.read(socialLoginControllerProvider);
      expect(api.googleCalls, 0);
      expect(state.loading, isFalse);
      expect(state.errorMessage, isNull);
    },
  );

  test('suppresses duplicate and cross-provider taps while loading', () async {
    google.gate = Completer<void>();
    final first = container
        .read(socialLoginControllerProvider.notifier)
        .login(SocialLoginProvider.google);
    await Future<void>.delayed(Duration.zero);
    final duplicate = container
        .read(socialLoginControllerProvider.notifier)
        .login(SocialLoginProvider.google);
    final crossProvider = container
        .read(socialLoginControllerProvider.notifier)
        .login(SocialLoginProvider.apple);
    google.gate!.complete();
    await Future.wait([first, duplicate, crossProvider]);

    expect(google.calls, 1);
    expect(apple.calls, 0);
    expect(api.googleCalls, 1);
  });

  test(
    'sanitizes backend failure and preserves existing credentials',
    () async {
      const existing = TokenPair(
        accessToken: 'existing',
        refreshToken: 'existing-refresh',
      );
      storage.value = existing;
      await container
          .read(authenticationControllerProvider.notifier)
          .initialize();
      api.failure = Exception('provider-token=secret internal detail');

      await container
          .read(socialLoginControllerProvider.notifier)
          .login(SocialLoginProvider.google);

      expect(storage.value, existing);
      expect(
        container.read(socialLoginControllerProvider).errorMessage,
        'Sign-in could not be completed',
      );
      expect(
        container.read(socialLoginControllerProvider).errorMessage,
        isNot(contains('secret')),
      );
    },
  );
}
