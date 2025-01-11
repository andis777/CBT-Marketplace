import { apiClient } from '../apiClient';
import type { Service } from '../../types';
import { getPsychologistByUserId } from './psychologists';
import { safeClone } from '../../utils/cloneHelper';

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
}

export interface ServiceTemplate {
  id: string;
  categoryId: string;
  name: string;
  description?: string;
  default_price: number;
  default_duration: number;
}

export const getServiceCategories = async (): Promise<ServiceCategory[]> => {
  try {
    const response = await apiClient.get<{ data: ServiceCategory[] }>('/services/categories');
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching service categories:', error);
    return [];
  }
};

export const getServiceTemplates = async (categoryId: string): Promise<ServiceTemplate[]> => {
  try {
    const response = await apiClient.get<{ data: ServiceTemplate[] }>('/services/templates', {
      params: { categoryId }
    });
    return response?.data || [];
  } catch (error) {
    console.error('Error fetching service templates:', error);
    return [];
  }
};

export const getServicesByProvider = async (userId: string, type: 'psychologist' | 'institution'): Promise<Service[]> => {
  try {
    // First get the provider profile to get the correct ID
    const profile = await getPsychologistByUserId(userId);
    if (!profile?.id) {
      throw new Error('Provider profile not found');
    }

    // Then get services using the profile ID
    const response = await apiClient.get<{ data: Service[] }>(
      `/services/provider/${profile.id}`,
      { params: { type } }
    );

    return response?.data || [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
};

export const createService = async (userId: string, service: Partial<Service>): Promise<Service> => {
  try {
    // Get provider profile first
    const profile = await getPsychologistByUserId(userId);
    if (!profile?.id) {
      throw new Error('Provider profile not found');
    }

    const response = await apiClient.post<Service>(`/services/${profile.id}`, service);
    return response;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;
  }
};

export const updateService = async (serviceId: string, service: Partial<Service>): Promise<Service> => {
  try {
    const response = await apiClient.put<Service>(`/services/${serviceId}`, service);
    return response;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;
  }
};

export const deleteService = async (serviceId: string): Promise<void> => {
  try {
    await apiClient.delete(`/services/${serviceId}`);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;
  }
};