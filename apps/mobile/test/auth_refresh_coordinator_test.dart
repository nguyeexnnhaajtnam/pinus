import 'dart:async';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/core/auth/auth_api.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/auth_refresh_coordinator.dart';
import 'package:pinus_mobile/core/auth/auth_state.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

class FakeAuthApi extends AuthApi {
  FakeAuthApi() : super(Dio());
  final completer = Completer<TokenPair>();
  int refreshCalls = 0;
  Object? failure;
  int currentSignOutCalls = 0;
  int otherSignOutCalls = 0;
  String? signOutAccessToken;

  @override
  Future<TokenPair> refresh(String refreshToken) {
    refreshCalls += 1;
    if (failure case final error?) return Future.error(error);
    return completer.future;
  }

  @override
  Future<void> signOutCurrent(String accessToken) async {
    currentSignOutCalls += 1;
    signOutAccessToken = accessToken;
  }

  @override
  Future<void> signOutOthers(String accessToken) async {
    otherSignOutCalls += 1;
    signOutAccessToken = accessToken;
  }
}

void main() {
  const oldPair = TokenPair(
    accessToken: 'old-access',
    refreshToken: 'old-refresh',
  );
  const newPair = TokenPair(
    accessToken: 'new-access',
    refreshToken: 'new-refresh',
  );

  Future<
    (ProviderContainer, InMemorySecureTokenStorage, AuthenticationController)
  >
  authenticatedController() async {
    final storage = InMemorySecureTokenStorage()..value = oldPair;
    final container = ProviderContainer(
      overrides: [secureTokenStorageProvider.overrideWithValue(storage)],
    );
    final controller = container.read(
      authenticationControllerProvider.notifier,
    );
    await controller.initialize();
    return (container, storage, controller);
  }

  test(
    'concurrent callers share one refresh and persist before completion',
    () async {
      final (container, storage, controller) = await authenticatedController();
      addTearDown(container.dispose);
      final api = FakeAuthApi();
      final coordinator = AuthRefreshCoordinator(controller, api);
      final first = coordinator.refresh();
      final second = coordinator.refresh();
      expect(api.refreshCalls, 1);
      api.completer.complete(newPair);
      expect(await first, same(newPair));
      expect(await second, same(newPair));
      expect(storage.value, same(newPair));
    },
  );

  test('permanent failure clears credentials for every waiter', () async {
    final (container, storage, controller) = await authenticatedController();
    addTearDown(container.dispose);
    final api = FakeAuthApi()..failure = const PermanentRefreshException();
    final coordinator = AuthRefreshCoordinator(controller, api);
    await expectLater(
      coordinator.refresh(),
      throwsA(isA<PermanentRefreshException>()),
    );
    expect(storage.value, isNull);
    expect(
      container.read(authenticationControllerProvider),
      isA<Unauthenticated>(),
    );
  });

  test('transient failure preserves stored credentials', () async {
    final (container, storage, controller) = await authenticatedController();
    addTearDown(container.dispose);
    final api = FakeAuthApi()
      ..failure = DioException(
        requestOptions: RequestOptions(path: '/auth/refresh'),
      );
    final coordinator = AuthRefreshCoordinator(controller, api);
    await expectLater(coordinator.refresh(), throwsA(isA<DioException>()));
    expect(storage.value, same(oldPair));
    expect(
      container.read(authenticationControllerProvider),
      isA<AuthenticationRefreshFailure>(),
    );
    expect(controller.tokens, same(oldPair));
  });

  test(
    'current sign-out clears local state while other sign-out keeps it',
    () async {
      final (container, storage, controller) = await authenticatedController();
      addTearDown(container.dispose);
      final api = FakeAuthApi();
      final coordinator = AuthRefreshCoordinator(controller, api);
      await coordinator.signOutOthers();
      expect(storage.value, same(oldPair));
      expect(api.signOutAccessToken, oldPair.accessToken);
      await coordinator.signOutCurrent();
      expect(storage.value, isNull);
    },
  );
}
