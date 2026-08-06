# Pinus

Pinus is a Flutter mobile application backed by a NestJS modular monolith. This repository currently provides the local technical foundation only.

## Supported toolchain

- Flutter 3.44.8 and Dart 3.12.2
- Node.js 24.19.0 and npm 12.0.2
- Docker Engine 29.6.2 and Docker Compose 5.3.1

The CI workflow pins the same Flutter and Node major/tool versions. Docker versions newer than those listed should remain compatible with the Compose file.
The pinned PostGIS image runs as `linux/amd64`; Docker Desktop uses emulation on Apple Silicon because this upstream tag does not publish an ARM64 manifest.

## Repository layout

- `apps/mobile`: Flutter application
- `apps/api`: NestJS API
- `infrastructure`: local PostgreSQL/PostGIS Docker Compose configuration

## Local setup

1. Install the supported toolchain above.
2. Copy `infrastructure/.env.example` to `infrastructure/.env` and change local credentials if needed.
3. Copy `apps/api/.env.example` to `apps/api/.env`; keep its database credentials aligned with the infrastructure file.
4. Start PostgreSQL/PostGIS:

   ```sh
   docker compose --env-file infrastructure/.env -f infrastructure/docker-compose.yml up -d
   ```

5. Prepare and run the API:

   ```sh
   cd apps/api
   npm ci
   npm run prisma:generate
   npm run prisma:deploy
   npm run start:dev
   ```

   The API is available at `http://localhost:3000`, Swagger at `http://localhost:3000/docs`, and health at `http://localhost:3000/health`.

6. In another terminal, run the mobile app:

   ```sh
   cd apps/mobile
   flutter pub get
   flutter run --dart-define=API_BASE_URL=http://localhost:3000
   ```

   For the Android emulator, use `http://10.0.2.2:3000`. For the iOS Simulator, use `http://localhost:3000`. A physical device must use the development machine's LAN address and permit local network access.

Missing or malformed API configuration produces an explicit configuration-error screen. Do not commit `.env` files; only safe `.env.example` templates belong in source control.

## Quality commands

Backend:

```sh
cd apps/api
npm run format:check
npm run lint
npm test -- --runInBand
npm run test:e2e -- --runInBand
```

Mobile:

```sh
cd apps/mobile
dart format --output=none --set-exit-if-changed lib test
flutter analyze
flutter test
```

## Local database verification

```sh
docker compose --env-file infrastructure/.env -f infrastructure/docker-compose.yml exec postgres \
  psql -U pinus -d pinus -c "SELECT PostGIS_Version();"
```

Local volumes persist between restarts. Removing a volume destroys local data and is intentionally not part of the setup workflow.
