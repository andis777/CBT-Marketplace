import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import type { Institution } from '../types';
import CitySelector from '../components/CitySelector';
import InstitutionCard from '../components/InstitutionCard';
import FeaturedCard from '../components/FeaturedCard';
import { getInstitutions } from '../lib/api';

const InstitutionsListPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter institutions by promotion status
  const now = new Date();
  const validTopInstitutions = institutions.filter(i => 
    i.is_top && new Date(i.top_until || '') > now
  );

  const tier1Institutions = validTopInstitutions.filter(i => i.promotion_tier === 1);
  const tier2Institutions = validTopInstitutions.filter(i => i.promotion_tier === 2);
  const regularInstitutions = institutions.filter(i => 
    !i.is_top || new Date(i.top_until || '') <= now
  );

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const data = await getInstitutions({
          city: selectedCity || undefined
        });
        
        // Добавим логирование для отладки
        console.log('Fetched institutions:', data);
        
        if (Array.isArray(data)) {
          setInstitutions(data);
        } else {
          console.error('Invalid institutions data format:', data);
          setError('Ошибка загрузки данных');
        }
      } catch (err) {
        setError('Не удалось загрузить список учебных заведений');
        console.error('Error fetching institutions:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, [selectedCity]);

  const filteredInstitutions = institutions.filter(institution => {
    const matchesSearch = 
      (institution.name?.toLowerCase().includes(searchQuery.toLowerCase()) || '') ||
      institution.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(institution.services) && institution.services.some(service => 
        service.name.toLowerCase().includes(searchQuery.toLowerCase())
      ));
    const matchesCity = !selectedCity || 
      institution.address.toLowerCase().includes(selectedCity.toLowerCase());
    
    return matchesSearch && matchesCity;
  });

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
        <button 
          onClick={() => window.location.reload()}
          className="mt-4 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner for Tier 2 Institutions */}
        {tier2Institutions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Рекомендуемые учебные заведения</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tier2Institutions.map(institution => (
                <FeaturedCard
                  key={institution.id}
                  title={institution.name || 'Учебное заведение'}
                  subtitle={institution.address}
                  image={institution.avatar}
                  link={`/institution/${institution.id}`}
                  description={institution.description}
                />
              ))}
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900">Каталог учебных заведений</h1>
        <p className="mt-4 text-lg text-gray-600">
          Найдите подходящее учебное заведение для обучения КПТ
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Поиск по названию или программе..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <CitySelector
            value={selectedCity}
            onChange={setSelectedCity}
            placeholder="Все города"
          />
        </div>

        <div className="mt-8 space-y-6">
          {/* Display Tier 1 Institutions first */}
          {tier1Institutions.map(institution => (
            <InstitutionCard 
              key={institution.id} 
              institution={institution} 
              isFeatured={true}
            />
          ))}
          
          {/* Then display regular institutions */}
          {regularInstitutions.map(institution => (
            <InstitutionCard key={institution.id} institution={institution} />
          ))}
          {tier1Institutions.length + regularInstitutions.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500">По вашему запросу ничего не найдено</p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default InstitutionsListPage;