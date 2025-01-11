import React from 'react';
import { BadgeCheck } from 'lucide-react';

interface VerificationBadgeProps {
  className?: string;
  tooltipText?: string;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ 
  className = '',
  tooltipText = 'Верифицированный специалист'
}) => {
  return (
    <div className="relative group inline-flex">
      <BadgeCheck className={`h-5 w-5 text-primary-600 ${className}`} />
      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        {tooltipText}
        <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
      </div>
    </div>
  );
};

export default VerificationBadge;