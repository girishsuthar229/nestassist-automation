# NestAssist — Playwright Test Automation

End-to-end **UI & API** test automation framework for the NestAssist (Homecare) application, built with [Playwright](https://playwright.dev/) and **TypeScript**.

Tests run locally or through a fully automated **Jenkins CI/CD pipeline** that publishes **Playwright HTML** and **Allure** reports — including pass, fail, skipped, and unknown test results — to **GitHub Pages**.

🔗 **Live Report:** [https://girishsuthar229.github.io/nestassist-automation/](https://girishsuthar229.github.io/nestassist-automation/)

---

## 📁 Project Structure

```
homecare_test/
├── tests/                          # Test specs
│   ├── login.spec.ts               # Login flow tests
│   ├── profile.spec.ts             # User profile tests
│   ├── home.spec.ts                # Home page tests
│   ├── forgotPassword.spec.ts      # Forgot password flow tests
│   ├── services.spec.ts            # Services listing tests
│   ├── adminDashboard.spec.ts      # Admin dashboard tests
│   ├── partnerDashboard.spec.ts    # Partner dashboard tests
│   └── api/                        # API-level tests
│       ├── auth.api.spec.ts        # Auth API tests
│       ├── profile.api.spec.ts     # Profile API tests
│       ├── categories.api.spec.ts  # Categories API tests
│       └── serviceTypes.api.spec.ts# Service Types API tests
│
├── pages/                          # Page Object Models (POM)
│   ├── LoginPage.ts
│   ├── HomePage.ts
│   ├── ProfilePage.ts
│   ├── ForgotPasswordPage.ts
│   ├── ServicesPage.ts
│   ├── AdminDashboardPage.ts
│   ├── PartnerDashboardPage.ts
│   └── LayoutPage.ts
│
├── fixtures/                       # Custom Playwright fixtures
│   ├── index.ts                    # Merged fixture exports (authFixture + mockFixture)
│   ├── authFixture.ts              # Pre-authenticated browser sessions
│   └── mockFixture.ts              # API mock/intercept helpers
│
├── services/                       # API service layer
│   ├── api.service.ts              # Base API service
│   ├── axiosInstance.ts            # Axios HTTP client config
│   └── api/                        # Endpoint-specific API clients
│       ├── authApi.ts
│       ├── profileApi.ts
│       ├── categoriesApi.ts
│       ├── serviceTypesApi.ts
│       └── servicesApi.ts
│
├── constants/                      # Shared constants
│   ├── apiEndpoints.ts             # Backend API endpoint paths & route patterns
│   └── routes.ts                   # Frontend route paths
│
├── data/                           # Test data
│   ├── testData.ts                 # Real test data (credentials, inputs)
│   ├── mockData.ts                 # Mock API response payloads
│   ├── forgotPassword.ts           # Forgot-password-specific test data
│   └── services.ts                 # Services test data
│
├── utils/                          # Helper utilities
│   ├── authHelper.ts               # Login / token helpers
│   ├── mockHelper.ts               # API mocking utilities
│   └── testHelper.ts               # Common test helper functions
│
├── types/                          # TypeScript type definitions
│   ├── auth.types.ts               # Auth-related interfaces
│   └── api.types.ts                # API response types
│
├── playwright.config.ts            # Playwright configuration
├── tsconfig.json                   # TypeScript configuration
├── Jenkinsfile                     # CI/CD pipeline (uses jenkins-shared-library)
├── package.json                    # Dependencies & npm scripts
└── .gitignore
```

---

## 🛠️ Tech Stack

| Technology           | Purpose                                |
|----------------------|----------------------------------------|
| **Playwright**       | Browser automation & API testing       |
| **TypeScript**       | Type-safe test code                    |
| **Allure Reporter**  | Rich test reports (pass/fail/skip/unknown) |
| **dotenv**           | Environment variable management        |
| **Jenkins**          | CI/CD pipeline automation              |
| **GitHub Pages**     | Public report hosting                  |

---

## ⚙️ Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/girishsuthar229/nestassist-automation.git
cd nestassist-automation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Install Playwright Browsers

```bash
npx playwright install
```

### 4. Configure Environment Variables

Create a `.env` file in the project root:

```env
FRONTEND_BASE_URL=https://your-app-url.com
API_BASE_URL=https://your-api-url.com

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_admin_password
PARTNER_EMAIL=partner@example.com
PARTNER_PASSWORD=your_partner_password

PW_RETRIES=1
PW_WORKERS=1
REPORTER=allure-playwright
TO_SEND_EMAIL=recipient@example.com
```

---

## 🧪 Running Tests

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
npm run test:login           # Login tests
npm run test:profile         # Profile tests
npm run test:home            # Home page tests
npm run test:forgot          # Forgot password tests
npm run test:services        # Services tests
npm run test:admin           # Admin dashboard tests
npm run test:partner         # Partner dashboard tests
npm run test:api             # All API tests
```

### Run with UI / Debug Mode

```bash
npm run test:headed          # Run in headed browser
npm run test:ui              # Playwright UI mode
npm run test:debug           # Debug mode with inspector
```

---

## 📊 Test Reports

### Playwright HTML Report

After a test run, open the built-in Playwright report:

```bash
npm run report
```

The report is generated in `playwright-report/index.html` and shows **pass**, **fail**, **skipped**, and **flaky** tests with screenshots, videos, and traces for failures.

### Allure Report

Generate and view the Allure report:

```bash
npm run allure:generate      # Generate report from allure-results/
npm run allure:serve         # Serve report in browser
```

Allure provides detailed analytics including:

| Status      | Meaning                                    |
|-------------|--------------------------------------------|
| ✅ **Passed**  | Test completed successfully              |
| ❌ **Failed**  | Test assertion or runtime failure        |
| ⏭️ **Skipped** | Test was skipped (`test.skip()`)         |
| ❓ **Unknown** | Test result could not be determined      |
| 🔁 **Broken** | Infrastructure / environment error        |

---

## 🏗️ Architecture

### Page Object Model (POM)

Every page in the application has a corresponding class in `pages/` that encapsulates selectors and actions:

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}
  async login(email: string, password: string) { /* ... */ }
}
```

### Custom Fixtures

Tests import from `fixtures/index.ts` instead of `@playwright/test` to get pre-configured fixtures:

```typescript
import { test, expect } from '../fixtures';

test('admin can view dashboard', async ({ adminPage, mock }) => {
  // adminPage → pre-authenticated browser session
  // mock      → API mock helpers
});
```

| Fixture         | Purpose                                     |
|-----------------|---------------------------------------------|
| `authFixture`   | Provides pre-logged-in browser contexts (admin, partner) |
| `mockFixture`   | API route interception & mock response helpers |

### API Testing

API tests live in `tests/api/` and use service clients from `services/api/`:

```typescript
// tests/api/auth.api.spec.ts
import { AuthApi } from '../../services/api/authApi';

test('POST /auth/login returns token', async () => {
  const response = await authApi.login(credentials);
  expect(response.status).toBe(200);
});
```

### Path Aliases

TypeScript path aliases are configured in `tsconfig.json` for clean imports:

| Alias            | Maps To           |
|------------------|-------------------|
| `@fixtures/*`    | `fixtures/*`      |
| `@pages/*`       | `pages/*`         |
| `@utils/*`       | `utils/*`         |
| `@data/*`        | `data/*`          |
| `@api/*`         | `services/api/*`  |
| `@constants/*`   | `constants/*`     |
| `@types/*`       | `types/*`         |

---

## 🔄 CI/CD Pipeline (Jenkins)

This project uses a **Jenkins Shared Library** ([jenkins-shared-library](../jenkins-shared-library/)) to run the full CI/CD pipeline automatically.

### Pipeline Stages

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Checkout    │ ──▶ │   Install     │ ──▶ │  Run Tests    │ ──▶ │ Publish Report   │ ──▶ │ Publish to GitHub   │
│   Code        │     │   Deps        │     │  (Playwright) │     │ (HTML + Allure)  │     │ Pages + Email       │
└───────────────┘     └───────────────┘     └───────────────┘     └──────────────────┘     └─────────────────────┘
```

### How It Works

The [`Jenkinsfile`](./Jenkinsfile) imports the shared library and calls reusable pipeline steps:

```groovy
@Library('jenkins-shared-library') _

pipeline {
    agent any

    environment {
        FRONTEND_BASE_URL = credentials('frontend_url')
        API_BASE_URL      = credentials('api_url')
        ADMIN_EMAIL       = credentials('admin_email')
        ADMIN_PASSWORD    = credentials('admin_password')
        PARTNER_EMAIL     = credentials('partner_email')
        PARTNER_PASSWORD  = credentials('partner_password')
        PW_RETRIES        = credentials('pw_retries')
        PW_WORKERS        = credentials('pw_workers')
        REPORTER          = credentials('reporter')
        TO_SEND_EMAIL     = credentials('to_send_email')
    }

    stages {
        stage('Checkout')       { steps { checkoutCode('https://github.com/...') } }
        stage('Install')        { steps { installDependencies() } }
        stage('Test')           { steps { runPlaywrightTests() } }
        stage('Publish Report') { steps { publishReport() } }
        stage('Publish to GitHub Pages') {
            steps {
                publishToGitHubPages(
                    repoUrl      : 'https://github.com/girishsuthar229/nestassist-automation.git',
                    credentialsId: 'github-token',
                    reportDir    : 'playwright-report',
                    publicUrl    : 'https://girishsuthar229.github.io/nestassist-automation/',
                    emailTo      : "${env.TO_SEND_EMAIL}"
                )
            }
        }
    }
}
```

### Jenkins Credentials Required

All sensitive values are stored as **Jenkins credentials** (not in source code):

| Credential ID       | Description                         |
|----------------------|-------------------------------------|
| `frontend_url`       | Application frontend URL           |
| `api_url`            | Backend API URL                     |
| `admin_email`        | Admin login email                   |
| `admin_password`     | Admin login password                |
| `partner_email`      | Partner login email                 |
| `partner_password`   | Partner login password              |
| `pw_retries`         | Playwright retry count              |
| `pw_workers`         | Playwright parallel workers         |
| `reporter`           | Reporter type (e.g. allure-playwright) |
| `to_send_email`      | Email recipient for report notifications |
| `github-token`       | GitHub PAT for pushing to gh-pages  |

### Jenkins Plugins Required

| Plugin                    | Purpose                                 |
|---------------------------|-----------------------------------------|
| **NodeJS Plugin**         | Provides Node.js in the pipeline        |
| **HTML Publisher Plugin** | Publishes Playwright HTML report        |
| **Allure Plugin**         | Publishes Allure report                 |
| **Email Extension Plugin**| Sends email notifications               |

---

## 📋 Playwright Configuration

Key settings in [`playwright.config.ts`](./playwright.config.ts):

| Setting               | Value                          | Description                                |
|-----------------------|--------------------------------|--------------------------------------------|
| `testDir`             | `./tests`                      | Test files directory                       |
| `fullyParallel`       | `true`                         | Run tests in parallel                      |
| `retries`             | `PW_RETRIES` env or `1`        | Retry failed tests                         |
| `workers`             | `1` on CI, `PW_WORKERS` locally| Parallel workers count                     |
| `headless`            | `true`                         | Run in headless mode                       |
| `screenshot`          | `only-on-failure`              | Capture screenshots on failure             |
| `video`               | `retain-on-failure`            | Record video on failure                    |
| `trace`               | `retain-on-failure`            | Collect trace on failure                   |
| `reporter`            | `allure-playwright` + `list`   | Allure results + console output            |
| Browser               | `Desktop Chrome`               | Default project                            |

---

## 📝 Adding New Tests

1. **Create a Page Object** in `pages/` if testing a new page:
   ```typescript
   // pages/NewPage.ts
   import { Page } from '@playwright/test';

   export class NewPage {
     constructor(private page: Page) {}
     // Add selectors and actions
   }
   ```

2. **Add test data** in `data/testData.ts` or create a new data file.

3. **Write the test spec** in `tests/`:
   ```typescript
   // tests/newFeature.spec.ts
   import { test, expect } from '../fixtures';
   import { NewPage } from '../pages/NewPage';

   test.describe('New Feature', () => {
     test('should work correctly', async ({ adminPage }) => {
       const newPage = new NewPage(adminPage);
       // test logic
     });
   });
   ```

4. **Add an npm script** (optional) in `package.json`:
   ```json
   "test:new": "playwright test tests/newFeature.spec.ts"
   ```

---

## 📄 License

Internal use — adapt as needed for your organization.
