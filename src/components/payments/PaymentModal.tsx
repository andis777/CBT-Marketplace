import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createPayment } from '../../lib/api/payments';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  description: string;
  metadata?: {
    type?: string;
    entity_id?: string;
    user_id?: string;
    tier?: number;
  };
  onSuccess?: () => void;
  error?: string;
}

const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  description,
  metadata,
  onSuccess,
  error: externalError
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(externalError || '');

  const handlePayment = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Starting payment:', {
        amount,
        description,
        metadata
      });
      
      // Validate amount
      const value = parseFloat(String(amount));
      if (isNaN(value) || value <= 0) {
        throw new Error('Invalid payment amount');
      }

      const result = await createPayment(amount, description, metadata);
      
      if (!result.url) {
        throw new Error('Missing payment URL');
      }
      
      window.location.href = result.url;
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error('Payment creation error:', err);
      setError('Ошибка при создании платежа. Пожалуйста, попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Оплата</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mt-4">
            <p className="text-gray-600">{description}</p>
            <p className="mt-2 text-2xl font-bold text-gray-900">{amount} ₽</p>
          </div>

          {error && (
            <div className="mt-4 text-red-600 text-sm">{error}</div>
          )}

          <div className="mt-6">
            <button
              onClick={handlePayment}
              disabled={loading}
              className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Подготовка платежа...' : 'Оплатить'}
            </button>
          </div>

          <div className="mt-4 text-center text-sm text-gray-500">
            Оплата производится через сервис ЮKassa
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;