import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Sliders } from 'lucide-react';
import { getPsychologists } from '../lib/api';
import CitySelector from '../components/CitySelector';
import type { Psychologist } from '../types';
import PsychologistCard from '../components/PsychologistCard';
import SearchBar from '../components/SearchBar';
import FeaturedCard from '../components/FeaturedCard';

const PsychologistsListPage = () => {
  const [urlParams] = useSearchParams();
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [nameSearch, setNameSearch] = useState('');
  const [citySearch, setCitySearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minRating, setMinRating] = useState<number | ''>('');
  const [minReviews, setMinReviews] = useState<number | ''>('');
  const [minExperience, setMinExperience] = useState<number | ''>('');
  const [maxPrice, setMaxPrice] = useState<number | ''>('');
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort psychologists by promotion status
  const now = new Date();
  const validTopPsychologists = psychologists.filter(p => 
    p.is_top && new Date(p.top_until || '') > now
  );

  // Get psychologists by tier
  const tier1Psychologists = validTopPsychologists.filter(p => p.promotion_tier === 1);
  const tier2Psychologists = validTopPsychologists.filter(p => p.promotion_tier === 2);
  const regularPsychologists = psychologists.filter(p => 
    !p.is_top || new Date(p.top_until || '') <= now
  );

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const searchParams = {
          name: nameSearch || undefined,
          minRating: minRating || undefined,
          city: citySearch || urlParams.get('city'),
          country: urlParams.get('country'),
          service: urlParams.get('service')
        } as const;

        const data = await getPsychologists(searchParams);

        console.log('Fetched psychologists:', data);

        // Apply client-side filters
        const filtered = data.filter(p => {
          const matchesReviews = !minReviews || p.reviews_count >= minReviews;
          const matchesExperience = !minExperience || p.experience >= minExperience;
          const minServicePrice = Math.min(...p.services.map(s => s.price));
          const matchesPrice = !maxPrice || minServicePrice <= maxPrice;
          
          return matchesReviews && matchesExperience && matchesPrice;
        });

        setPsychologists(filtered);
      } catch (err) {
        setError('Не удалось загрузить список специалистов. Пожалуйста, попробуйте позже.');
        console.error('Error fetching psychologists:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, [urlParams, nameSearch, citySearch, minRating, minReviews, minExperience, maxPrice]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-4 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Banner for Tier 2 Psychologists */}
        {tier2Psychologists.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Рекомендуемые специалисты</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {tier2Psychologists.map(psychologist => (
                <FeaturedCard
                  key={psychologist.id}
                  title={psychologist.name || 'Специалист'}
                  subtitle={`Опыт: ${psychologist.experience} лет`}
                  image={psychologist.gallery[0] || psychologist.avatar}
                  rating={psychologist.rating}
                  reviewsCount={psychologist.reviews_count}
                  link={`/psychologist/${psychologist.id}`}
                  description={psychologist.description || 'Нет описания'}
                />
              ))}
            </div>
          </div>
        )}

        <h1 className="text-3xl font-bold text-gray-900">Каталог психологов</h1>
        
        {/* Search and Filters */}
        <div className="mt-8">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center px-4 py-2 bg-white border rounded-lg shadow-sm hover:bg-gray-50"
          >
            <Sliders className="h-5 w-5 mr-2" />
            <span>Фильтры</span>
          </button>
          
          <div className="mt-4 mb-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                value={nameSearch}
                onChange={(e) => setNameSearch(e.target.value)}
                placeholder="Поиск по имени специалиста..."
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <CitySelector
                value={citySearch}
                onChange={setCitySearch}
                placeholder="Поиск по городу"
              />
            </div>
          </div>

          {showFilters && (
            <div className="bg-white rounded-lg shadow-sm border p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Минимальный рейтинг
                </label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Например: 4.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Минимум отзывов
                </label>
                <input
                  type="number"
                  min="0"
                  value={minReviews}
                  onChange={(e) => setMinReviews(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Например: 10"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Минимальный опыт (лет)
                </label>
                <input
                  type="number"
                  min="0"
                  value={minExperience}
                  onChange={(e) => setMinExperience(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Например: 5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Максимальная цена (₽)
                </label>
                <input
                  type="number"
                  min="0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
                  className="w-full px-3 py-2 border rounded-md"
                  placeholder="Например: 5000"
                />
              </div>
            </div>
          )}
        </div>

        {/* Results */}
        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {psychologists.length} {
                psychologists.length === 1 ? 'специалист' : 'специалистов'
              } найдено
            </h2>
          </div>

          <div className="space-y-6">
            {/* Display Tier 2 Psychologists first with special styling */}
            {tier2Psychologists.map(psychologist => (
              <div key={psychologist.id} className="bg-primary-50 rounded-lg p-4">
                <div className="mb-2 text-sm font-medium text-primary-600">
                  Премиум специалист
                </div>
                <div className="bg-white rounded-lg">
                  <PsychologistCard 
                    psychologist={psychologist}
                    isFeatured={true}
                  />
                </div>
              </div>
            ))}

            {/* Display Tier 1 Psychologists first */}
            {tier1Psychologists.map(psychologist => (
              <PsychologistCard 
                key={psychologist.id} 
                psychologist={psychologist}
                isFeatured={true}
              />
            ))}
            
            {/* Then display regular psychologists */}
            {regularPsychologists.map(psychologist => (
              <PsychologistCard 
                key={psychologist.id} 
                psychologist={psychologist}
              />
            ))}
            {psychologists.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">По вашему запросу ничего не найдено</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default PsychologistsListPage;