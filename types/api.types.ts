/**
 * Generic API Response Types
 * Matches the backend's sendResponse() utility format.
 */

/** Standard single-item API response */
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
}

/** Paginated API response (for lists) */
export interface PaginatedResponse<T = unknown> {
  success: boolean;
  message: string;
  data: {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

/** Service data shape */
export interface ServiceData {
  id: number;
  name: string;
  description: string;
  price: number;
  duration: string;
  category_id: number;
  category_name: string;
  image_url: string;
  is_active: boolean;
}

/** Category data shape */
export interface CategoryData {
  id: number;
  name: string;
  description: string;
  icon_url: string;
  is_active: boolean;
}

/** Booking data shape */
export interface BookingData {
  id: number;
  service_id: number;
  service_name: string;
  customer_id: number;
  partner_id: number;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  scheduled_at: string;
  address: string;
  price: number;
  created_at: string;
}

/** Dashboard stats shape */
export interface DashboardStats {
  total_customers: number;
  total_partners: number;
  total_bookings: number;
  total_revenue: number;
  active_services: number;
}
