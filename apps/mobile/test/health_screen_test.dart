import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/features/health/application/health_providers.dart';
import 'package:pinus_mobile/features/health/data/health_api_client.dart';
import 'package:pinus_mobile/features/health/presentation/health_screen.dart';

void main() {
  Widget appWith(Future<HealthStatus> Function() load) => ProviderScope(
    overrides: [healthStatusProvider.overrideWith((ref) => load())],
    child: const MaterialApp(home: HealthScreen()),
  );

  testWidgets('shows loading then healthy state', (tester) async {
    final completer = Future<HealthStatus>.delayed(
      const Duration(milliseconds: 10),
      () => HealthStatus.healthy,
    );
    await tester.pumpWidget(appWith(() => completer));
    expect(find.text('Checking backend health…'), findsOneWidget);
    await tester.pumpAndSettle();
    expect(find.text('Backend is healthy'), findsOneWidget);
  });

  testWidgets('shows failure and retries', (tester) async {
    var attempts = 0;
    await tester.pumpWidget(
      appWith(() async {
        attempts += 1;
        throw const HealthRequestException('Backend is unreachable');
      }),
    );
    await tester.pumpAndSettle();
    expect(find.text('Backend health check failed'), findsOneWidget);
    await tester.tap(find.text('Retry'));
    await tester.pumpAndSettle();
    expect(attempts, 2);
  });
}
