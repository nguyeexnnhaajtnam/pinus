import 'package:dio/dio.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

class PermanentRefreshException implements Exception {
  const PermanentRefreshException();
}

class AuthApi {
  const AuthApi(this._dio);
  final Dio _dio;

  Future<TokenPair> refresh(String refreshToken) async {
    try {
      final response = await _dio.post<Map<String, dynamic>>(
        '/auth/refresh',
        data: {'refreshToken': refreshToken},
      );
      final data = response.data;
      if (data == null) throw const FormatException('Invalid refresh response');
      return TokenPair.fromJson({...data, 'version': 1});
    } on DioException catch (error) {
      if ({400, 401, 403}.contains(error.response?.statusCode)) {
        throw const PermanentRefreshException();
      }
      rethrow;
    }
  }

  Future<void> signOutCurrent(String accessToken) => _dio.post<void>(
    '/auth/sign-out',
    options: Options(headers: {'Authorization': 'Bearer $accessToken'}),
  );
  Future<void> signOutOthers(String accessToken) => _dio.post<void>(
    '/auth/sign-out-others',
    options: Options(headers: {'Authorization': 'Bearer $accessToken'}),
  );
}
