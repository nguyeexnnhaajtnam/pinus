import 'package:dio/dio.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/secure_token_storage.dart';
import 'package:pinus_mobile/features/auth/application/social_login_controller.dart';
import 'package:pinus_mobile/features/auth/data/social_auth_api.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';
import 'package:pinus_mobile/features/auth/presentation/login_screen.dart';

class FixedSocialLoginController extends SocialLoginController {
  FixedSocialLoginController(this.initial);
  final SocialLoginState initial;

  @override
  SocialLoginState build() => initial;
}

class NoopSocialAuthApi extends SocialAuthApi {
  NoopSocialAuthApi() : super(Dio());
}

void main() {
  Widget screen(SocialLoginState state) => ProviderScope(
    overrides: [
      socialLoginControllerProvider.overrideWith(
        () => FixedSocialLoginController(state),
      ),
      socialAuthApiProvider.overrideWithValue(NoopSocialAuthApi()),
      secureTokenStorageProvider.overrideWithValue(
        InMemorySecureTokenStorage(),
      ),
    ],
    child: const MaterialApp(home: LoginScreen()),
  );

  testWidgets('one unavailable provider does not hide the other', (
    tester,
  ) async {
    await tester.pumpWidget(
      screen(const SocialLoginState(googleAvailable: true)),
    );

    expect(find.text('Continue with Google'), findsOneWidget);
    expect(find.text('Continue with Apple'), findsNothing);
    expect(find.textContaining('No sign-in provider'), findsNothing);
  });

  testWidgets('active provider loads and disables every action', (
    tester,
  ) async {
    await tester.pumpWidget(
      screen(
        const SocialLoginState(
          googleAvailable: true,
          appleAvailable: true,
          loadingProvider: SocialLoginProvider.apple,
        ),
      ),
    );

    final google = tester.widget<FilledButton>(
      find.widgetWithText(FilledButton, 'Continue with Google'),
    );
    expect(google.onPressed, isNull);
    expect(find.byType(CircularProgressIndicator), findsOneWidget);
  });

  testWidgets('shows sanitized recoverable error', (tester) async {
    await tester.pumpWidget(
      screen(
        const SocialLoginState(
          googleAvailable: true,
          errorMessage: 'Sign-in could not be completed',
        ),
      ),
    );

    expect(find.text('Sign-in could not be completed'), findsOneWidget);
  });
}
