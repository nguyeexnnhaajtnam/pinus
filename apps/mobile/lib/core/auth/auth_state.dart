import 'package:pinus_mobile/core/auth/token_pair.dart';

sealed class AuthenticationState {
  const AuthenticationState();
}

class AuthenticationInitializing extends AuthenticationState {
  const AuthenticationInitializing();
}

class Unauthenticated extends AuthenticationState {
  const Unauthenticated();
}

class Authenticated extends AuthenticationState {
  const Authenticated(this.tokens);
  final TokenPair tokens;
}

class AuthenticationRefreshFailure extends AuthenticationState {
  const AuthenticationRefreshFailure({
    required this.retryable,
    required this.tokens,
  });
  final bool retryable;
  final TokenPair tokens;
}
