import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinus_mobile/core/network/dio_provider.dart';
import 'package:pinus_mobile/features/health/data/health_api_client.dart';

final healthApiClientProvider = Provider<HealthApiClient>(
  (ref) => HealthApiClient(ref.watch(dioProvider)),
);

final healthStatusProvider = FutureProvider.autoDispose<HealthStatus>(
  (ref) => ref.watch(healthApiClientProvider).fetchHealth(),
  retry: (retryCount, error) => null,
);
