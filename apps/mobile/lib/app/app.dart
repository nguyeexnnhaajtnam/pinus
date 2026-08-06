import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:pinus_mobile/app/router.dart';

class PinusApp extends ConsumerWidget {
  const PinusApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp.router(
      title: 'Pinus',
      theme: ThemeData(colorSchemeSeed: Colors.green, useMaterial3: true),
      routerConfig: ref.watch(routerProvider),
    );
  }
}
