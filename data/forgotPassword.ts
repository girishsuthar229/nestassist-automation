/**
 * Forgot Password & Reset Password Test Scenarios
 * DDT scenarios for both positive and negative flows.
 */

export interface ForgotPasswordScenario {
  label: string;
  email: string;
  shouldSucceed: boolean;
  expectedMessage: string;
  mockStatus: number;
}

export const FORGOT_PASSWORD_SCENARIOS: ForgotPasswordScenario[] = [
  {
    label: 'Registered email – should send reset link',
    email: 'admin-homecare2@yopmail.com',
    shouldSucceed: true,
    expectedMessage: 'reset link has been sent',
    mockStatus: 200,
  },
  {
    label: 'Unregistered email – should show not found error',
    email: 'ravi.pate@s.yopmail.com',
    shouldSucceed: false,
    expectedMessage: 'No account found',
    mockStatus: 404,
  },
  {
    label: 'fail NEGATIVE - invalid email format',
    email: 'ravi.pate@s.',
    shouldSucceed: false,
    expectedMessage: 'valid email',
    mockStatus: 0, 
  },
  {
    label: 'Empty email - client validation error',
    email: '',
    shouldSucceed: false,
    expectedMessage: 'email is required',
    mockStatus: 0,
  },
];

export interface ResetPasswordScenario {
  label: string;
  token: string;
  newPassword: string;
  shouldSucceed: boolean;
  expectedMessage: string;
  mockStatus: number;
}

export const RESET_PASSWORD_SCENARIOS: ResetPasswordScenario[] = [
  {
    label: 'Valid token and strong password',
    token: 'valid-reset-token-abc123',
    newPassword: 'NewPass@456',
    shouldSucceed: true,
    expectedMessage: 'Password has been reset',
    mockStatus: 200,
  },
  {
    label: 'Expired/invalid token',
    token: 'expired-token-xyz',
    newPassword: 'NewPass@456',
    shouldSucceed: false,
    expectedMessage: 'Invalid or expired',
    mockStatus: 400,
  },
];
