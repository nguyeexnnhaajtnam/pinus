import 'dart:async';
import 'dart:typed_data';

import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/core/auth/auth_api.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/auth_refresh_coordinator.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';
import 'package:pinus_mobile/core/network/auth_interceptor.dart';

class RecordingAdapter implements HttpClientAdapter {
  final List<RequestOptions> requests = [];
  int protectedCalls = 0;
  bool alwaysUnauthorized = false;

  @override
  Future<ResponseBody> fetch(
    RequestOptions options,
    Stream<Uint8List>? requestStream,
    Future<void>? cancelFuture,
  ) async {
    requests.add(
      options.copyWith(headers: Map<String, dynamic>.from(options.headers)),
    );
    if (options.path == '/health') return ResponseBody.fromString('{}', 200);
    protectedCalls += 1;
    if (alwaysUnauthorized ||
        options.headers['Authorization'] == 'Bearer old-access') {
      return ResponseBody.fromString('{}', 401);
    }
    return ResponseBody.fromString('{}', 200);
  }

  @override
  void close({bool force = false}) {}
}

class ImmediateRefreshApi extends AuthApi {
  ImmediateRefreshApi(this.result) : super(Dio());
  final TokenPair result;
  int calls = 0;

  @override
  Future<TokenPair> refresh(String refreshToken) async {
    calls += 1;
    await Future<void>.delayed(const Duration(milliseconds: 5));
    return result;
  }
}

void main() {
  const oldPair = TokenPair(accessToken: 'old-access', refreshToken: 'refresh');
  const newPair = TokenPair(
    accessToken: 'new-access',
    refreshToken: 'new-refresh',
  );

  Future<(ProviderContainer, Dio, RecordingAdapter, ImmediateRefreshApi)>
  setup({bool alwaysUnauthorized = false}) async {
    final storage = InMemorySecureTokenStorage()..value = oldPair;
    final container = ProviderContainer(
      overrides: [secureTokenStorageProvider.overrideWithValue(storage)],
    );
    final controller = container.read(
      authenticationControllerProvider.notifier,
    );
    await controller.initialize();
    final api = ImmediateRefreshApi(newPair);
    final coordinator = AuthRefreshCoordinator(controller, api);
    final dio = Dio(BaseOptions(baseUrl: 'http://localhost'));
    final adapter = RecordingAdapter()..alwaysUnauthorized = alwaysUnauthorized;
    dio.httpClientAdapter = adapter;
    dio.interceptors.add(AuthInterceptor(dio, controller, coordinator));
    return (container, dio, adapter, api);
  }

  test(
    'attaches bearer only to protected requests without exposing it elsewhere',
    () async {
      final (container, dio, adapter, _) = await setup();
      addTearDown(container.dispose);
      await dio.get<void>('/health');
      await dio.get<void>('/protected');
      expect(adapter.requests.first.headers, isNot(contains('Authorization')));
      expect(adapter.requests[1].headers['Authorization'], 'Bearer old-access');
      expect(
        adapter.requests.last.headers['Authorization'],
        'Bearer new-access',
      );
    },
  );

  test('concurrent unauthorized requests share one refresh', () async {
    final (container, dio, _, api) = await setup();
    addTearDown(container.dispose);
    await Future.wait([dio.get<void>('/one'), dio.get<void>('/two')]);
    expect(api.calls, 1);
  });

  test('a retried unauthorized request does not refresh again', () async {
    final (container, dio, _, api) = await setup(alwaysUnauthorized: true);
    addTearDown(container.dispose);
    await expectLater(
      dio.get<void>('/protected'),
      throwsA(isA<DioException>()),
    );
    expect(api.calls, 1);
  });
}
