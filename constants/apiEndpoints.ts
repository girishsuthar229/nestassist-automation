/**
 * Backend API Endpoint Constants
 * Usage: API.AUTH.LOGIN → '/api/auth/login'
 *
 * These match the Express routes in homecare_backend/src/routes/
 * Base URL is set via process.env.API_BASE_URL (default: http://localhost:5000)
 */
export const API = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USER_PROFILE: {
    GET: '/user-profile/profile',
    UPDATE: '/user-profile/update-profile',
  },
  CUSTOMER_PROFILE: {
    CHANGE_MOBILE: '/customer/profile/change-mobile',
    CHANGE_EMAIL: '/customer/profile/change-email',
    VERIFY_EMAIL_UPDATE: '/customer/profile/verify-email-update',
    SAVE_ADDRESS: '/customer/profile/save-address',
    GET_ADDRESSES: '/customer/profile/addresses',
    GET_ADDRESS_BY_ID: (id: string) => `/customer/profile/addresses/${id}`,
    DELETE_ADDRESS: (id: string) => `/customer/profile/addresses/${id}`,
    RECENT_SEARCHES_GET: '/customer/profile/recent-searches',
    RECENT_SEARCHES_POST: '/customer/profile/recent-searches',
  },

  CUSTOMER_AUTH: {
    SIGNUP: '/customer/auth/signup',
    SEND_OTP: '/customer/auth/send-otp',
    VERIFY_OTP: '/customer/auth/verify-otp',
    LOGIN_WITH_GOOGLE: '/customer/auth/google',
  },
  SERVICES: {
    LIST: '/services',
    DETAIL: (id: string) => `/services/${id}`,
    TYPES: '/service-types',
  },
  CATEGORIES: {
    LIST_BY_SERVICE_TYPE: (serviceTypeId: string | number) => `/service-types/${serviceTypeId}/categories`,
    LIST: '/categories',
    DETAIL: (id: string) => `/categories/${id}`,
  },
  DASHBOARD: {
    ADMIN_STATS: '/dashboard/stats',
    OVERVIEW: '/dashboard/overview',
    ANALYTICS: '/dashboard/analytics',
  },
  BOOKINGS: {
    LIST: '/bookings',
    DETAIL: (id: string) => `/bookings/${id}`,
    CREATE: '/bookings',
  },
} as const;

/** Wildcard patterns for page.route() interception */
export const API_PATTERNS = {
  AUTH_LOGIN: '**/api/auth/login',
  AUTH_LOGOUT: '**/api/auth/logout',
  AUTH_FORGOT_PASSWORD: '**/api/auth/forgot-password',
  AUTH_RESET_PASSWORD: '**/api/auth/reset-password',
  USER_PROFILE: '**/api/user-profile/profile',
  USER_PROFILE_UPDATE: '**/api/user-profile/update-profile',
  SERVICES_LIST: '**/api/services',
  SERVICE_TYPES_PUBLIC: '**/api/service-types/public',
  CATEGORIES_LIST: '**/api/categories',
  DASHBOARD_STATS: '**/api/dashboard/stats',
  DASHBOARD_OVERVIEW: '**/api/dashboard/overview',
  DASHBOARD_ANALYTICS: '**/api/dashboard/analytics',
  CUSTOMER_PROFILE_CHANGE_MOBILE: '**/api/customer/profile/change-mobile',
  CUSTOMER_SEND_OTP: '**/api/v1/customer/send-otp',
  CUSTOMER_VERIFY_OTP: '**/api/v1/customer/verify-otp',
} as const;
