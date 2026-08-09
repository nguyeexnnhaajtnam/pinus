import 'dart:convert';

import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:pinus_mobile/core/auth/token_pair.dart';

abstract interface class SecureTokenStorage {
  Future<TokenPair?> read();
  Future<void> write(TokenPair pair);
  Future<void> delete();
}

class PlatformSecureTokenStorage implements SecureTokenStorage {
  PlatformSecureTokenStorage([FlutterSecureStorage? storage])
    : _storage = storage ?? const FlutterSecureStorage();

  static const _key = 'pinus.authentication.token_pair';
  final FlutterSecureStorage _storage;

  @override
  Future<TokenPair?> read() async {
    final value = await _storage.read(key: _key);
    if (value == null) return null;
    final decoded = jsonDecode(value);
    if (decoded is! Map<String, dynamic>) {
      throw const FormatException('Invalid token pair');
    }
    return TokenPair.fromJson(decoded);
  }

  @override
  Future<void> write(TokenPair pair) =>
      _storage.write(key: _key, value: jsonEncode(pair.toJson()));

  @override
  Future<void> delete() => _storage.delete(key: _key);
}

class InMemorySecureTokenStorage implements SecureTokenStorage {
  TokenPair? value;
  Object? readError;
  Object? writeError;
  Object? deleteError;

  @override
  Future<TokenPair?> read() async {
    if (readError case final error?) throw error;
    return value;
  }

  @override
  Future<void> write(TokenPair pair) async {
    if (writeError case final error?) throw error;
    value = pair;
  }

  @override
  Future<void> delete() async {
    if (deleteError case final error?) throw error;
    value = null;
  }
}
