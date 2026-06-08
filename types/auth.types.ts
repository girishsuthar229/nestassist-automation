/**
 * Auth Types & Enums
 * Central type definitions for authentication & user roles.
 */

// ─── Enums ──────────────────────────────────────────────────────────────────

export enum UserRole {
  SUPER_ADMIN = 'SUPER_ADMIN',
  ADMIN = 'ADMIN',
  SERVICE_PARTNER = 'SERVICE_PARTNER',
  CUSTOMER = 'CUSTOMER',
}

// ─── Interfaces ──────────────────────────────────────────────────────────────

/** Shape of a logged-in user token payload */
export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: UserRole | string;
  mobileNumber: string;
  profileImage: string | null;
}

/** Full auth response from POST /api/auth/login */
export interface AuthResponse {
  success: boolean;
  message: string;
  data?: AuthData;
  error?: string;
}

export interface AuthData {
  id: number;
  role: string;
  token: string;
  token_type: string;
  expires_in: string;
  user: AuthUser;
}

/** Profile image object returned by the backend */
export interface ProfileImage {
  url: string;
  thumbnail: string;
  public_id: string | null;
}

/** Profile data returned from GET /api/user-profile/profile */
export interface ProfileData {
  id: number;
  name: string;
  email: string;
  country_code: string;
  mobile_number: string;
  role: string;
  profile_image: ProfileImage;
  is_super_admin: boolean;
  profile_address?: string;
  permanent_address?: string;
  residential_address?: string;
}

/** Legacy alias kept for backwards compatibility */
export interface UserProfile extends AuthUser {}

/** Forgot password request */
export interface ForgotPasswordRequest {
  email: string;
}

/** Reset password request */
export interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
