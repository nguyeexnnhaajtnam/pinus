import 'package:dio/dio.dart';

enum HealthStatus { healthy }

class HealthRequestException implements Exception {
  const HealthRequestException(this.message);
  final String message;

  @override
  String toString() => message;
}

class HealthApiClient {
  const HealthApiClient(this._dio);
  final Dio _dio;

  Future<HealthStatus> fetchHealth() async {
    try {
      final response = await _dio.get<Map<String, dynamic>>('/health');
      return parseResponse(response.statusCode, response.data);
    } on DioException catch (error) {
      throw HealthRequestException(
        error.response == null
            ? 'Backend is unreachable'
            : 'Backend request failed (${error.response?.statusCode})',
      );
    } on TypeError {
      throw const HealthRequestException(
        'Backend returned an invalid response',
      );
    }
  }

  static HealthStatus parseResponse(
    int? statusCode,
    Map<String, dynamic>? body,
  ) {
    if (statusCode == 200 && body?['status'] == 'healthy') {
      return HealthStatus.healthy;
    }
    throw const HealthRequestException('Backend reported an unhealthy status');
  }
}
