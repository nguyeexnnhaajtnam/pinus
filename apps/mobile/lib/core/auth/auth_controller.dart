import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinus_mobile/core/auth/auth_state.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

final secureTokenStorageProvider = Provider<SecureTokenStorage>(
  (ref) => PlatformSecureTokenStorage(),
);

final authenticationControllerProvider =
    NotifierProvider<AuthenticationController, AuthenticationState>(
      AuthenticationController.new,
    );

class AuthenticationController extends Notifier<AuthenticationState> {
  @override
  AuthenticationState build() {
    Future<void>.microtask(initialize);
    return const AuthenticationInitializing();
  }

  SecureTokenStorage get _storage => ref.read(secureTokenStorageProvider);

  Future<void> initialize() async {
    try {
      final pair = await _storage.read();
      state = pair == null ? const Unauthenticated() : Authenticated(pair);
    } on Object {
      state = const Unauthenticated();
    }
  }

  TokenPair? get tokens => switch (state) {
    Authenticated(:final tokens) => tokens,
    AuthenticationRefreshFailure(:final tokens) => tokens,
    _ => null,
  };

  Future<void> authenticate(TokenPair pair) async {
    await _storage.write(pair);
    state = Authenticated(pair);
  }

  Future<void> clear() async {
    await _storage.delete();
    state = const Unauthenticated();
  }

  void retryableRefreshFailure() {
    final current = tokens;
    if (current != null) {
      state = AuthenticationRefreshFailure(retryable: true, tokens: current);
    }
  }
}
