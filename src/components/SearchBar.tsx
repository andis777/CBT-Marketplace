import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search } from 'lucide-react';
import CountrySelector from './CountrySelector';
import CitySelector from './CitySelector';

interface SearchBarProps {
  isCompact?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({ isCompact = false }) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [query, setQuery] = useState(searchParams.get('query') || '');
  const [country, setCountry] = useState(searchParams.get('country') || '');
  const [city, setCity] = useState(searchParams.get('city') || '');
  const [searchType, setSearchType] = useState('name'); // 'name' or 'service'

  useEffect(() => {
    const specialization = searchParams.get('specialization');
    if (specialization) {
      setQuery(specialization);
      setSearchType('service');
    }
  }, [searchParams]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (query) {
      if (searchType === 'name') {
        params.append('name', query);
      } else {
        params.append('service', query);
      }
    }
    if (country) params.append('country', country);
    if (city) params.append('city', city);
    
    navigate(`/search?${params.toString()}`);
  };

  if (isCompact) {
    return (
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchType === 'name' ? "Поиск по имени специалиста" : "Поиск по услуге"}
            className="w-full pl-12 pr-20 py-3 border border-gray-300 rounded-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-base shadow-sm"
          />
          <Search className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
          <button
            type="submit"
            className="absolute right-3 top-2 px-4 py-1.5 bg-primary-500 text-white rounded-full hover:bg-primary-600 transition-colors"
          >
            <Search className="h-5 w-5" />
          </button>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSearch} className="w-full">
      <div className="border rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="flex mb-2">
              <button
                type="button"
                onClick={() => setSearchType('name')}
                className={`flex-1 py-1 px-2 text-sm rounded-l-md ${
                  searchType === 'name'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                По имени
              </button>
              <button
                type="button"
                onClick={() => setSearchType('service')}
                className={`flex-1 py-1 px-2 text-sm rounded-r-md ${
                  searchType === 'service'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                По услуге
              </button>
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchType === 'name' ? "Введите имя специалиста" : "Введите название услуги"}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          
          <CountrySelector
            value={country}
            onChange={setCountry}
            placeholder="Выберите страну"
          />
          
          <div>
            <CitySelector
              value={city}
              onChange={setCity}
              placeholder="Введите город"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
          >
            Найти
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchBar;