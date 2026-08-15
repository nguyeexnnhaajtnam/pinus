import 'package:flutter_test/flutter_test.dart';
import 'package:pinus_mobile/features/auth/data/google_login_adapter.dart';
import 'package:pinus_mobile/features/auth/domain/social_login.dart';

class FakeGoogleClient implements GoogleProviderClient {
  String? token = 'google-identity-token';
  Object? error;
  String? initializedWith;

  @override
  Future<String?> authenticate() async {
    if (error case final value?) throw value;
    return token;
  }

  @override
  Future<void> initialize(String serverClientId) async {
    initializedWith = serverClientId;
    if (error case final value?) throw value;
  }
}

void main() {
  test(
    'missing configuration is unavailable and never authenticates',
    () async {
      final client = FakeGoogleClient();
      final adapter = GoogleLoginAdapter(serverClientId: null, client: client);

      expect(await adapter.isAvailable(), isFalse);
      expect(await adapter.authenticate(), isA<ProviderLoginUnavailable>());
      expect(client.initializedWith, isNull);
    },
  );

  test(
    'initializes with server client ID and returns identity token',
    () async {
      final client = FakeGoogleClient();
      final adapter = GoogleLoginAdapter(
        serverClientId: 'web-client.apps.googleusercontent.com',
        client: client,
      );

      expect(await adapter.isAvailable(), isTrue);
      final result = await adapter.authenticate();
      expect(client.initializedWith, 'web-client.apps.googleusercontent.com');
      expect(result, isA<ProviderLoginSuccess>());
      expect(
        (result as ProviderLoginSuccess).identityToken,
        'google-identity-token',
      );
    },
  );

  test('maps cancellation without exposing an error', () async {
    final client = FakeGoogleClient()..error = const GoogleProviderCancelled();
    final adapter = GoogleLoginAdapter(
      serverClientId: 'client',
      client: client,
    );

    expect(await adapter.authenticate(), isA<ProviderLoginCancelled>());
  });

  test('maps provider failure and missing identity token to failure', () async {
    final failedClient = FakeGoogleClient()..error = Exception('secret detail');
    final failed = GoogleLoginAdapter(
      serverClientId: 'client',
      client: failedClient,
    );
    expect(await failed.authenticate(), isA<ProviderLoginFailure>());

    final missingClient = FakeGoogleClient()..token = null;
    final missing = GoogleLoginAdapter(
      serverClientId: 'client',
      client: missingClient,
    );
    expect(await missing.authenticate(), isA<ProviderLoginFailure>());
  });
}
