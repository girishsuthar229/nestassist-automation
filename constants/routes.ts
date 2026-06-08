/**
 * Application Frontend Routes
 * Mirrors homecare_frontend/src/routes/config.ts for use in Playwright tests.
 * Usage: await page.goto(ROUTES.AUTH_LOGIN)
 */
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  CUSTOMER_OTP: '/login/otp',
  SIGNUP: '/signup',
  CONTACT: '/contact',
  ABOUT_US: '/about-us',
  TERMS_AND_CONDITIONS: '/terms-and-conditions',
  PRIVACY_POLICY: '/privacy-policy',
  CAREERS: '/careers',
  REVIEWS: '/reviews',
  CATEGORIES: '/categories',
  BLOGS: '/blogs',
  SERVICES: '/services',
  SERVICE_LISTING: (serviceTypeId: string) => `/services-type/${serviceTypeId}`,
  SERVICE_DETAILS: (serviceId: string) => `/service-details/${serviceId}`,
  SERVICE_PARTNER_SIGNUP: '/service-partner-signup',
  CHECKOUT: (serviceId: string) => `/checkout/${serviceId}`,
  CHECKOUT_SUCCESS: (bookingId: string) => `/checkout/success/${bookingId}`,

  // ─── Auth Routes ─────────────────────────────────────────
  AUTH_LOGIN: '/auth/login',
  AUTH_FORGOT_PASSWORD: '/auth/forgot-password',
  AUTH_RESET_PASSWORD: '/auth/reset-password',
  MY_PROFILE: '/my-profile',
  MY_BOOKINGS: '/my-bookings',

  // ─── Admin Routes ─────────────────────────────────────────
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_PROFILE: '/admin/my-profile',
  ADMIN_SERVICE_MANAGEMENT: '/admin/service-management',
  ADMIN_SERVICE_DETAILS: (serviceId: string) => `/admin/service-management/${serviceId}`,
  ADMIN_CUSTOMER_MANAGEMENT: '/admin/user-management/customers',
  ADMIN_CUSTOMER_DETAILS: (customerId: string) => `/admin/user-management/customers/${customerId}`,
  ADMIN_SERVICE_PARTNER_MANAGEMENT: '/admin/user-management/service-partners',
  ADMIN_SERVICE_PARTNER_DETAILS: (partnerId: string) => `/admin/user-management/service-partners/${partnerId}`,
  ADMIN_ADMIN_USER_MANAGEMENT: '/admin/user-management/admin-users',
  ADMIN_BOOKING_MANAGEMENT: '/admin/booking-management',
  ADMIN_BOOKING_DETAILS: (bookingId: string) => `/admin/booking-management/${bookingId}`,
  ADMIN_OFFERS: '/admin/offers',
  ADMIN_PAYMENTS: '/admin/payments',
  ADMIN_PAYMENT_DETAILS: (id: string) => `/admin/payments/details/${id}`,
  ADMIN_MASTER_DATA: '/admin/master-data',
  ADMIN_SUPPORT: '/admin/support',
  ADMIN_LOGS: '/admin/logs',

  // ─── Service Partner Routes ───────────────────────────────
  PARTNER: '/partner',
  PARTNER_DASHBOARD: '/partner/dashboard',
  PARTNER_PROFILE: '/partner/my-profile',
  PARTNER_SERVICE_MANAGEMENT: '/partner/service-management',
  PARTNER_SERVICE_DETAILS: (serviceId: string) => `/partner/service-management/${serviceId}`,
} as const;
