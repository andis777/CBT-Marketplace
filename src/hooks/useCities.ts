import { useState, useEffect } from 'react';
import { getPsychologists, getInstitutions } from '../lib/api';

export const useCities = () => {
  const [cities, setCities] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const [psychologists, institutions] = await Promise.all([
          getPsychologists(),
          getInstitutions()
        ]);

        // Extract unique cities from both psychologists and institutions
        const psychologistCities = psychologists
          .map(p => p.location?.city)
          .filter((city): city is string => Boolean(city));

        const institutionCities = institutions
          .map(i => {
            const address = i.address || '';
            const cityMatch = address.match(/г\.\s*([^,]+)/);
            return cityMatch ? cityMatch[1].trim() : null;
          })
          .filter((city): city is string => Boolean(city));

        // Combine and deduplicate cities
        const uniqueCities = Array.from(new Set([...psychologistCities, ...institutionCities]))
          .sort((a, b) => a.localeCompare(b, 'ru'));

        setCities(uniqueCities);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  return { cities, loading };
};