import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Star, TrendingUp, LogOut, FileText, MessageCircle, Home, Building, CreditCard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getPsychologistByUserId } from '../../lib/api/psychologists';
import type { Psychologist } from '../../types';
import ArticlesTab from '../../components/dashboard/ArticlesTab';
import PromotionTab from '../../components/dashboard/PromotionTab';
import AppointmentsTab from '../../components/dashboard/tabs/AppointmentsTab';
import ReviewsTab from '../../components/dashboard/tabs/ReviewsTab';
import ProfileTab from '../../components/dashboard/tabs/ProfileTab';
import PaymentsTab from '../../components/dashboard/tabs/PaymentsTab';
import ServicesTab from '../../components/dashboard/tabs/ServicesTab';

type TabType = 'appointments' | 'articles' | 'reviews' | 'profile' | 'promotion' | 'services' | 'payments';

const PsychologistDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>(() => {
    const params = new URLSearchParams(window.location.search);
    const tab = params.get('tab') as TabType;
    return tab && ['appointments', 'articles', 'reviews', 'profile', 'promotion'].includes(tab)
      ? tab
      : 'appointments';
  });
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<Psychologist | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!user?.id) return;
        const data = await getPsychologistByUserId(user.id);
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfile();
    }
  }, [user?.id]);

  const statCards = [
    { title: 'Записи', value: 0, icon: Calendar, color: 'bg-blue-500' }, // TODO: Add appointments count when available
    { title: 'Клиенты', value: 0, icon: Users, color: 'bg-green-500' }, // TODO: Add clients count when available  
    { title: 'Отзывы', value: profile?.reviews_count || 0, icon: MessageCircle, color: 'bg-purple-500' },
    { title: 'Рейтинг', value: profile?.rating || 0, icon: Star, color: 'bg-yellow-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600" />
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'appointments':
        return <AppointmentsTab />;
      case 'articles':
        return <ArticlesTab />;
      case 'services':
        return <ServicesTab />;
      case 'reviews':
        return <ReviewsTab />;
      case 'profile':
        return <ProfileTab />;
      case 'promotion':
        return <PromotionTab />;
      case 'payments':
        return <PaymentsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-16 w-16 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500">Психолог • ID: {user?.id}</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            На главную
          </button>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
          >
            <LogOut className="h-5 w-5 mr-2" />
            Выйти
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <stat.icon className="h-6 w-6 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'appointments', label: 'Записи', icon: Calendar },
              { id: 'articles', label: 'Статьи', icon: FileText },
              { id: 'services', label: 'Услуги', icon: Building },
              { id: 'reviews', label: 'Отзывы', icon: MessageCircle },
              { id: 'promotion', label: 'Продвижение', icon: TrendingUp },
              { id: 'payments', label: 'Платежи', icon: CreditCard },
              { id: 'profile', label: 'Профиль', icon: Building }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5 inline-block mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default PsychologistDashboard;