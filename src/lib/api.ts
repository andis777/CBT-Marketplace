import { apiClient } from './apiClient';
import type { User, Institution, Psychologist, Article } from '../types';

// Users
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await apiClient.get<{ data: User[] }>('/users');
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUser = async (id: string): Promise<User | null> => {
  try {
    const response = await apiClient.get<{ data: User }>(`/users/${id}`);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Auth types and functions
interface LoginResponse {
  token: string;
  user: User;
}

interface RegisterData {
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

    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        response: {
          success: true,
          email: email,
          role: response.user?.role
        }
      }
    }));
    
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
    return response;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Institutions
export const getInstitutions = async (params?: {
  city?: string;
  country?: string;
  is_verified?: boolean;
}): Promise<Institution[]> => {
  try {
    const response = await apiClient.get<{ data: Institution[] }>('/institutions', { params });
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return [];
  }
};

export const getInstitution = async (id: string): Promise<Institution | null> => {
  try {
    const response = await apiClient.get<{ data: Institution }>(`/institutions/${id}`);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching institution:', error);
    return null;
  }
};

// Psychologists
export const getPsychologists = async (params?: {
  specialization?: string;
  city?: string | null;
  name?: string;
  country?: string | null;
  service?: string | null;
  minRating?: number;
}): Promise<Psychologist[]> => {
  try {
    const response = await apiClient.get<{ data: Psychologist[] }>('/psychologists', { params });
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching psychologists:', error);
    return [];
  }
};

export const getPsychologist = async (id: string): Promise<Psychologist | null> => {
  try {
    const response = await apiClient.get<{ data: Psychologist }>(`/psychologists/${id}`);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching psychologist:', error);
    return null;
  }
};

// Articles
export const getArticles = async (params?: {
  tag?: string;
}): Promise<Article[]> => {
  try {
    const response = await apiClient.get<{ data: Article[] }>('/articles', { params });
    return (response?.data || []).map(article => ({
      ...article,
      tags: Array.isArray(article.tags) ? article.tags : 
            typeof article.tags === 'string' ? JSON.parse(article.tags) : []
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
};

export const getArticle = async (id: string): Promise<Article | null> => {
  try {
    const response = await apiClient.get<{ data: Article }>(`/articles/${id}`);
    if (response?.data) {
      return {
        ...response.data,
        tags: Array.isArray(response.data.tags) ? response.data.tags : 
              typeof response.data.tags === 'string' ? JSON.parse(response.data.tags) : []
      };
    }
    return null;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
};

// Appointments
export const getAppointmentsCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get<{data: {count: number}}>('/appointments/count');
    return response?.data?.count || 0;
  } catch (error) {
    console.error('Error fetching appointments count:', error);
    return 0;
  }
};