import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Users, MessageCircle, BookOpen } from 'lucide-react';
import SearchBar from './SearchBar';

const Hero = () => {
  return (
    <div className="pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-brand-dark mb-2">
              Каталог специалистов и учебных заведений
            </h1>
            <p className="text-xl sm:text-2xl text-brand-navy">
              в области когнитивно&#8209;поведенческой терапии
            </p>
          </div>

          <div className="mt-8 max-w-3xl mx-auto">
            <SearchBar isCompact />
          </div>
          
          <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/psychologists" 
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-500 hover:bg-primary-600 md:text-lg w-full sm:w-auto"
            >
              Найти психолога
            </Link>
            <Link 
              to="/institutions" 
              className="px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-gray-50 md:text-lg w-full sm:w-auto"
            >
              Выбрать учебное заведение
            </Link>
          </div>
        </div>

        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <GraduationCap className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">ВУЗы с программами КПТ</h3>
            <p className="mt-2 text-sm text-gray-500">Аккредитованные учебные программы от ведущих институтов</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <Users className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Специалисты из разных городов</h3>
            <p className="mt-2 text-sm text-gray-500">Квалифицированные психологи со всей России</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <MessageCircle className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Прямая связь</h3>
            <p className="mt-2 text-sm text-gray-500">Запись к специалисту без посредников и комиссий</p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="flex justify-center">
              <BookOpen className="h-12 w-12 text-primary-500" />
            </div>
            <h3 className="mt-4 text-lg font-medium text-gray-900">Дополнительное образование</h3>
            <p className="mt-2 text-sm text-gray-500">Курсы повышения квалификации и сертификация</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Hero;