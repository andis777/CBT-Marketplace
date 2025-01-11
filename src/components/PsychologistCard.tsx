import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, MapPin, GraduationCap, Link as LinkIcon } from 'lucide-react';
import { Psychologist, SocialLinks } from '../types';
import BookingModal from './BookingModal';
import VerificationBadge from './VerificationBadge';

interface PsychologistCardProps {
  psychologist: Psychologist;
  isFeatured?: boolean;
}

const PsychologistCard: React.FC<PsychologistCardProps> = ({ 
  psychologist,
  isFeatured = false,
}) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const navigate = useNavigate();
  const minPrice = psychologist?.services?.length 
    ? Math.min(...psychologist.services.map(s => s?.price || 0))
    : 0;

  // Check if psychologist has tier 2 promotion
  const isTier2 = psychologist.is_top && 
    new Date(psychologist.top_until || '') > new Date() && 
    psychologist.promotion_tier === 2;

  // Parse social links if they're a string
  const socialLinks = typeof psychologist.social_links === 'string' 
    ? JSON.parse(psychologist.social_links)
    : psychologist.social_links;

  // Filter out null/empty values
  const activeSocialLinks: SocialLinks = Object.entries(socialLinks || {})
    .filter(([_, value]) => value)
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {} as SocialLinks);

  const hasSocialLinks = Object.keys(activeSocialLinks).length > 0;

  const handleSpecializationClick = (e: React.MouseEvent, specialization: string) => {
    e.preventDefault();
    navigate(`/psychologists?specialization=${encodeURIComponent(specialization)}`);
  };

  const handleReviewsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/psychologist/${psychologist.id}?tab=reviews`);
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start gap-4">
            <Link 
              to={`/psychologist/${psychologist.id}`}
              className="block w-20 h-20 sm:w-24 sm:h-24 mx-auto sm:mx-0 hover:opacity-90 transition-opacity"
            >
              <img
                src={psychologist.avatar}
                alt={psychologist.name}
                className="w-full h-full rounded-full object-cover"
              />
            </Link>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Link 
                  to={`/psychologist/${psychologist.id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {psychologist.name || 'Специалист'}
                </Link>
                {psychologist.is_verified && <VerificationBadge />}
                {isTier2 ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Премиум специалист
                  </span>
                ) : isFeatured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                    Топ специалист
                  </span>
                )}
              </div>
              
              <div className="mt-2 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>
                  {psychologist.location?.city || 'Город не указан'}
                  {psychologist.location?.country && `, ${psychologist.location.country}`}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                <GraduationCap className="h-4 w-4 mr-1" />
                <span>Опыт: {psychologist.experience} лет</span>
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {psychologist.description}
              </p>

              <div className="mt-2 flex items-center justify-center sm:justify-start">
                <button
                  onClick={handleReviewsClick}
                  className="flex items-center hover:text-primary-600 transition-colors"
                >
                  <Star className="h-4 w-4 text-yellow-400 mr-1" />
                  <span className="text-sm font-medium text-gray-900">{psychologist.rating}</span>
                  <span className="mx-1 text-gray-400">·</span>
                  <span className="text-sm text-gray-500">{psychologist.reviews_count} отзывов</span>
                </button>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="text-sm text-gray-500">От</div>
              <div className="text-xl font-bold text-primary-600">{minPrice} ₽</div>
              <div className="mt-4 flex flex-col gap-2">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Записаться
                </button>
                <Link
                  to={`/psychologist/${psychologist.id}`}
                  className="w-full px-4 py-2 text-center bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Подробнее
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {psychologist?.specializations?.map((spec, index) => (
                <button
                  key={index}
                  onClick={(e) => handleSpecializationClick(e, spec)}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors cursor-pointer"
                >
                  {spec}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        psychologistName={psychologist?.name || 'Специалист'}
        services={psychologist?.services || []}
      />
    </>
  );
};

export default PsychologistCard;