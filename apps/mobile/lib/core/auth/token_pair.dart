class TokenPair {
  const TokenPair({
    required this.accessToken,
    required this.refreshToken,
    this.version = 1,
  });

  final String accessToken;
  final String refreshToken;
  final int version;

  Map<String, Object> toJson() => {
    'version': version,
    'accessToken': accessToken,
    'refreshToken': refreshToken,
  };

  factory TokenPair.fromJson(Map<String, dynamic> json) {
    if (json['version'] != 1 ||
        json['accessToken'] is! String ||
        json['refreshToken'] is! String ||
        (json['accessToken'] as String).isEmpty ||
        (json['refreshToken'] as String).isEmpty) {
      throw const FormatException('Invalid token pair');
    }
    return TokenPair(
      accessToken: json['accessToken'] as String,
      refreshToken: json['refreshToken'] as String,
    );
  }
}
