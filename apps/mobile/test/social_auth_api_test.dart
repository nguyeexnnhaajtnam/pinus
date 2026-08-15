import 'package:dio/dio.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:http_mock_adapter/http_mock_adapter.dart';
import 'package:pinus_mobile/features/auth/data/social_auth_api.dart';

void main() {
  late Dio dio;
  late DioAdapter adapter;
  late SocialAuthApi api;

  setUp(() {
    dio = Dio(BaseOptions(baseUrl: 'http://localhost:3000'));
    adapter = DioAdapter(dio: dio);
    api = SocialAuthApi(dio);
  });

  test('Google sends only the identity token to its endpoint', () async {
    adapter.onPost(
      '/auth/social/google',
      (server) => server.reply(201, {
        'accessToken': 'pinus-access',
        'refreshToken': 'pinus-refresh',
      }),
      data: {'identityToken': 'google-proof'},
    );

    final pair = await api.google('google-proof');

    expect(pair.accessToken, 'pinus-access');
    expect(pair.refreshToken, 'pinus-refresh');
  });

  test('Apple sends only the identity token and raw nonce', () async {
    adapter.onPost(
      '/auth/social/apple',
      (server) => server.reply(201, {
        'accessToken': 'pinus-access',
        'refreshToken': 'pinus-refresh',
      }),
      data: {'identityToken': 'apple-proof', 'rawNonce': 'ephemeral-nonce'},
    );

    final pair = await api.apple('apple-proof', 'ephemeral-nonce');

    expect(pair.accessToken, 'pinus-access');
    expect(pair.refreshToken, 'pinus-refresh');
  });

  test('rejects malformed Pinus token pairs', () async {
    adapter.onPost(
      '/auth/social/google',
      (server) => server.reply(201, {'accessToken': 'only-one-token'}),
      data: {'identityToken': 'google-proof'},
    );

    await expectLater(
      api.google('google-proof'),
      throwsA(isA<FormatException>()),
    );
  });
}
