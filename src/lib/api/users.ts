import { apiClient } from '../apiClient';
import type { User } from '../../types';

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

export const updateUser = async (id: string, data: Partial<User>): Promise<User | null> => {
  try {
    const response = await apiClient.put<{ data: User }>(`/users/${id}`, data);
    return response?.data || null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};