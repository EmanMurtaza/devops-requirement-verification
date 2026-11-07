# Swapping the build/test steps for your stack

Only the three steps marked in `.github/workflows/acceptance.yml` change. Keep the job names `build` and `ticket-check`, because branch protection refers to them.

The one rule that matters: **acceptance tests live in their own folder (`/acceptance-tests/`) and run as their own step**, so CODEOWNERS can lock them and the log shows which layer failed.

## .NET
```yaml
      - uses: actions/setup-dotnet@v4
        with: { dotnet-version: 8.0.x }
      - name: Build
        run: dotnet build --configuration Release
      - name: Unit tests
        run: dotnet test tests/UnitTests --no-build -c Release
      - name: Acceptance tests
        run: dotnet test acceptance-tests/AcceptanceTests -c Release
```
Write ACs with xUnit + `[Fact(DisplayName = "AC1: Given ... When ... Then ...")]`, or Reqnroll/SpecFlow if QA prefers real Gherkin `.feature` files.

## React / TypeScript
```yaml
      - uses: actions/setup-node@v4
        with: { node-version: 22, cache: npm }
      - run: npm ci
      - name: Build
        run: npm run build
      - name: Unit tests
        run: npm test -- --run
      - name: Acceptance tests
        run: npx playwright install --with-deps chromium && npx playwright test acceptance-tests/
```
Playwright (browser flows) or Vitest + Testing Library (component behaviour) both fit. Cucumber.js works for Gherkin.

## Flutter
```yaml
      - uses: subosito/flutter-action@v2
        with: { channel: stable }
      - run: flutter pub get
      - name: Build
        run: flutter analyze
      - name: Unit tests
        run: flutter test test/
      - name: Acceptance tests
        run: flutter test acceptance-tests/
```
Widget tests cover most ACs. Full device flows (`integration_test`) need an emulator and are slower; add them later.

## API-only services (any language)
Acceptance tests can call the running service over HTTP (start it in the workflow, then run the tests against `localhost`). This is usually the most stable acceptance layer.
