import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:pinus_mobile/features/health/presentation/health_screen.dart';
import 'package:pinus_mobile/core/auth/auth_controller.dart';
import 'package:pinus_mobile/core/auth/auth_state.dart';
import 'package:pinus_mobile/features/auth/presentation/login_screen.dart';

final routerProvider = Provider<GoRouter>((ref) {
  final authentication = ref.watch(authenticationControllerProvider);
  return GoRouter(
    initialLocation: '/',
    redirect: (context, state) {
      if (authentication is AuthenticationInitializing) return null;
      final onLogin = state.matchedLocation == '/login';
      if (authentication is! Authenticated && !onLogin) return '/login';
      if (authentication is Authenticated && onLogin) return '/';
      return null;
    },
    routes: [
      GoRoute(path: '/', builder: (context, state) => const HealthScreen()),
      GoRoute(path: '/login', builder: (context, state) => const LoginScreen()),
    ],
  );
});
