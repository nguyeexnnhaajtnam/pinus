import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/auth_state.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

void main() {
  const pair = TokenPair(accessToken: 'access', refreshToken: 'refresh');

  test('restores stored credentials and clears them', () async {
    final storage = InMemorySecureTokenStorage()..value = pair;
    final container = ProviderContainer(
      overrides: [secureTokenStorageProvider.overrideWithValue(storage)],
    );
    addTearDown(container.dispose);
    final controller = container.read(
      authenticationControllerProvider.notifier,
    );
    await controller.initialize();
    expect(
      container.read(authenticationControllerProvider),
      isA<Authenticated>(),
    );
    await controller.clear();
    expect(
      container.read(authenticationControllerProvider),
      isA<Unauthenticated>(),
    );
    expect(storage.value, isNull);
  });

  test('missing credentials become unauthenticated', () async {
    final container = ProviderContainer(
      overrides: [
        secureTokenStorageProvider.overrideWithValue(
          InMemorySecureTokenStorage(),
        ),
      ],
    );
    addTearDown(container.dispose);
    await container
        .read(authenticationControllerProvider.notifier)
        .initialize();
    expect(
      container.read(authenticationControllerProvider),
      isA<Unauthenticated>(),
    );
  });
}
