import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/core/config/app_config.dart';

void main() {
  test('accepts an absolute HTTP API URL', () {
    expect(AppConfig.fromRaw('http://localhost:3000').apiBaseUrl.port, 3000);
  });

  test('rejects missing API URL', () {
    expect(() => AppConfig.fromRaw(''), throwsFormatException);
  });

  test('rejects malformed API URL', () {
    expect(() => AppConfig.fromRaw('localhost:3000'), throwsFormatException);
  });
}
