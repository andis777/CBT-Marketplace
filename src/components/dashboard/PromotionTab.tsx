import React, { useState } from 'react';
import { Award, TrendingUp, Star } from 'lucide-react';
import PaymentModal from '../payments/PaymentModal';
import { promoteToTop } from '../../lib/api/promotions';
import PromotionStatus from './PromotionStatus';
import { useAuth } from '../../contexts/AuthContext';

interface Plan {
  title: string;
  description: string;
  price: number;
  duration: string;
  type: 'psychologist' | 'institution';
  features: string[];
  icon: React.FC<{ className?: string }>;
  tier: number;
}

interface SelectedPlan {
  amount: number;
  description: string;
  type: 'psychologist' | 'institution';
  tier: number;
}

const PromotionTab = () => {
  const [selectedPlan, setSelectedPlan] = useState<SelectedPlan | null>(null);
  const { user } = useAuth();
  const [error, setError] = useState('');

  const handlePaymentSuccess = async () => {
    if (!selectedPlan || !user?.id) return;
    
    try {
      const response = await promoteToTop(
        selectedPlan.type,
        user.id,
        user.id,
        selectedPlan.tier
      );
      console.log('Promotion successful:', response);
      setSelectedPlan(null);
    } catch (err) {
      console.error('Error promoting to top:', err);
      setError('Ошибка при создании заявки на продвижение');
    }
  };

  // Filter plans based on user role
  const plans: Plan[] = user?.role === 'psychologist' ? [
    {
      title: 'Топ специалист',
      description: 'Ваш профиль будет отображаться в топе каталога с отметкой "Топ специалист"',
      price: 2500,
      duration: '1 месяц',
      type: 'psychologist' as const,
      tier: 1,
      features: [
        'Приоритетное размещение в каталоге',
        'Специальная метка "Топ специалист"',
        'Расширенный профиль',
        'Статистика просмотров'
      ],
      icon: Star
    },
    {
      title: 'Продвижение',
      description: 'Премиум размещение в баннере на главной странице и в каталоге',
      price: 5000,
      duration: '1 месяц',
      type: 'psychologist' as const,
      tier: 2,
      features: [
        'Все преимущества тарифа "Топ специалист"',
        'Размещение на главной странице',
        'Продвижение в поиске',
        'Расширенная статистика'
      ],
      icon: TrendingUp
    },
  ] : [
    { // Plans for institutions
      title: 'Продвижение института',
      description: 'Премиум размещение в баннере на главной странице и в каталоге',
      price: 5000,
      duration: '1 месяц',
      type: 'institution' as const,
      tier: 2,
      features: [
        'Размещение на главной странице',
        'Приоритетное размещение в каталоге',
        'Расширенная статистика',
        'Индивидуальное продвижение'
      ],
      icon: Award
    }
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-gray-900">Продвижение профиля</h2>
      {user && (
        <PromotionStatus 
          isTop={user.profile?.is_top}
          topUntil={user.profile?.top_until}
          promotionTier={user.profile?.promotion_tier}
        />
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <div key={plan.title} className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center">
                <plan.icon className="h-12 w-12 text-primary-600" />
              </div>
              <h3 className="mt-4 text-xl font-bold text-center text-gray-900">{plan.title}</h3>
              <p className="mt-2 text-center text-gray-600">{plan.description}</p>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold text-gray-900">{plan.price}₽</span>
                <span className="text-gray-500">/{plan.duration}</span>
              </div>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-primary-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span className="ml-3 text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => setSelectedPlan({
                  amount: plan.price,
                  description: `Тариф "${plan.title}" на ${plan.duration}`,
                  type: plan.type,
                  tier: plan.tier
                })}
                className="mt-8 w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
              >
                Выбрать тариф
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedPlan && (
        <PaymentModal
          isOpen={!!selectedPlan}
          onClose={() => {
            setSelectedPlan(null);
            setError('');
          }}
          amount={selectedPlan.amount}
          description={selectedPlan.description}
          metadata={{
            type: selectedPlan.type || '',
            entity_id: user?.id || '',
            user_id: user?.id || '',
            tier: selectedPlan.tier
          }}
          onSuccess={handlePaymentSuccess}
          error={error}
        />
      )}
    </div>
  );
};

export default PromotionTab;