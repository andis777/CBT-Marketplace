import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import PsychologistCard from '../components/PsychologistCard';
import InstitutionCard from '../components/InstitutionCard';
import type { Psychologist, Institution } from '../types';
import { getInstitutions, getPsychologists } from '../lib/api';

const HomePage = () => {
  const [psychologists, setPsychologists] = useState<Psychologist[]>([]);
  const [psychLoading, setPsychLoading] = useState(true);
  const [psychError, setPsychError] = useState<string | null>(null);

  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter function for promoted items
  const getPromotedItems = <T extends { is_top?: boolean; top_until?: string; promotion_tier?: number }>(
    items: T[],
    tier: number
  ) => {
    const now = new Date();
    return items.filter(item => 
      item.is_top && 
      new Date(item.top_until || '') > now &&
      item.promotion_tier === tier
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setPsychLoading(true);

        // Fetch both psychologists and institutions
        const [psychData, instData] = await Promise.all([
          getPsychologists(),
          getInstitutions()
        ]);

        // Get only tier 2 (premium) items for homepage
        setPsychologists(getPromotedItems(psychData, 2));
        setInstitutions(getPromotedItems(instData, 2));
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        setPsychError(errorMessage);
      } finally {
        setLoading(false);
        setPsychLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || psychLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || psychError) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error || psychError}</p>
      </div>
    );
  }

  return (
    <main className="bg-white">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {psychologists.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Рекомендуемые специалисты</h2>
            <div className="space-y-6">
              {psychologists.map(psychologist => (
                <PsychologistCard 
                  key={psychologist.id} 
                  psychologist={psychologist}
                  isFeatured={true}
                />
              ))}
            </div>
          </section>
        )}

        {institutions.length > 0 && (
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Рекомендуемые учебные заведения</h2>
            <div className="space-y-6">
              {institutions.map(institution => (
                <InstitutionCard 
                  key={institution.id} 
                  institution={institution}
                  isFeatured={true}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
};

export default HomePage;