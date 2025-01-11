import React, { useState, useEffect, useRef } from 'react';
import { MapPin } from 'lucide-react';
import { useCities } from '../hooks/useCities';

interface CitySelectorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CitySelector: React.FC<CitySelectorProps> = ({
  value,
  onChange,
  placeholder = "Введите город"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(value);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { cities, loading } = useCities();
  const [filteredCities, setFilteredCities] = useState<string[]>([]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    setSearchQuery(value);
  }, [value]);

  useEffect(() => {
    setFilteredCities(cities.filter(city =>
      city.toLowerCase().includes(searchQuery.toLowerCase())
    ));
  }, [cities, searchQuery]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchQuery(newValue);
    onChange(newValue);
    setIsOpen(true);
  };

  const handleCitySelect = (city: string) => {
    onChange(city);
    setSearchQuery(city);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={wrapperRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
      />
      <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
      
      {isOpen && !loading && filteredCities.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredCities.map((city, index) => (
            <li
              key={index}
              onClick={() => handleCitySelect(city)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {city}
            </li>
          ))}
        </ul>
      )}
      {isOpen && loading && (
        <div className="absolute z-10 w-full mt-1 bg-white border rounded-lg shadow-lg p-4 text-center text-gray-500">
          Загрузка городов...
        </div>
      )}
    </div>
  );
};

export default CitySelector;