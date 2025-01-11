import { apiClient } from '../apiClient';
import type { Psychologist } from '../../types';

import { safeClone } from '../../utils/cloneHelper';

interface GetPsychologistsParams {
  specialization?: string;
  city?: string | null;
  name?: string;
  country?: string | null;
  service?: string | null;
  minRating?: number;
}

export const getPsychologists = async (params?: GetPsychologistsParams): Promise<Psychologist[]> => {
  try {
    const response = await apiClient.get<{ data: Psychologist[] }>('/psychologists', { params });
    const psychologists = response?.data || [];
    
    // Sort by promotion status and expiration
    return psychologists.sort((a, b) => {
      const aIsTop = a.is_top && new Date(a.top_until || '') > new Date();
      const bIsTop = b.is_top && new Date(b.top_until || '') > new Date();
      
      // First sort by top status
      if (aIsTop && !bIsTop) return -1;
      if (!aIsTop && bIsTop) return 1;
      
      // Then sort by promotion tier if both are top
      if (aIsTop && bIsTop) {
        const aTier = a.promotion_tier || 0;
        const bTier = b.promotion_tier || 0;
        if (aTier !== bTier) return bTier - aTier;
      }
      
      // Finally sort by rating
      return b.rating - a.rating;
    });
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

export const updatePsychologistInstitutions = async (psychologistId: string, institutionIds: string[]): Promise<void> => {
  try {
    await apiClient.put(`/psychologists/${psychologistId}/institution`, {
      institution_ids: institutionIds
    });
  } catch (error) {
    console.error('Error updating psychologist institution:', error);
    throw error;
  }
};

export const getPsychologistByUserId = async (userId: string): Promise<Psychologist | null> => {
  try {
    const response = await apiClient.get<{ data: Psychologist }>(`/psychologists/user/${userId}`);
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching psychologist by user ID:', error);
    return null;
  }
};

export const updatePsychologist = async (id: string, data: Partial<Psychologist>): Promise<Psychologist> => {
  try {
    // Log the update attempt
    const safeData = safeClone(data);
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        request: safeClone({
          type: 'UPDATE_PSYCHOLOGIST',
          id,
          data: safeData
        })
      }
    }));

    const response = await apiClient.put<Psychologist>(`/psychologists/${id}`, data);
    
    // Log successful update
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        response: {
          type: 'UPDATE_PSYCHOLOGIST_SUCCESS',
          data: response
        }
      }
    }));

    return response || null;
  } catch (error) {
    // Log error
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        error: {
          type: 'UPDATE_PSYCHOLOGIST_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }));
    console.error('Error updating psychologist:', error);
    throw error;
  }
};