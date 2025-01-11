import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Star, MapPin, GraduationCap, Phone, MessageCircle, Instagram, Calendar, Globe, Award, Languages } from 'lucide-react';
import { getPsychologist } from '../lib/api';
import type { Psychologist, Article } from '../types';
import SocialMediaIcons from '../components/SocialMediaIcons';
import BookingModal from '../components/BookingModal';

type TabType = 'info' | 'articles' | 'reviews';

const PsychologistPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabType>('info');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedServiceId, setSelectedServiceId] = useState<string>('');
  const [psychologist, setPsychologist] = useState<Psychologist | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPsychologist = async () => {
      try {
        setLoading(true);
        const data = await getPsychologist(id!);
        setPsychologist(data);
      } catch (err) {
        setError('Failed to load psychologist data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPsychologist();
    }

    const tab = searchParams.get('tab') as TabType;
    if (tab && ['info', 'articles', 'reviews'].includes(tab)) {
      setActiveTab(tab);
    }
  }, [id, searchParams]);

  const handleSpecializationClick = (specialization: string) => {
    navigate(`/psychologists?specialization=${encodeURIComponent(specialization)}`);
  };

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
  if (!psychologist) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Специалист не найден</h2>
          <Link to="/" className="mt-4 text-primary-600 hover:text-primary-500">
            Вернуться на главную
          </Link>
        </div>
      </div>
    );
  }

  const handleBookService = (serviceId: string) => {
    setSelectedServiceId(serviceId);
    setIsBookingModalOpen(true);
  };

  // Get services from psychologist profile
  const services = psychologist?.services || [];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col md:flex-row md:items-start gap-8">
            <img
              src={psychologist.avatar}
              alt={psychologist.name}
              className="w-40 h-40 rounded-full object-cover mx-auto md:mx-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900">{psychologist.name}</h1>
              
              <div className="mt-4 flex items-center justify-center md:justify-start">
                <Star className="h-5 w-5 text-yellow-400" />
                <span className="ml-2 text-lg font-medium">{psychologist.rating}</span>
                <span className="mx-2 text-gray-400">·</span>
                <span className="text-gray-600">{psychologist.reviews_count} отзывов</span>
              </div>

              <div className="mt-4 flex items-center justify-center md:justify-start text-gray-600">
                <MapPin className="h-5 w-5 mr-2" />
                <span>
                  {psychologist.location?.city || 'Город не указан'}
                  {psychologist.location?.country && `, ${psychologist.location.country}`}
                </span>
              </div>

              <div className="mt-2 flex items-center justify-center md:justify-start text-gray-600">
                <Calendar className="h-5 w-5 mr-2" />
                <span>Опыт работы: {psychologist.experience} лет</span>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
                {/* Social Media Links */}
                <div className="flex justify-center md:justify-start">
                  <SocialMediaIcons socialLinks={psychologist.social_links} />
                </div>

                {psychologist.contacts?.phone && (
                  <a
                    href={`tel:${psychologist.contacts?.phone}`}
                    className="inline-flex items-center px-4 py-2 border border-primary-600 rounded-md text-primary-600 hover:bg-primary-600 hover:text-white transition-colors"
                  >
                    <Phone className="h-5 w-5 mr-2" />
                    Позвонить
                  </a>
                )}
                {psychologist.contacts?.telegram && (
                  <a
                    href={`https://t.me/${psychologist.contacts?.telegram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-blue-400 rounded-md text-blue-400 hover:bg-blue-400 hover:text-white transition-colors"
                  >
                    <MessageCircle className="h-5 w-5 mr-2" />
                    Telegram
                  </a>
                )}
                {psychologist.contacts?.instagram && (
                  <a
                    href={`https://instagram.com/${psychologist.contacts?.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-4 py-2 border border-pink-500 rounded-md text-pink-500 hover:bg-pink-500 hover:text-white transition-colors"
                  >
                    <Instagram className="h-5 w-5 mr-2" />
                    Instagram
                  </a>
                )}
                <button
                  onClick={() => setIsBookingModalOpen(true)}
                  className="inline-flex items-center px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                >
                  Записаться на прием
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              <button
                onClick={() => navigate(`/psychologist/${id}?tab=info`)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'info'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Информация
              </button>
              <button
                onClick={() => navigate(`/psychologist/${id}?tab=articles`)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'articles'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Статьи
              </button>
              <button
                onClick={() => navigate(`/psychologist/${id}?tab=reviews`)}
                className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'reviews'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Отзывы
              </button>
            </nav>
          </div>

          <div className="mt-8">
            {activeTab === 'info' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">О специалисте</h2>
                  <p className="text-gray-600">{psychologist.description}</p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Специализации</h2>
                  <div className="flex flex-wrap gap-2">
                    {psychologist?.specializations?.map((spec, index) => (
                      <button
                        key={index}
                        onClick={() => handleSpecializationClick(spec)}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors cursor-pointer"
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Languages className="h-6 w-6 mr-2" />
                    Языки
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {psychologist?.languages?.map((lang, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <GraduationCap className="h-6 w-6 mr-2" />
                    Образование
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {psychologist?.education?.map((edu, index) => (
                      <li key={index}>{edu}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                    <Award className="h-6 w-6 mr-2" />
                    Членство в организациях
                  </h2>
                  <ul className="list-disc list-inside space-y-2 text-gray-600">
                    {psychologist?.memberships?.map((membership, index) => (
                      <li key={index}>{membership}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Сертификаты</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {psychologist?.gallery?.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Сертификат ${index + 1}`}
                        className="rounded-lg object-cover w-full h-48"
                      />
                    ))}
                  </div>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Услуги и цены</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {services.map(service => (
                      <div
                        key={service.id}
                        className="p-4 border rounded-lg"
                      >
                        <h3 className="font-medium text-gray-900">{service.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{service.description}</p>
                        <div className="mt-4 flex items-center justify-between">
                          <p className="text-lg font-bold text-primary-600">{service.price} ₽</p>
                          <button
                            onClick={() => handleBookService(service.id)}
                            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                          >
                            Записаться
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'articles' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Статьи специалиста</h2>
                {psychologist.articles?.map((article: Article) => (
                  <article key={article.id} className="flex flex-col md:flex-row gap-6 border rounded-lg p-6 hover:shadow-md transition-shadow">
                    <Link to={`/article/${article.id}`} className="flex-shrink-0">
                      <img
                        src={article.image_url}
                        alt={article.title}
                        className="w-full md:w-48 h-32 object-cover rounded-lg"
                      />
                    </Link>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 hover:text-primary-600">
                        <Link to={`/article/${article.id}`}>{article.title}</Link>
                      </h3>
                      <p className="mt-2 text-gray-600">{article.preview}</p>
                      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-4">
                          <span>{new Date(article.created_at).toLocaleDateString('ru-RU')}</span>
                          <span>·</span>
                          <span>{article.views} просмотров</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {article.tags.slice(0, 2).map((tag, index) => (
                            <Link
                              key={index}
                              to={`/articles?tag=${encodeURIComponent(tag)}`}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors"
                            >
                              {tag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Отзывы</h2>
                <div className="space-y-4">
                  {[
                    {
                      id: '1',
                      authorName: 'Мария К.',
                      rating: 5,
                      comment: 'Замечательный специалист! Помогла мне справиться с тревожностью за несколько месяцев работы.',
                      date: '2024-03-10',
                      reply: 'Спасибо за ваш отзыв! Рада, что смогла помочь.',
                    },
                    {
                      id: '2',
                      authorName: 'Александр В.',
                      rating: 5,
                      comment: 'Профессиональный подход и внимательное отношение к клиенту. Рекомендую!',
                      date: '2024-03-05',
                      reply: 'Благодарю за отзыв! Желаю вам дальнейших успехов.',
                    },
                  ].map(review => (
                    <div key={review.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="font-medium text-gray-900">{review.authorName}</div>
                          <div className="ml-4 flex">
                            {[...Array(review.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 text-yellow-400" />
                            ))}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(review.date).toLocaleDateString('ru-RU')}
                        </div>
                      </div>
                      <p className="mt-4 text-gray-600">{review.comment}</p>
                      {review.reply && (
                        <div className="mt-4 pl-4 border-l-4 border-primary-200">
                          <div className="font-medium text-gray-900">Ответ специалиста:</div>
                          <p className="mt-1 text-gray-600">{review.reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => {
          setIsBookingModalOpen(false);
          setSelectedServiceId('');
        }}
        psychologistName={psychologist?.name || 'Специалист'}
        services={services}
        selectedServiceId={selectedServiceId}
      />
    </main>
  );
};

export default PsychologistPage;