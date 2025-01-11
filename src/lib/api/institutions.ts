import { apiClient } from '../apiClient';
import type { Institution } from '../../types';
import { safeClone } from '../../utils/cloneHelper';

interface GetInstitutionsParams {
  city?: string;
  country?: string;
  is_verified?: boolean;
}

export const getInstitutions = async (params?: GetInstitutionsParams): Promise<Institution[]> => {
  try {
    const response = await apiClient.get<{ data: Institution[] }>('/institutions', { params });
    if (response && 'data' in response) {
      const institutions = Array.isArray(response.data) ? response.data : [];
      
      // Sort by promotion status and expiration
      return institutions.sort((a, b) => {
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
        
        // Finally sort by psychologists count
        return b.psychologists_count - a.psychologists_count;
      });
    }
    return [];
  } catch (error) {
    console.error('Error fetching institutions:', error);
    return [];
  }
};

export const getInstitutionByUserId = async (userId: string): Promise<Institution | null> => {
  try {
    const response = await apiClient.get<{ data: Institution }>(`/institutions/user/${userId}`);
    
    // Log the attempt
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        request: {
          type: 'GET_INSTITUTION_BY_USER_ID',
          userId
        },
        response: safeClone(response)
      }
    }));
    
    return response?.data || null;
  } catch (error) {
    console.error('Error fetching institution by user ID:', error);
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        error: {
          type: 'GET_INSTITUTION_BY_USER_ID_ERROR',
          message: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }));
    return null;
  }
};
export const getInstitution = async (id: string): Promise<Institution | null> => {
  try {
    const response = await apiClient.get<{ data: Institution }>(`/institutions/${id}`);
    if (response && 'data' in response) {
      return response.data;
    }
    return null;
  } catch (error) {
    console.error('Error fetching institution:', error);
    return null;
  }
};