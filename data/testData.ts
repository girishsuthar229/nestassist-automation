/**
 * DDT (Data-Driven Testing) – User credentials per role
 * Used with test.describe.parallel or testCases.forEach() patterns.
 */
import { UserRole } from '../types/auth.types';
import { ROUTES } from '../constants/routes';

export interface TestUser {
  /** Human-readable label for the test name */
  label: string;
  email: string;
  password: string;
  role: UserRole;
  expectedRedirectURL: string;
  expectedURLPattern: RegExp;
}


export const VALID_USERS: TestUser[] = [
  {
    label: 'Super Admin',
    email: 'homecare-admin@yopmail.com',
    password: 'Admin@123',
    role: UserRole.SUPER_ADMIN,
    expectedRedirectURL: ROUTES.ADMIN_DASHBOARD,
    expectedURLPattern: /\/admin\/dashboard/,
  },
  {
    label: 'Service Partner',
    email: 'ravi.patel.cleanpro@yopmail.com',
    password: 'Admin@123',
    role: UserRole.SERVICE_PARTNER,
    expectedRedirectURL: ROUTES.PARTNER_DASHBOARD,
    expectedURLPattern: /\/partner\/dashboard/,
  },
];

export interface InvalidLoginCase {
  label: string;
  email: string;
  password: string;
  expectedErrorContains: string;
}

export const INVALID_LOGIN_CASES: InvalidLoginCase[] = [
  {
    label: 'Wrong password',
    email: 'homecare-admin@yopmail.com',
    password: 'WrongPassword123',
    expectedErrorContains: 'Invalid email or password',
  },
  {
    label: 'Non-existent email',
    email: 'notregistered@example.com',
    password: 'Admin@123',
    expectedErrorContains: 'Invalid email or password',
  },
  {
    label: 'Empty email',
    email: '',
    password: 'Admin@123',
    expectedErrorContains: 'required',
  },
  {
    label: 'Empty password',
    email: 'homecare-admin@yopmail.com',
    password: '',
    expectedErrorContains: 'required',
  },
  {
    label: 'Invalid email format',
    email: 'not-an-email',
    password: 'Admin@123',
    expectedErrorContains: 'invalid',
  },
];

// Legacy exports (keep backward compat with existing tests)
export const testCases = [
  {
    name: 'Invalid credentials',
    email: 'wrong@example.com',
    password: 'wrongpassword',
    expectedError: 'Invalid email or password',
    shouldSucceed: false,
    role: null,
  },
  {
    name: 'Super Admin Login',
    email: 'homecare-admin@yopmail.com',
    password: 'Admin@123',
    expectedError: null,
    shouldSucceed: true,
    role: UserRole.SUPER_ADMIN,
  },
  {
    name: 'Ravi Patel (Partner)',
    email: 'ravi.patel.cleanpro@yopmail.com',
    password: 'Admin@123',
    expectedError: null,
    shouldSucceed: true,
    role: UserRole.SERVICE_PARTNER,
  },
];

export const testUsers = VALID_USERS.map(u => ({
  name: u.label,
  email: u.email,
  password: u.password,
  expectedRole: u.role,
  expectedName: u.label,
}));

export const invalidLoginCases = INVALID_LOGIN_CASES.slice(0, 2).map(c => ({
  name: c.label,
  email: c.email,
  password: c.password,
  expectedError: c.expectedErrorContains,
}));
