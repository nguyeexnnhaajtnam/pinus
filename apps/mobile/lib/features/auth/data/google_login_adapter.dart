import 'package:google_sign_in/google_sign_in.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';

abstract interface class GoogleProviderClient {
  Future<void> initialize(String serverClientId);
  Future<String?> authenticate();
}

class GoogleProviderCancelled implements Exception {
  const GoogleProviderCancelled();
}

class GoogleSdkProviderClient implements GoogleProviderClient {
  @override
  Future<void> initialize(String serverClientId) =>
      GoogleSignIn.instance.initialize(serverClientId: serverClientId);

  @override
  Future<String?> authenticate() async {
    try {
      final account = await GoogleSignIn.instance.authenticate();
      return account.authentication.idToken;
    } on GoogleSignInException catch (error) {
      if (error.code == GoogleSignInExceptionCode.canceled) {
        throw const GoogleProviderCancelled();
      }
      rethrow;
    }
  }
}

class GoogleLoginAdapter implements SocialLoginProviderAdapter {
  factory GoogleLoginAdapter({
    required String? serverClientId,
    GoogleProviderClient? client,
  }) {
    final resolvedClient = client ?? GoogleSdkProviderClient();
    return GoogleLoginAdapter._(
      configured: serverClientId != null,
      client: resolvedClient,
      initialization: serverClientId == null
          ? null
          : resolvedClient.initialize(serverClientId),
    );
  }

  GoogleLoginAdapter._({
    required this._configured,
    required this._client,
    required this._initialization,
  });

  final bool _configured;
  final GoogleProviderClient _client;
  final Future<void>? _initialization;

  @override
  Future<bool> isAvailable() async => _configured;

  @override
  Future<ProviderLoginResult> authenticate() async {
    if (!_configured || _initialization == null) {
      return const ProviderLoginUnavailable();
    }
    try {
      await _initialization;
      final token = await _client.authenticate();
      if (token == null || token.isEmpty) return const ProviderLoginFailure();
      return ProviderLoginSuccess(identityToken: token);
    } on GoogleProviderCancelled {
      return const ProviderLoginCancelled();
    } on Object {
      return const ProviderLoginFailure();
    }
  }
}
