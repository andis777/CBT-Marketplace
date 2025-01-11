import { apiClient } from '../apiClient';

interface PaymentResponse {
  success: boolean;
  payment_url: string;
  payment_id: string;
  status: string;
}

interface PaymentResult {
  url: string;
  payment_id: string;
  status: string;
}

interface YooKassaRequest {
  amount: {
    value: string;
    currency: string;
  };
  description: string;
  confirmation: {
    type: string;
    return_url: string;
  };
  metadata?: {
    type?: string;
    entity_id?: string;
    user_id?: string;
    tier?: number;
  };
  capture: boolean;
}

const API_BASE_URL = 'https://kpt.arisweb.ru:8443';

export const createPayment = async (
  amount: number,
  description: string,
  metadata?: {
    type?: string;
    entity_id?: string;
    user_id?: string;
    tier?: number;
  }
): Promise<PaymentResult> => {
  try {
    // Validate amount
    const value = parseFloat(String(amount));
    if (isNaN(value) || value <= 0) {
      throw new Error('Invalid payment amount');
    }

    // Ensure tier is a valid number (1 or 2)
    const tier = metadata?.tier || 1;
    if (tier !== 1 && tier !== 2) {
      throw new Error('Invalid tier value. Must be 1 or 2.');
    }

    const paymentData: YooKassaRequest = {
      amount: {
        value: value.toFixed(2),
        currency: 'RUB'
      },
      confirmation: {
        type: 'redirect',
        return_url: `${API_BASE_URL}/api/payment/success?user_id=${metadata?.user_id}&type=${metadata?.type}&tier=${tier}`
      },
      description,
      metadata: {
        ...metadata,
        tier
      },
      capture: true
    };

    const response = await apiClient.post<PaymentResponse>('/payment', paymentData);
    
    if (!response.payment_url) {
      throw new Error('Missing payment URL in response');
    }

    return {
      url: response.payment_url,
      payment_id: response.payment_id,
      status: 'pending'
    };
  } catch (error) {
    console.error('Error creating payment:', error);
    throw error;
  }
};

export const checkPaymentStatus = async (paymentId: string): Promise<string> => {
  try {
    const response = await apiClient.get<PaymentResponse>(`/payment/${paymentId}`);
    return response.status || 'pending';
  } catch (error) {
    console.error('Error checking payment status:', error);
    throw error;
  }
};

export interface Payment {
  id: string;
  amount: number;
  status: string;
  description: string;
  created_at: string;
  metadata?: {
    type?: string;
    entity_id?: string;
    user_id?: string;
    tier?: number;
  };
}

export const getPaymentHistory = async (): Promise<Payment[]> => {
  try {
    const response = await apiClient.get<{ data: Payment[] }>('/payment/history');
    return (response.data || []).sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  } catch (error) {
    console.error('Error fetching payment history:', error);
    throw error;
  }
};