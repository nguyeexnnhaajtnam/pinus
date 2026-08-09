import 'dart:async';

import 'package:dio/dio.dart';
import 'package:pinus_mobile/core/auth/auth_api.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

class AuthRefreshCoordinator {
  AuthRefreshCoordinator(this._controller, this._api);

  final AuthenticationController _controller;
  final AuthApi _api;
  Future<TokenPair>? _inFlight;

  Future<TokenPair> refresh() => _inFlight ??= _perform().whenComplete(() {
    _inFlight = null;
  });

  Future<TokenPair> _perform() async {
    final current = _controller.tokens;
    if (current == null) throw const PermanentRefreshException();
    try {
      final pair = await _api.refresh(current.refreshToken);
      await _controller.authenticate(pair);
      return pair;
    } on PermanentRefreshException {
      await _controller.clear();
      rethrow;
    } on DioException {
      _controller.retryableRefreshFailure();
      rethrow;
    }
  }

  Future<void> signOutCurrent() async {
    final accessToken = _controller.tokens?.accessToken;
    if (accessToken == null) {
      await _controller.clear();
      return;
    }
    try {
      await _api.signOutCurrent(accessToken);
    } on DioException catch (error) {
      if (![401, 403].contains(error.response?.statusCode)) rethrow;
    }
    await _controller.clear();
  }

  Future<void> signOutOthers() {
    final accessToken = _controller.tokens?.accessToken;
    if (accessToken == null) throw const PermanentRefreshException();
    return _api.signOutOthers(accessToken);
  }
}
