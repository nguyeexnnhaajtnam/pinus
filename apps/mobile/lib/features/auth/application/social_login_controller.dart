import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/config/app_config.dart';
import 'package:pinus_mobile/core/network/dio_provider.dart';
import 'package:pinus_mobile/features/auth/data/apple_login_adapter.dart';
import 'package:pinus_mobile/features/auth/data/google_login_adapter.dart';
import 'package:pinus_mobile/features/auth/data/social_auth_api.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';

class SocialLoginState {
  const SocialLoginState({
    this.googleAvailable = false,
    this.appleAvailable = false,
    this.loadingProvider,
    this.errorMessage,
  });

  final bool googleAvailable;
  final bool appleAvailable;
  final SocialLoginProvider? loadingProvider;
  final String? errorMessage;

  bool get loading => loadingProvider != null;

  SocialLoginState copyWith({
    bool? googleAvailable,
    bool? appleAvailable,
    SocialLoginProvider? loadingProvider,
    bool clearLoading = false,
    String? errorMessage,
    bool clearError = false,
  }) => SocialLoginState(
    googleAvailable: googleAvailable ?? this.googleAvailable,
    appleAvailable: appleAvailable ?? this.appleAvailable,
    loadingProvider: clearLoading
        ? null
        : loadingProvider ?? this.loadingProvider,
    errorMessage: clearError ? null : errorMessage ?? this.errorMessage,
  );
}

final googleLoginAdapterProvider = Provider<SocialLoginProviderAdapter>((ref) {
  final config = ref.watch(appConfigProvider);
  return GoogleLoginAdapter(serverClientId: config.googleServerClientId);
});

final appleLoginAdapterProvider = Provider<SocialLoginProviderAdapter>((ref) {
  return AppleLoginAdapter(
    configured: ref.watch(appConfigProvider).appleSignInEnabled,
  );
});

final socialAuthApiProvider = Provider<SocialAuthApi>(
  (ref) => SocialAuthApi(ref.watch(dioProvider)),
);

final socialLoginControllerProvider =
    NotifierProvider<SocialLoginController, SocialLoginState>(
      SocialLoginController.new,
    );

class SocialLoginController extends Notifier<SocialLoginState> {
  @override
  SocialLoginState build() {
    Future<void>.microtask(loadAvailability);
    return const SocialLoginState();
  }

  Future<void> loadAvailability() async {
    final results = await Future.wait([
      ref.read(googleLoginAdapterProvider).isAvailable(),
      ref.read(appleLoginAdapterProvider).isAvailable(),
    ]);
    state = state.copyWith(
      googleAvailable: results[0],
      appleAvailable: results[1],
    );
  }

  Future<void> login(SocialLoginProvider provider) async {
    if (state.loading) return;
    final available = provider == SocialLoginProvider.google
        ? state.googleAvailable
        : state.appleAvailable;
    if (!available) return;
    state = state.copyWith(loadingProvider: provider, clearError: true);
    try {
      final adapter = provider == SocialLoginProvider.google
          ? ref.read(googleLoginAdapterProvider)
          : ref.read(appleLoginAdapterProvider);
      final result = await adapter.authenticate();
      switch (result) {
        case ProviderLoginSuccess(:final identityToken, :final rawNonce):
          final api = ref.read(socialAuthApiProvider);
          final pair = provider == SocialLoginProvider.google
              ? await api.google(identityToken)
              : await api.apple(identityToken, rawNonce!);
          await ref
              .read(authenticationControllerProvider.notifier)
              .authenticate(pair);
        case ProviderLoginCancelled():
          break;
        case ProviderLoginUnavailable():
          state = state.copyWith(errorMessage: 'Provider is unavailable');
        case ProviderLoginFailure():
          state = state.copyWith(
            errorMessage: 'Sign-in could not be completed',
          );
      }
    } on Object {
      state = state.copyWith(errorMessage: 'Sign-in could not be completed');
    } finally {
      state = state.copyWith(clearLoading: true);
    }
  }
}
