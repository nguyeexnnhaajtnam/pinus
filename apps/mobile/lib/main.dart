import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinus_mobile/app/app.dart';
import 'package:pinus_mobile/core/config/app_config.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    final config = AppConfig.fromEnvironment();
    runApp(
      ProviderScope(
        overrides: [appConfigProvider.overrideWithValue(config)],
        child: const PinusApp(),
      ),
    );
  } on FormatException catch (error) {
    runApp(ConfigurationErrorApp(message: error.message));
  }
}

class ConfigurationErrorApp extends StatelessWidget {
  const ConfigurationErrorApp({required this.message, super.key});
  final String message;

  @override
  Widget build(BuildContext context) => MaterialApp(
    home: Scaffold(body: Center(child: Text('Configuration error: $message'))),
  );
}
