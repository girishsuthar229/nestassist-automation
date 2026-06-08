/**
 * Mock Data – Central repository of all mock API response data
 * Used for page.route() interception in Playwright tests.
 * Based on real API response shapes from homecare_backend.
 */
import { UserRole, ProfileData, AuthUser } from '../types/auth.types';
import { DashboardStats, ServiceData, BookingData } from '../types/api.types';

// ─────────────────────────────────────────────────────────────────────────────
// MOCK USERS (token payload shape)
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_ADMIN_USER: AuthUser = {
  id: 109,
  name: 'Super Admin',
  email: 'homecare-admin@yopmail.com',
  role: UserRole.SUPER_ADMIN,
  mobileNumber: '98567496219',
  profileImage: null,
};

export const MOCK_PARTNER_USER: AuthUser = {
  id: 105,
  name: 'Ravi Patel',
  email: 'ravi.patel.cleanpro@yopmail.com',
  role: UserRole.SERVICE_PARTNER,
  mobileNumber: '9988776655',
  profileImage: 'https://avatar.iran.liara.run/public/partner',
};

export const MOCK_CUSTOMER_USER: AuthUser = {
  id: 210,
  name: 'Priya Sharma',
  email: 'priya.sharma@yopmail.com',
  role: UserRole.CUSTOMER,
  mobileNumber: '9876543210',
  profileImage: 'https://avatar.iran.liara.run/public/girl',
};

export const MOCK_ADMIN_PROFILE: ProfileData = {
  id: 109,
  name: 'Super Admin',
  country_code: '91',
  mobile_number: '98567496219',
  email: 'homecare-admin@yopmail.com',
  role: UserRole.SUPER_ADMIN,
  profile_image: {
    url: 'https://res.cloudinary.com/dgtnzqrfc/image/upload/v1776342409/admin_profiles/user_97_1776342405.png',
    thumbnail: 'https://res.cloudinary.com/dgtnzqrfc/image/upload/w_150,h_150,c_fill/v1776342409/admin_profiles/user_97_1776342405.png',
    public_id: null,
  },
  is_super_admin: true,
  profile_address: 'Near Karnavati Club, Ahmedabad, Gujarat',
};

export const MOCK_PARTNER_PROFILE: ProfileData = {
  id: 105,
  name: 'Ravi Patel',
  country_code: '91',
  mobile_number: '9988776655',
  email: 'ravi.patel.cleanpro@yopmail.com',
  role: UserRole.SERVICE_PARTNER,
  profile_image: {
    url: 'https://avatar.iran.liara.run/public/partner',
    thumbnail: 'https://avatar.iran.liara.run/public/partner',
    public_id: null,
  },
  is_super_admin: false,
  permanent_address: '123 Partner St, Surat',
  residential_address: '456 Home St, Surat',
  profile_address: '123 Partner St, Surat',
};

export const MOCK_CUSTOMER_PROFILE: ProfileData = {
  id: 210,
  name: 'Priya Sharma',
  country_code: '91',
  mobile_number: '9876543210',
  email: 'priya.sharma@yopmail.com',
  role: UserRole.CUSTOMER,
  profile_image: {
    url: 'https://avatar.iran.liara.run/public/girl',
    thumbnail: 'https://avatar.iran.liara.run/public/girl',
    public_id: null,
  },
  is_super_admin: false,
  profile_address: '789 Customer Lane, Mumbai',
};

// MOCK SERVICES
export const MOCK_SERVICE_LIST: ServiceData[] = [
  {
    id: 1,
    name: 'Deep Home Cleaning',
    description: 'Full home cleaning including all rooms and bathrooms.',
    price: 999,
    duration: '4 hours',
    category_id: 1,
    category_name: 'Cleaning',
    image_url: 'https://placehold.co/400x300?text=Cleaning',
    is_active: true,
  },
  {
    id: 2,
    name: 'AC Repair & Service',
    description: 'Complete diagnosis and repair of all AC types.',
    price: 499,
    duration: '2 hours',
    category_id: 2,
    category_name: 'Appliance Repair',
    image_url: 'https://placehold.co/400x300?text=AC+Repair',
    is_active: true,
  },
  {
    id: 3,
    name: 'Plumbing Service',
    description: 'Fix leaks, pipe blockages, and installations.',
    price: 349,
    duration: '1.5 hours',
    category_id: 3,
    category_name: 'Plumbing',
    image_url: 'https://placehold.co/400x300?text=Plumbing',
    is_active: true,
  },
];

export const MOCK_SERVICE_DETAIL: ServiceData = MOCK_SERVICE_LIST[0];


export const MOCK_DASHBOARD_STATS: DashboardStats = {
  total_customers: 1245,
  total_partners: 48,
  total_bookings: 3892,
  total_revenue: 584320,
  active_services: 27,
};


export const MOCK_BOOKING: BookingData = {
  id: 501,
  service_id: 1,
  service_name: 'Deep Home Cleaning',
  customer_id: 210,
  partner_id: 105,
  status: 'CONFIRMED',
  scheduled_at: '2026-06-01T10:00:00.000Z',
  address: '789 Customer Lane, Mumbai',
  price: 999,
  created_at: '2026-05-19T10:00:00.000Z',
};


/** Factory: successful login response */
export const SUCCESS_LOGIN_RESPONSE = (user: AuthUser) => ({
  success: true,
  message: 'Login successful',
  data: {
    id: user.id,
    role: user.role,
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEwOSwiZW1haWwiOiJob21lY2FyZS1hZG1pbkB5b3BtYWlsLmNvbSIsInJvbGUiOiJTVVBFUl9BRE1JTiIsImlhdCI6MTc3OTE3OTExMSwiZXhwIjoxNzc5MjY1NTExfQ.OtugE8rgozmZ80WdVKScftYO5289PvRKUdTUQL1t7AY',
    token_type: 'Bearer',
    expires_in: '24h',
    user,
  },
});

/** Factory: successful customer send OTP response */
export const CUSTOMER_SEND_OTP_SUCCESS = {
  success: true,
  message: 'OTP sent successfully',
};

/** Factory: successful customer verify OTP response */
export const CUSTOMER_VERIFY_OTP_SUCCESS = (user: AuthUser) => ({
  success: true,
  message: 'Login successful',
  data: {
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    token_type: 'Bearer',
    expires_in: '24h',
    user,
  },
});

/** Factory: failed login response */
export const FAILURE_LOGIN_RESPONSE = {
  success: false,
  message: 'Invalid email or password',
  error: 'Invalid email or password',
};

/** Factory: validation failed response (e.g. invalid email format) */
export const VALIDATION_FAILED_LOGIN_RESPONSE = {
  success: false,
  message: 'Validation failed.',
  error: 'Validation failed.',
  errors: {
    email: ['Invalid email format']
  }
};

/** Factory: account locked response */
export const ACCOUNT_LOCKED_RESPONSE = {
  success: false,
  message: 'Too many failed attempts. Account temporarily locked.',
  error: 'ACCOUNT_LOCKED',
};

/** Factory: profile fetch response */
export const MOCK_PROFILE_RESPONSE = (profile: ProfileData) => ({
  success: true,
  message: 'Profile fetched successfully',
  data: profile,
});

/** Factory: profile update success response */
export const MOCK_PROFILE_UPDATE_SUCCESS = {
  success: true,
  message: 'Profile updated successfully',
};

/** Factory: forgot password success */
export const MOCK_FORGOT_PASSWORD_SUCCESS = {
  success: true,
  message: 'Password reset link has been sent to your email address. The link will expire in 10 minutes.',
  data: {
        "email": "homecare-admin@yopmail.com"
    }
}
/** Factory: forgot password failure (email not found) */
export const MOCK_FORGOT_PASSWORD_NOT_FOUND = {
  success: false,
  message: 'Invalid email or password',
  error: 'Invalid email or password',
};

/** Factory: reset password success */
export const MOCK_RESET_PASSWORD_SUCCESS = {
  success: true,
  message: 'Password has been reset successfully.',
};

/** Factory: invalid/expired reset token */
export const MOCK_RESET_PASSWORD_INVALID_TOKEN = {
  success: false,
  message: 'Invalid or expired reset token.',
  error: 'INVALID_TOKEN',
};

/** Factory: services list response */
export const MOCK_SERVICES_RESPONSE = {
  success: true,
  message: 'Services fetched successfully',
  data: MOCK_SERVICE_LIST,
};

/** Factory: dashboard stats response */
export const MOCK_DASHBOARD_STATS_RESPONSE = {
  success: true,
  message: 'Dashboard stats fetched successfully',
  data: MOCK_DASHBOARD_STATS,
};

/** Mock admin dashboard overview response */
export const MOCK_ADMIN_DASHBOARD_OVERVIEW_RESPONSE = {
  success: true,
  message: 'Dashboard overview fetched successfully',
  data: {
    comparisonLabel: 'Then Last Week',
    kpis: [
      {
        key: 'bookings',
        title: 'Total Services Booked',
        value: '3.8k',
        change: '+10%',
        changePercent: 10,
        positive: true,
        iconKey: 'calendar',
      },
      {
        key: 'users',
        title: 'Active Users',
        value: '1.2k',
        change: '+5%',
        changePercent: 5,
        positive: true,
        iconKey: 'users',
      },
      {
        key: 'partners',
        title: 'Active Service Partners',
        value: '48',
        change: '+2%',
        changePercent: 2,
        positive: true,
        iconKey: 'wrench',
      },
      {
        key: 'revenue',
        title: 'Total Revenue',
        value: '₹584k',
        change: '+15%',
        changePercent: 15,
        positive: true,
        iconKey: 'dollar',
      },
    ],
    topPartners: [
      {
        name: 'Ravi Patel',
        role: 'Service Partner',
        completed: 12,
        avatar: 'https://avatar.iran.liara.run/public/partner',
      },
    ],
    topServices: {
      week: {
        totalBookings: 10,
        services: [
          { label: 'Deep Home Cleaning', value: 8, color: '#4EA8DE' },
          { label: 'AC Repair & Service', value: 2, color: '#F4A261' },
        ],
      },
      month: {
        totalBookings: 45,
        services: [
          { label: 'Deep Home Cleaning', value: 30, color: '#4EA8DE' },
          { label: 'AC Repair & Service', value: 15, color: '#F4A261' },
        ],
      },
      year: {
        totalBookings: 500,
        services: [
          { label: 'Deep Home Cleaning', value: 350, color: '#4EA8DE' },
          { label: 'AC Repair & Service', value: 150, color: '#F4A261' },
        ],
      },
    },
    revenue: {
      week: {
        bars: [
          { label: 'Mon', amount: 1200 },
          { label: 'Tue', amount: 1500 },
          { label: 'Wed', amount: 1800 },
          { label: 'Thu', amount: 1400 },
          { label: 'Fri', amount: 2000 },
          { label: 'Sat', amount: 2500 },
          { label: 'Sun', amount: 2200 },
        ],
        yTicks: [0, 500, 1000, 1500, 2000, 2500],
        yTickLabels: ['0', '₹500', '₹1k', '₹1.5k', '₹2k', '₹2.5k'],
      },
      month: {
        bars: [
          { label: 'Week 1', amount: 8000 },
          { label: 'Week 2', amount: 9500 },
          { label: 'Week 3', amount: 11000 },
          { label: 'Week 4', amount: 10500 },
        ],
        yTicks: [0, 3000, 6000, 9000, 12000, 15000],
        yTickLabels: ['0', '₹3k', '₹6k', '₹9k', '₹12k', '₹15k'],
      },
      year: {
        bars: [
          { label: 'Jan', amount: 35000 },
          { label: 'Feb', amount: 42000 },
          { label: 'Mar', amount: 48000 },
          { label: 'Apr', amount: 40000 },
          { label: 'May', amount: 55000 },
          { label: 'Jun', amount: 62000 },
          { label: 'Jul', amount: 58000 },
          { label: 'Aug', amount: 60000 },
          { label: 'Sep', amount: 52000 },
          { label: 'Oct', amount: 65000 },
          { label: 'Nov', amount: 70000 },
          { label: 'Dec', amount: 75000 },
        ],
        yTicks: [0, 20000, 40000, 60000, 80000, 100000],
        yTickLabels: ['0', '₹20k', '₹40k', '₹60k', '₹80k', '₹100k'],
      },
    },
    topCities: {
      week: {
        xLabels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        series: [
          { name: 'Ahmedabad', data: [1, 2, 1, 3, 2, 4, 3], color: '#F2A452' },
          { name: 'Surat', data: [0, 1, 2, 1, 3, 2, 2], color: '#8E7CFF' },
        ],
        yTicks: [0, 1, 2, 3, 4, 5],
      },
      month: {
        xLabels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        series: [
          { name: 'Ahmedabad', data: [10, 12, 14, 11], color: '#F2A452' },
          { name: 'Surat', data: [8, 9, 11, 10], color: '#8E7CFF' },
        ],
        yTicks: [0, 3, 6, 9, 12, 15],
      },
      year: {
        xLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        series: [
          { name: 'Ahmedabad', data: [45, 52, 58, 50, 60, 68, 62, 64, 56, 70, 75, 80], color: '#F2A452' },
          { name: 'Surat', data: [38, 42, 46, 40, 48, 54, 50, 52, 45, 55, 60, 65], color: '#8E7CFF' },
        ],
        yTicks: [0, 20, 40, 60, 80, 100],
      },
    },
  },
};

/** Mock partner dashboard analytics response */
export const MOCK_PARTNER_DASHBOARD_OVERVIEW_RESPONSE = {
  success: true,
  message: 'Dashboard fetched successfully',
  data: {
    comparisonLabel: 'Then Last Week',
    kpis: [
      {
        key: 'revenue',
        title: 'Total Revenue',
        value: '₹120k',
        change: '+8%',
        changePercent: 8,
        positive: true,
        iconKey: 'dollar',
      },
      {
        key: 'active_services',
        title: 'Active Services Offered',
        value: '5',
        change: '0%',
        changePercent: 0,
        positive: true,
        iconKey: 'wrench',
      },
      {
        key: 'completed_services',
        title: 'Completed Services',
        value: '84',
        change: '+12%',
        changePercent: 12,
        positive: true,
        iconKey: 'badge-check',
      },
      {
        key: 'future_bookings',
        title: 'Future Bookings',
        value: '6',
        change: '+20%',
        changePercent: 20,
        positive: true,
        iconKey: 'calendar',
      },
    ],
    topServices: {
      week: {
        totalBookings: 4,
        services: [
          { label: 'Deep Home Cleaning', value: 3, color: '#4EA8DE' },
          { label: 'AC Repair & Service', value: 1, color: '#F4A261' },
        ],
      },
      month: {
        totalBookings: 18,
        services: [
          { label: 'Deep Home Cleaning', value: 12, color: '#4EA8DE' },
          { label: 'AC Repair & Service', value: 6, color: '#F4A261' },
        ],
      },
      year: {
        totalBookings: 210,
        services: [
          { label: 'Deep Home Cleaning', value: 140, color: '#4EA8DE' },
          { label: 'AC Repair & Service', value: 70, color: '#F4A261' },
        ],
      },
    },
    topRevenueServices: {
      week: {
        totalBookings: 4,
        services: [
          { label: 'Deep Home Cleaning', value: 3000, bookings: 3, color: '#F2A452' },
          { label: 'AC Repair & Service', value: 500, bookings: 1, color: '#8E7CFF' },
        ],
      },
      month: {
        totalBookings: 18,
        services: [
          { label: 'Deep Home Cleaning', value: 12000, bookings: 12, color: '#F2A452' },
          { label: 'AC Repair & Service', value: 3000, bookings: 6, color: '#8E7CFF' },
        ],
      },
      year: {
        totalBookings: 210,
        services: [
          { label: 'Deep Home Cleaning', value: 140000, bookings: 140, color: '#F2A452' },
          { label: 'AC Repair & Service', value: 35000, bookings: 70, color: '#8E7CFF' },
        ],
      },
    },
    revenue: {
      week: {
        bars: [
          { label: 'Mon', amount: 500 },
          { label: 'Tue', amount: 0 },
          { label: 'Wed', amount: 1000 },
          { label: 'Thu', amount: 1500 },
          { label: 'Fri', amount: 500 },
          { label: 'Sat', amount: 2000 },
          { label: 'Sun', amount: 1500 },
        ],
        yTicks: [0, 500, 1000, 1500, 2000, 2500],
        yTickLabels: ['0', '₹500', '₹1k', '₹1.5k', '₹2k', '₹2.5k'],
      },
      month: {
        bars: [
          { label: 'Week 1', amount: 4000 },
          { label: 'Week 2', amount: 5500 },
          { label: 'Week 3', amount: 7000 },
          { label: 'Week 4', amount: 6500 },
        ],
        yTicks: [0, 2000, 4000, 6000, 8000, 10000],
        yTickLabels: ['0', '₹2k', '₹4k', '₹6k', '₹8k', '₹10k'],
      },
      year: {
        bars: [
          { label: 'Jan', amount: 15000 },
          { label: 'Feb', amount: 18000 },
          { label: 'Mar', amount: 22000 },
          { label: 'Apr', amount: 19000 },
          { label: 'May', amount: 25000 },
          { label: 'Jun', amount: 28000 },
          { label: 'Jul', amount: 26000 },
          { label: 'Aug', amount: 27000 },
          { label: 'Sep', amount: 24000 },
          { label: 'Oct', amount: 30000 },
          { label: 'Nov', amount: 32000 },
          { label: 'Dec', amount: 35000 },
        ],
        yTicks: [0, 10000, 20000, 30000, 40000, 50000],
        yTickLabels: ['0', '₹10k', '₹20k', '₹30k', '₹40k', '₹50k'],
      },
    },
  },
};

