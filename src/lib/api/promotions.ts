import { apiClient } from '../apiClient';

interface PromotionResponse {
  success: boolean;
  message: string;
  payment_url?: string;
}

export const promoteToTop = async (
  type: 'psychologist' | 'institution',
  id: string,
  userId: string,
  tier: number = 1
): Promise<PromotionResponse> => {
  try {
    const response = await apiClient.post<PromotionResponse>(`/promotions/${type}/${id}`, {
      metadata: {
        type,
        entity_id: id,
        user_id: userId,
        tier
      }
    });
    return response;
  } catch (error) {
    console.error('Error promoting to top:', error);
    throw error;
  }
};

export const refreshPromotionStatus = async (
  type: 'psychologist' | 'institution',
  id: string
): Promise<PromotionResponse> => {
  try {
    const response = await apiClient.get<PromotionResponse>(`/promotions/${type}/${id}/status`);
    return response;
  } catch (error) {
    console.error('Error refreshing promotion status:', error);
    throw error;
  }
};