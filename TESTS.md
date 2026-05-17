# Automated Tests Documentation

This document lists all automated tests implemented for the **SpendLens AI** platform, detailing their filenames, target coverage, and instructions for running them.

---

## Testing Framework & Configuration

- **Framework**: [Vitest](https://vitest.dev/) (v4.1.5)
- **Environment**: Node.js 22
- **Command to Run Tests**:
  ```bash
  npx vitest run
  ```
  Or for watch mode:
  ```bash
  npx vitest
  ```

---

## Test Suites

### 1. Audit Engine Suite (`src/tests/auditEngine.test.ts`)

This suite exercises the deterministic pricing and audit logic of the SpendLens AI analysis engine. It ensures recommendations are accurate, numbers trace correctly to verified pricing plans, and no fake savings are suggested.

All **6 tests** currently pass successfully.

#### Test Coverage:

* **[x] Calculates monthly and annual savings correctly**
  - **Description**: Verifies that when a user is overpaying for a plan compared to the standard public pricing (e.g., paying $40/mo for a ChatGPT Plus seat that lists at $20/mo), the engine registers the $20/mo overpayment, compiles the monthly savings, and scales it to annual savings ($240/yr).
  
* **[x] Recommends downgrade for small team on business plan**
  - **Description**: Tests the rule that teams of size 5 or smaller do not need bulky enterprise/business plans. If a team of 3 is paying for Cursor Business ($40/seat/mo), it recommends downgrading to Cursor Pro ($20/seat/mo), generating a verified monthly savings of $60.

* **[x] Recommends discounted compute credits for high API spend**
  - **Description**: Tests that if direct API spend (e.g. OpenAI API, Anthropic API) exceeds $100/mo, the engine flags it and suggests utilizing Credex infrastructure credits to capture a 15% discount.

* **[x] Returns "keep" when spending is already good**
  - **Description**: Ensures that if a user is already on the optimal plan (e.g., 1 user on Claude Pro paying exactly $20/mo), the engine is honest, returns `0` savings, and recommends keeping the current setup rather than inventing artificial savings.

* **[x] Never returns negative savings**
  - **Description**: Protects against bugs where anomalous user entries (e.g. paying *less* than retail due to existing promotions) result in negative savings. The engine caps recommendations at $0 minimum.

* **[x] Recommends consolidation when multiple coding tools are used**
  - **Description**: Tests that if a user has multiple overlapping development tools active (e.g. Cursor Pro + GitHub Copilot Individual) for a primary coding use case, the engine advises consolidation to a single tool to trim waste.

---

## CI/CD Integration

These tests are integrated into the GitHub Actions workflow (`.github/workflows/ci.yml`). They execute automatically on every `push` and `pull_request` to the `main` or `master` branches, guaranteeing that no regression breaches the deterministic audit engine rules.
