import React, { useState, useEffect } from 'react';
import { Calendar, CreditCard, CheckCircle, XCircle, Clock, RefreshCw } from 'lucide-react';
import { getPaymentHistory, type Payment } from '@/lib/api/payments';

const PaymentsTab = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchPayments = async () => {
    try {
      const data = await getPaymentHistory();
      setPayments(data);
      setError(null);
    } catch (err) {
      setError('Не удалось загрузить историю платежей');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchPayments();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'canceled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <CreditCard className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'succeeded':
        return 'Оплачен';
      case 'pending':
        return 'В обработке';
      case 'canceled':
        return 'Отменен';
      default:
        return 'Неизвестно';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">История платежей</h2>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
          {refreshing ? 'Обновление...' : 'Обновить'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {payments.length === 0 ? (
        <div className="text-center py-12">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500">У вас пока нет платежей</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {payments.map((payment) => (
              <li key={payment.id}>
                <div className="px-4 py-4 sm:px-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(payment.status)}
                      <p className="ml-2 text-sm font-medium text-gray-600">
                        {payment.description}
                      </p>
                    </div>
                    <div className="ml-2 flex-shrink-0 flex">
                      <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {payment.amount} ₽
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 sm:flex sm:justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        <Calendar className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                        {new Date(payment.created_at).toLocaleDateString('ru-RU')}
                      </p>
                    </div>
                    <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                      <p>
                        Статус: {getStatusText(payment.status)}
                      </p>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PaymentsTab;