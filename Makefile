MOBILE_DIR := apps/mobile
IOS_DEVICE ?= iPhone 17
ANDROID_DEVICE ?= emulator-5554
IOS_CONFIG ?= config/development.ios.local.json
ANDROID_CONFIG ?= config/development.android.local.json

.PHONY: mobile-get mobile-ios mobile-android mobile-test mobile-analyze

mobile-get:
	cd $(MOBILE_DIR) && flutter pub get

mobile-ios:
	@test -f $(MOBILE_DIR)/$(IOS_CONFIG) || (echo "Missing $(MOBILE_DIR)/$(IOS_CONFIG). Copy config/development.ios.example.json and fill in GOOGLE_SERVER_CLIENT_ID." && exit 1)
	cd $(MOBILE_DIR) && flutter run -d "$(IOS_DEVICE)" --dart-define-from-file=$(IOS_CONFIG)

mobile-android:
	@test -f $(MOBILE_DIR)/$(ANDROID_CONFIG) || (echo "Missing $(MOBILE_DIR)/$(ANDROID_CONFIG). Copy config/development.android.example.json and fill in GOOGLE_SERVER_CLIENT_ID." && exit 1)
	cd $(MOBILE_DIR) && flutter run -d "$(ANDROID_DEVICE)" --dart-define-from-file=$(ANDROID_CONFIG)

mobile-test:
	cd $(MOBILE_DIR) && flutter test

mobile-analyze:
	cd $(MOBILE_DIR) && flutter analyze
