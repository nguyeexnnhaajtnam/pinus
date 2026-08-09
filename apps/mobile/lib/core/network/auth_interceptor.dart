import 'package:dio/dio.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/auth_refresh_coordinator.dart';

class AuthInterceptor extends Interceptor {
  AuthInterceptor(
    this._dio,
    this._controller,
    this._coordinator, {
    Set<String>? publicPaths,
  }) : _publicPaths = publicPaths ?? const {'/health', '/auth/refresh'};

  static const retryKey = 'pinus.auth.retried';
  final Dio _dio;
  final AuthenticationController _controller;
  final AuthRefreshCoordinator _coordinator;
  final Set<String> _publicPaths;

  @override
  void onRequest(RequestOptions options, RequestInterceptorHandler handler) {
    final token = _controller.tokens?.accessToken;
    if (token != null && !_publicPaths.contains(options.path)) {
      options.headers['Authorization'] = 'Bearer $token';
    }
    handler.next(options);
  }

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    final request = err.requestOptions;
    if (err.response?.statusCode != 401 ||
        request.extra[retryKey] == true ||
        _publicPaths.contains(request.path)) {
      handler.next(err);
      return;
    }
    try {
      final pair = await _coordinator.refresh();
      request.extra[retryKey] = true;
      request.headers['Authorization'] = 'Bearer ${pair.accessToken}';
      handler.resolve(await _dio.fetch<dynamic>(request));
    } on Object {
      handler.next(err);
    }
  }
}
