import 'package:flutter_riverpod/flutter_riverpod.dart';

class AppConfig {
  const AppConfig({required this.apiBaseUrl});
  final Uri apiBaseUrl;

  factory AppConfig.fromEnvironment() =>
      AppConfig.fromRaw(const String.fromEnvironment('API_BASE_URL'));

  factory AppConfig.fromRaw(String rawUrl) {
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
    return AppConfig(apiBaseUrl: uri);
  }
}

final appConfigProvider = Provider<AppConfig>(
  (ref) => throw StateError('AppConfig must be supplied at startup'),
);
