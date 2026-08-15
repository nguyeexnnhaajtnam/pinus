enum SocialLoginProvider { google, apple }

sealed class ProviderLoginResult {
  const ProviderLoginResult();
}

class ProviderLoginSuccess extends ProviderLoginResult {
  const ProviderLoginSuccess({required this.identityToken, this.rawNonce});
  final String identityToken;
  final String? rawNonce;
}

class ProviderLoginCancelled extends ProviderLoginResult {
  const ProviderLoginCancelled();
}

class ProviderLoginUnavailable extends ProviderLoginResult {
  const ProviderLoginUnavailable();
}

class ProviderLoginFailure extends ProviderLoginResult {
  const ProviderLoginFailure();
}

abstract interface class SocialLoginProviderAdapter {
  Future<bool> isAvailable();
  Future<ProviderLoginResult> authenticate();
}
