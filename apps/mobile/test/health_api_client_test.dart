import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/features/health/data/health_api_client.dart';

void main() {
  test('parses a healthy response', () {
    expect(
      HealthApiClient.parseResponse(200, {'status': 'healthy'}),
      HealthStatus.healthy,
    );
  });

  test('rejects an unhealthy response', () {
    expect(
      () => HealthApiClient.parseResponse(503, {'status': 'unhealthy'}),
      throwsA(isA<HealthRequestException>()),
    );
  });

  test('rejects a malformed response', () {
    expect(
      () => HealthApiClient.parseResponse(200, {'unexpected': true}),
      throwsA(isA<HealthRequestException>()),
    );
  });
}
