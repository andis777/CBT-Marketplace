import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Globe, Users } from 'lucide-react';
import { getInstitution, getPsychologists } from '../lib/api';
import type { Institution, Psychologist } from '../types';
import PsychologistCard from '../components/PsychologistCard';
import InstitutionBookingModal from '../components/InstitutionBookingModal';

type TabType = 'info' | 'programs' | 'psychologists';

const InstitutionPage = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [institution, setInstitution] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);

  useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      if (id) {
        const data = await getInstitution(id);
        if (!data) {
          throw new Error('Institution not found');
        }
        setInstitution(data);
        
        // Fetch psychologists if needed
        if (activeTab === 'psychologists') {
          const psychData = await getPsychologists();
          setPsychologists(psychData.filter(p => p.institution_ids?.includes(id) || false));
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load institution data';
      setError(errorMessage);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
    fetchData();
  }, [id, activeTab]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!institution) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Учебное заведение не найдено</h2>
          <Link to="/" className="mt-4 text-primary-600 hover:text-primary-500">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(institution.address)}`;

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex items-start space-x-8">
            <img
              src={institution.avatar}
              alt={institution.name || 'Institution'}
              className="w-40 h-40 rounded-lg object-cover bg-gray-100"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://via.placeholder.com/200';
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">{institution.name || 'Учебное заведение'}</h1>

              <div className="mt-6 space-y-3">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-5 w-5 mr-2" />
                  <span>{institution.address}</span>
                  <a
                    href={googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 text-primary-600 hover:text-primary-500"
                  >
                    Проложить маршрут
                  </a>
                </div>

                <div className="flex items-center text-gray-600">
                  <Users className="h-5 w-5 mr-2" />
                  <span>{institution.psychologists_count} специалистов</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Phone className="h-5 w-5 mr-2" />
                  {institution.contacts?.phone && (
                    <a 
                      href={`tel:${institution.contacts.phone}`}
                      className="text-primary-600 hover:text-primary-500"
                    >
                      {institution.contacts.phone}
                    </a>
                  )}
                </div>

                <div className="flex items-center text-gray-600">
                  <Mail className="h-5 w-5 mr-2" />
                  {institution.contacts?.email && (
                    <a
                      href={`mailto:${institution.contacts.email}`}
                      className="text-primary-600 hover:text-primary-500"
                    >
                      {institution.contacts.email}
                    </a>
                  )}
                </div>

                {institution.contacts?.website && (
                  <div className="flex items-center text-gray-600">
                    <Globe className="h-5 w-5 mr-2" />
                    <a
                      href={`https://${institution.contacts.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-500"
                    >
                      {institution.contacts.website}
                    </a>
                  </div>
                )}
              </div>

              <div className="mt-6 flex space-x-4">
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Записаться на обучение
                </button>
                <a
                  href={`tel:${institution.contacts.phone}`}
                  className="px-6 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
                >
                  Позвонить
                </a>
                <a
                  href={`mailto:${institution.contacts.email}`}
                  className="px-6 py-2 border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
                >
                  Написать
                </a>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('info')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Об институте
              </button>
              <button
                onClick={() => setActiveTab('programs')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'programs'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Программы обучения
              </button>
              <button
                onClick={() => setActiveTab('psychologists')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'psychologists'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Специалисты
              </button>
            </nav>
          </div>

          {/* Tab Content */}
          <div className="mt-8">
            {activeTab === 'info' && (
              <div className="prose max-w-none">
                {institution.description.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="mb-4 text-gray-600">
                    {paragraph}
                  </p>
                ))}
              </div>
            )}

            {activeTab === 'programs' && (
              <div className="grid grid-cols-1 gap-6">
                {institution.services.map(program => (
                  <div
                    key={program.id}
                    className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold text-gray-900">{program.name}</h3>
                    <div className="mt-4 prose max-w-none">
                      {program.description.split('\n\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 text-gray-600">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                    <p className="mt-4 text-2xl font-bold text-primary-600">{program.price} ₽</p>
                    <div className="mt-4 flex space-x-4">
                      <button
                        onClick={() => setIsBookingModalOpen(true)}
                        className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                      >
                        Записаться на программу
                      </button>
                      <a
                        href={`tel:${institution.contacts.phone}`}
                        className="flex-1 px-4 py-2 text-center border border-primary-600 text-primary-600 rounded-md hover:bg-primary-50 transition-colors"
                      >
                        Позвонить для консультации
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'psychologists' && (
              <div className="space-y-6">
                {psychologists.map(psychologist => (
                  <PsychologistCard key={psychologist.id} psychologist={psychologist} />
                ))}
                {psychologists.length === 0 && (
                  <p className="text-center text-gray-500">
                    В данный момент нет доступных специалистов
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <InstitutionBookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        institutionName={institution.name || 'Учебное заведение'}
        services={institution.services}
      />
    </main>
  );
};

export default InstitutionPage;