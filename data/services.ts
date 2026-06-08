/**
 * Mock Services Data
 * Used to stub API calls in service-related tests.
 */
import { ServiceData, CategoryData } from '../types/api.types';

export const MOCK_CATEGORIES: CategoryData[] = [
  {
    id: 1,
    name: 'Cleaning',
    description: 'All home and office cleaning services',
    icon_url: 'https://placehold.co/64x64?text=🧹',
    is_active: true,
  },
  {
    id: 2,
    name: 'Appliance Repair',
    description: 'AC, refrigerator, washing machine repairs',
    icon_url: 'https://placehold.co/64x64?text=🔧',
    is_active: true,
  },
  {
    id: 3,
    name: 'Plumbing',
    description: 'Pipe, tap, and drain services',
    icon_url: 'https://placehold.co/64x64?text=🚿',
    is_active: true,
  },
  {
    id: 4,
    name: 'Electrical',
    description: 'Wiring, switches, and general electrical work',
    icon_url: 'https://placehold.co/64x64?text=⚡',
    is_active: true,
  },
];

export const MOCK_SERVICES: ServiceData[] = [
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

export const MOCK_CATEGORIES_RESPONSE = {
  success: true,
  message: 'Categories fetched successfully',
  data: MOCK_CATEGORIES,
};

export const MOCK_SERVICES_RESPONSE = {
  success: true,
  message: 'Services fetched successfully',
  data: MOCK_SERVICES,
};
