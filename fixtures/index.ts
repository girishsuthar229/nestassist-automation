/**
 * Fixture Index
 * Central export point for all custom Playwright fixtures.
 *
 * Usage in tests:
 *   import { test, expect } from '../fixtures';
 *   test('my test', async ({ adminPage, mock }) => { ... });
 */
import { mergeTests } from '@playwright/test';
import { authTest } from './authFixture';
import { mockTest } from './mockFixture';

/** Combined test object with all custom fixtures */
export const test = mergeTests(authTest, mockTest);
export { expect } from '@playwright/test';
