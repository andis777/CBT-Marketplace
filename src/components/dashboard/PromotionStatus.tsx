import React from 'react';
import { Crown, Calendar } from 'lucide-react';

interface PromotionStatusProps {
  isTop?: boolean;
  topUntil?: string;
  promotionTier?: number;
}

const PromotionStatus: React.FC<PromotionStatusProps> = ({
  isTop,
  topUntil,
  promotionTier
}) => {
  if (!isTop || !topUntil) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center text-gray-500">
          <Crown className="h-5 w-5 mr-2" />
          <span>Нет активного продвижения</span>
        </div>
      </div>
    );
  }

  const expiryDate = new Date(topUntil);
  const now = new Date();
  const isExpired = expiryDate < now;

  if (isExpired) {
    return (
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="flex items-center text-gray-500">
          <Crown className="h-5 w-5 mr-2" />
          <span>Срок продвижения истек</span>
        </div>
      </div>
    );
  }

  const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <div className="bg-primary-50 rounded-lg p-4">
      <div className="flex items-center text-primary-700 font-medium mb-2">
        <Crown className="h-5 w-5 mr-2" />
        <span>
          {promotionTier === 2 ? 'Премиум размещение' : 'Топ специалист'}
        </span>
      </div>
      <div className="flex items-center text-primary-600 text-sm">
        <Calendar className="h-4 w-4 mr-2" />
        <span>
          {daysLeft} {daysLeft === 1 ? 'день' : daysLeft < 5 ? 'дня' : 'дней'} до окончания
        </span>
      </div>
    </div>
  );
};

export default PromotionStatus;