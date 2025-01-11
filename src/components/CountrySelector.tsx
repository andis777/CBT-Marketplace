import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';

interface CountrySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const otherCountries = [
  'Беларусь',
  'Казахстан',
  'Украина',
  'Армения',
  'Азербайджан',
  'Грузия',
  'Молдова',
  'Узбекистан',
  'Кыргызстан',
  'Таджикистан',
  'Туркменистан',
  'Латвия',
  'Литва',
  'Эстония',
].sort();

const CountrySelector: React.FC<CountrySelectorProps> = ({
  value,
  onChange,
  placeholder = 'Выберите страну',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const showRussia = 'Россия'.toLowerCase().includes(searchQuery.toLowerCase());
  const filteredCountries = otherCountries.filter(country =>
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <div
        className="w-full flex items-center justify-between px-3 py-2 border rounded-lg cursor-pointer focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-gray-900' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        {isOpen ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg">
          <div className="p-2">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск страны..."
                className="w-full pl-8 pr-4 py-2 border rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>

          <div className="max-h-60 overflow-y-auto">
            {showRussia && (
              <>
                <div
                  className={`px-4 py-2 cursor-pointer hover:bg-primary-50 font-bold border-b ${
                    value === 'Россия' ? 'bg-primary-50 text-primary-600' : 'text-gray-900'
                  }`}
                  onClick={() => {
                    onChange('Россия');
                    setIsOpen(false);
                    setSearchQuery('');
                  }}
                >
                  Россия
                </div>
              </>
            )}
            
            {filteredCountries.map((country) => (
              <div
                key={country}
                className={`px-4 py-2 cursor-pointer hover:bg-primary-50 ${
                  value === country ? 'bg-primary-50 text-primary-600' : 'text-gray-900'
                }`}
                onClick={() => {
                  onChange(country);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
              >
                {country}
              </div>
            ))}
            {filteredCountries.length === 0 && !showRussia && (
              <div className="px-4 py-2 text-gray-500">Страна не найдена</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;