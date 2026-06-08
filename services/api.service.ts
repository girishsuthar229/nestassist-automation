import { AuthResponse } from '../types/auth.types';
import axiosInstance, { setAuthToken } from './axiosInstance';

export class ApiService {
  /**
   * Mirrored login service from homecare_frontend
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axiosInstance.post('/auth/login', {
      email,
      password,
    });
    
    // Auto-set the token for future calls if success
    if (response.data.success && response.data.data?.token) {
      setAuthToken(response.data.data.token);
    }
    
    return response.data;
  }

  async getProfile(): Promise<any> {
    const response = await axiosInstance.get('/user-profile/profile');
    return response.data;
  }

  async updateProfile(payload: any): Promise<any> {
    const response = await axiosInstance.post('/user-profile/profile/update', payload);
    return response.data;
  }

  setToken(token: string | null) {
    setAuthToken(token);
  }
}
