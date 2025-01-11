import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users } from 'lucide-react';
import { Institution } from '../types';
import InstitutionBookingModal from './InstitutionBookingModal';
import VerificationBadge from './VerificationBadge';

interface InstitutionCardProps {
  institution: Institution;
  isFeatured?: boolean;
}

const InstitutionCard: React.FC<InstitutionCardProps> = ({ institution, isFeatured = false }) => {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <img
              src={institution.avatar}
              alt={institution.name}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
            />
            <div className="flex-1 text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Link 
                  to={`/institution/${institution.id}`}
                  className="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors"
                >
                  {institution.name}
                </Link>
                <div className="flex items-center gap-2">
                  {institution.is_verified && (
                    <VerificationBadge tooltipText="Аккредитованное учебное заведение" />
                  )}
                  {isFeatured && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Топ учебное заведение
                    </span>
                  )}
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                <MapPin className="h-4 w-4 mr-1" />
                <span>{institution.address}</span>
              </div>

              <div className="mt-2 flex items-center justify-center sm:justify-start text-sm text-gray-500">
                <Users className="h-4 w-4 mr-1" />
                <span>{institution.psychologists_count} специалистов</span>
              </div>

              <p className="mt-2 text-sm text-gray-600 line-clamp-2 text-center sm:text-left">
                {institution.description.split('\n')[0]}
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {institution.services.map(service => (
                <div
                  key={service.id}
                  className="p-4 border rounded-lg"
                >
                  <h3 className="font-medium text-gray-900 text-center sm:text-left">{service.name}</h3>
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2 text-center sm:text-left">
                    {service.description.split('\n')[0]}
                  </p>
                  <p className="mt-2 text-lg font-bold text-primary-600 text-center sm:text-left">{service.price} ₽</p>
                  <button
                    onClick={() => setIsBookingModalOpen(true)}
                    className="mt-2 w-full px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                  >
                    Записаться
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <InstitutionBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        institutionName={institution.name || 'Учебное заведение'}
        services={institution.services}
      />
    </>
  );
}

export default InstitutionCard;