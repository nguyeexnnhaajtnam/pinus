import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/app/app.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';
import 'package:pinus_mobile/features/auth/application/social_login_controller.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';
import 'package:pinus_mobile/features/health/application/health_providers.dart';
import 'package:pinus_mobile/features/health/data/health_api_client.dart';

class UnavailableAdapter implements SocialLoginProviderAdapter {
  @override
  Future<ProviderLoginResult> authenticate() async =>
      const ProviderLoginUnavailable();

  @override
  Future<bool> isAvailable() async => false;
}

void main() {
  Widget app(InMemorySecureTokenStorage storage) => ProviderScope(
    overrides: [
      secureTokenStorageProvider.overrideWithValue(storage),
      googleLoginAdapterProvider.overrideWithValue(UnavailableAdapter()),
      appleLoginAdapterProvider.overrideWithValue(UnavailableAdapter()),
      healthStatusProvider.overrideWith((ref) async => HealthStatus.healthy),
    ],
    child: const PinusApp(),
  );

  testWidgets('initialization resolves an empty store to login', (
    tester,
  ) async {
    await tester.pumpWidget(app(InMemorySecureTokenStorage()));
    await tester.pumpAndSettle();

    expect(
      find.text('Sign in to continue to your private shared space.'),
      findsOneWidget,
    );
  });

  testWidgets('restores authenticated routing after restart', (tester) async {
    final storage = InMemorySecureTokenStorage()
      ..value = const TokenPair(
        accessToken: 'restored-access',
        refreshToken: 'restored-refresh',
      );
    await tester.pumpWidget(app(storage));
    await tester.pumpAndSettle();

    expect(find.text('Backend is healthy'), findsOneWidget);
    expect(find.text('Continue with Google'), findsNothing);
  });
}
