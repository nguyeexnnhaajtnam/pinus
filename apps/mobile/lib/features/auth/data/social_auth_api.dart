import 'package:dio/dio.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

class SocialAuthApi {
  const SocialAuthApi(this._dio);
  final Dio _dio;

  Future<TokenPair> google(String identityToken) =>
      _exchange('/auth/social/google', {'identityToken': identityToken});

  Future<TokenPair> apple(String identityToken, String rawNonce) => _exchange(
    '/auth/social/apple',
    {'identityToken': identityToken, 'rawNonce': rawNonce},
  );

  Future<TokenPair> _exchange(String path, Map<String, String> body) async {
    final response = await _dio.post<Map<String, dynamic>>(path, data: body);
    final data = response.data;
    if (data == null) throw const FormatException('Invalid login response');
    return TokenPair.fromJson({...data, 'version': 1});
  }
}
