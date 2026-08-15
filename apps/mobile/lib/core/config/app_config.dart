import 'package:flutter_riverpod/flutter_riverpod.dart';

class AppConfig {
  const AppConfig({
    required this.apiBaseUrl,
    this.googleServerClientId,
    this.appleSignInEnabled = false,
  });
  final Uri apiBaseUrl;
  final String? googleServerClientId;
  final bool appleSignInEnabled;

  factory AppConfig.fromEnvironment() => AppConfig.fromRaw(
    const String.fromEnvironment('API_BASE_URL'),
    googleServerClientId: const String.fromEnvironment(
      'GOOGLE_SERVER_CLIENT_ID',
    ),
    appleSignInEnabled: const bool.fromEnvironment('ENABLE_APPLE_SIGN_IN'),
  );

  factory AppConfig.fromRaw(
    String rawUrl, {
    String? googleServerClientId,
    bool appleSignInEnabled = false,
  }) {
    if (rawUrl.trim().isEmpty) {
      throw const FormatException('API_BASE_URL is required');
    }
    final uri = Uri.tryParse(rawUrl);
    if (uri == null ||
        !uri.hasScheme ||
        !uri.hasAuthority ||
        !{'http', 'https'}.contains(uri.scheme)) {
      throw const FormatException(
        'API_BASE_URL must be an absolute HTTP(S) URL',
      );
    }
    final googleId = googleServerClientId?.trim();
    return AppConfig(
      apiBaseUrl: uri,
      googleServerClientId: googleId == null || googleId.isEmpty
          ? null
          : googleId,
      appleSignInEnabled: appleSignInEnabled,
    );
  }
}

final appConfigProvider = Provider<AppConfig>(
  (ref) => throw StateError('AppConfig must be supplied at startup'),
);
