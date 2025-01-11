import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';

interface CityAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  country?: string;
  placeholder?: string;
}

interface NominatimResult {
  display_name: string;
  lat: string;
  lon: string;
  address: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
  };
}

const CityAutocomplete: React.FC<CityAutocompleteProps> = ({
  value,
  onChange,
  country,
  placeholder = "Введите город"
}) => {
  const [suggestions, setSuggestions] = useState<NominatimResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const timeoutRef = useRef<number>();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchCities = async (query: string) => {
    if (!query) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    try {
      const countryCode = country ? getCountryCode(country) : '';
      const params = new URLSearchParams({
        format: 'json',
        q: query,
        limit: '5',
        addressdetails: '1',
        featuretype: 'city',
        'accept-language': 'ru'
      });

      if (countryCode) {
        params.append('countrycodes', countryCode);
      }

      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?${params.toString()}`,
        {
          headers: {
            'User-Agent': 'CBT Marketplace'
          }
        }
      );

      if (!response.ok) throw new Error('Network response was not ok');
      
      const data: NominatimResult[] = await response.json();
      setSuggestions(data.filter(item => 
        item.address.city || item.address.town || item.address.village
      ));
    } catch (error) {
      console.error('Error fetching cities:', error);
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
    setShowSuggestions(true);

    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = window.setTimeout(() => {
      searchCities(query);
    }, 300);
  };

  const handleSelect = (suggestion: NominatimResult) => {
    const cityName = suggestion.address.city || 
                    suggestion.address.town || 
                    suggestion.address.village || '';
    onChange(cityName);
    setShowSuggestions(false);
    setSuggestions([]);
  };

  const getCityDisplay = (suggestion: NominatimResult) => {
    const city = suggestion.address.city || 
                suggestion.address.town || 
                suggestion.address.village || '';
    const state = suggestion.address.state || '';
    const country = suggestion.address.country || '';
    
    return `${city}${state ? `, ${state}` : ''}${country ? `, ${country}` : ''}`;
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={value}
        onChange={handleInput}
        onFocus={() => value && setShowSuggestions(true)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      
      {showSuggestions && (suggestions.length > 0 || isLoading) && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          {isLoading ? (
            <li className="px-4 py-2 text-gray-500">Поиск...</li>
          ) : (
            suggestions.map((suggestion, index) => (
              <li
                key={`${suggestion.lat}-${suggestion.lon}-${index}`}
                onClick={() => handleSelect(suggestion)}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
              >
                {getCityDisplay(suggestion)}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
};

function getCountryCode(country: string): string {
  const countryMap: { [key: string]: string } = {
    'Россия': 'ru',
    'Беларусь': 'by',
    'Казахстан': 'kz',
    'Украина': 'ua',
    'Армения': 'am',
    'Азербайджан': 'az',
    'Грузия': 'ge',
    'Молдова': 'md',
    'Узбекистан': 'uz',
    'Кыргызстан': 'kg',
    'Таджикистан': 'tj',
    'Туркменистан': 'tm',
    'Латвия': 'lv',
    'Литва': 'lt',
    'Эстония': 'ee',
  };
  return countryMap[country] || '';
}

export default CityAutocomplete;