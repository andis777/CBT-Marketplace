import { apiClient } from '../apiClient';
import type { User } from '../../types';

export interface LoginResponse {
  token: string;
  user: User;
  psychologist?: {
    is_top?: boolean;
    top_until?: string;
    promotion_tier?: number;
  };
  institution?: {
    is_top?: boolean;
    top_until?: string;
    promotion_tier?: number;
  };
}

export interface RegisterData {
  email: string;
  password: string;
  phone: string;
  name: string;
  role: 'psychologist' | 'institute' | 'client';
}

export const login = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email: email.trim(),
      password: password.trim()
    });
    
    if (!response) {
      throw new Error('Login failed');
    }

    // Add profile data to user object if available
    if (response.user.role === 'psychologist' && response.psychologist) {
      response.user.profile = {
        is_top: response.psychologist.is_top,
        top_until: response.psychologist.top_until,
        promotion_tier: response.psychologist.promotion_tier
      };
    } else if (response.user.role === 'institute' && response.institution) {
      response.user.profile = {
        is_top: response.institution.is_top,
        top_until: response.institution.top_until,
        promotion_tier: response.institution.promotion_tier
      };
    }

    // Log successful login
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        response: {
          success: true,
          email: email,
          role: response.user?.role
        }
      }
    }));

    // Store auth token
    if (response.token) {
      localStorage.setItem('token', response.token);
    }
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        error: {
          message: error instanceof Error ? error.message : 'Login failed',
          email: email
        }
      }
    }));
    throw error;
  }
};

export const register = async (data: RegisterData): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    if (!response) {
      throw new Error('Registration failed');
    }

    // Store auth token
    if (response.token) {
      localStorage.setItem('token', response.token);
    }

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } catch (error) {
    console.error('Logout error:', error);
    throw error;
  }
};