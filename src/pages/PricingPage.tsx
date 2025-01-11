import React from 'react';
import { CreditCard, Award, TrendingUp } from 'lucide-react';

const PricingPage = () => {
  return (
    <main>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 text-center">Тарифы</h1>
        <p className="mt-4 text-lg text-gray-600 text-center">
          Выберите подходящий тариф для продвижения ваших услуг
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center">
                <CreditCard className="h-12 w-12 text-[#3FABF3]" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-center">Баннерная реклама</h2>
              <p className="mt-2 text-center text-gray-600 px-4">
                Максимальное внимание к специалисту или институту
              </p>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold">10 000₽</span>
                <span className="text-gray-600">/мес</span>
              </div>
              <div className="mt-6 px-4">
                <button className="w-full px-4 py-2 bg-[#3FABF3] text-white rounded-md hover:bg-[#1E95E5] transition-colors">
                  Выбрать тариф
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center">
                <Award className="h-12 w-12 text-[#3FABF3]" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-center">Топ позиций для специалистов</h2>
              <p className="mt-2 text-center text-gray-600 px-4">
                Гарантированное внимание клиентов
              </p>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold">2 500₽</span>
                <span className="text-gray-600">/мес</span>
              </div>
              <div className="mt-6 px-4">
                <button className="w-full px-4 py-2 bg-[#3FABF3] text-white rounded-md hover:bg-[#1E95E5] transition-colors">
                  Выбрать тариф
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6">
              <div className="flex justify-center">
                <TrendingUp className="h-12 w-12 text-[#3FABF3]" />
              </div>
              <h2 className="mt-4 text-xl font-bold text-center">Топ позиций для институтов</h2>
              <p className="mt-2 text-center text-gray-600 px-4">
                Гарантированное внимание клиентов
              </p>
              <div className="mt-4 text-center">
                <span className="text-4xl font-bold">5 000₽</span>
                <span className="text-gray-600">/мес</span>
              </div>
              <div className="mt-6 px-4">
                <button className="w-full px-4 py-2 bg-[#3FABF3] text-white rounded-md hover:bg-[#1E95E5] transition-colors">
                  Выбрать тариф
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default PricingPage;