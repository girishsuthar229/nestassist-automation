/**
 * Mock Fixture
 * Provides a fixture-level mock helper object to simplify route interception.
 * Tests using this fixture get a `mock` object with one-liner mock methods.
 */
import { test as base, Page } from '@playwright/test';
import {
  mockAdminLogin,
  mockPartnerLogin,
  mockLoginFailure,
  mockProfile,
  mockProfileUpdateSuccess,
  mockForgotPasswordSuccess,
  mockForgotPasswordNotFound,
  mockResetPasswordSuccess,
  mockServicesList,
  mockDashboardStats,
  mockAdminDashboardOverview,
  mockPartnerDashboardAnalytics,
} from '../utils/mockHelper';
import { ProfileData } from '../types/auth.types';

interface MockHelper {
  adminLogin(): Promise<void>;
  partnerLogin(): Promise<void>;
  loginFailure(): Promise<void>;
  profile(profile: ProfileData): Promise<void>;
  profileUpdateSuccess(): Promise<void>;
  forgotPasswordSuccess(): Promise<void>;
  forgotPasswordNotFound(): Promise<void>;
  resetPasswordSuccess(): Promise<void>;
  servicesList(): Promise<void>;
  dashboardStats(): Promise<void>;
  adminDashboardOverview(): Promise<void>;
  partnerDashboardAnalytics(): Promise<void>;
}

type MockFixtures = {
  /** Ready-to-use mock helper bound to the current page */
  mock: MockHelper;
};

/** Mock fixture — extend this in tests that need route interception helpers */
export const mockTest = base.extend<MockFixtures>({
  mock: async ({ page }, use) => {
    const helper: MockHelper = {
      adminLogin: () => mockAdminLogin(page),
      partnerLogin: () => mockPartnerLogin(page),
      loginFailure: () => mockLoginFailure(page),
      profile: (p: ProfileData) => mockProfile(page, p),
      profileUpdateSuccess: () => mockProfileUpdateSuccess(page),
      forgotPasswordSuccess: () => mockForgotPasswordSuccess(page),
      forgotPasswordNotFound: () => mockForgotPasswordNotFound(page),
      resetPasswordSuccess: () => mockResetPasswordSuccess(page),
      servicesList: () => mockServicesList(page),
      dashboardStats: () => mockDashboardStats(page),
      adminDashboardOverview: () => mockAdminDashboardOverview(page),
      partnerDashboardAnalytics: () => mockPartnerDashboardAnalytics(page),
    };
    await use(helper);
  },
});
