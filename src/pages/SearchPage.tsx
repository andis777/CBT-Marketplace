import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getPsychologists } from '../lib/api';
import type { Psychologist } from '../types';
import PsychologistCard from '../components/PsychologistCard';
import SearchBar from '../components/SearchBar';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPsychologists = async () => {
      try {
        setLoading(true);
        const data = await getPsychologists({
          city: searchParams.get('city') || undefined,
          specialization: searchParams.get('query') || undefined
        });
        setPsychologists(data);
      } catch (err) {
        setError('Failed to load psychologists');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPsychologists();
  }, [searchParams]);

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
  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Поиск специалистов</h1>
        <SearchBar />

        <div className="mt-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {psychologists.length} {psychologists.length === 1 ? 'специалист' : 'специалистов'} найдено
            </h2>
          </div>

          <div className="space-y-6">
            {psychologists.map(psychologist => (
              <PsychologistCard key={psychologist.id} psychologist={psychologist} />
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

export default SearchPage;