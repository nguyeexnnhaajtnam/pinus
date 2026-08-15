import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinus_mobile/features/auth/application/social_login_controller.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(socialLoginControllerProvider);
    final controller = ref.read(socialLoginControllerProvider.notifier);
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 360),
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Text(
                    'Pinus',
                    style: Theme.of(context).textTheme.displaySmall,
                  ),
                  const SizedBox(height: 8),
                  const Text(
                    'Sign in to continue to your private shared space.',
                  ),
                  const SizedBox(height: 32),
                  if (state.googleAvailable)
                    FilledButton.tonal(
                      onPressed: state.loading
                          ? null
                          : () => controller.login(SocialLoginProvider.google),
                      child: state.loadingProvider == SocialLoginProvider.google
                          ? const CircularProgressIndicator()
                          : const Text('Continue with Google'),
                    ),
                  if (state.appleAvailable) ...[
                    const SizedBox(height: 12),
                    FilledButton(
                      onPressed: state.loading
                          ? null
                          : () => controller.login(SocialLoginProvider.apple),
                      child: state.loadingProvider == SocialLoginProvider.apple
                          ? const CircularProgressIndicator()
                          : const Text('Continue with Apple'),
                    ),
                  ],
                  if (!state.googleAvailable && !state.appleAvailable)
                    const Text(
                      'No sign-in provider is configured for this device.',
                    ),
                  if (state.errorMessage case final message?) ...[
                    const SizedBox(height: 16),
                    Text(
                      message,
                      style: TextStyle(
                        color: Theme.of(context).colorScheme.error,
                      ),
                    ),
                  ],
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
