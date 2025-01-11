import { apiClient } from '../apiClient';

export const getAppointmentsCount = async (): Promise<number> => {
  try {
    const response = await apiClient.get<{data: {count: number}}>('/appointments/count');
    return response?.data?.count || 0;
  } catch (error) {
    console.error('Error fetching appointments count:', error);
    return 0;
  }
};