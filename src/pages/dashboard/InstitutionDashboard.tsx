import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, GraduationCap, TrendingUp, FileText, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getInstitutionByUserId } from '../../lib/api/institutions';
import type { Institution } from '../../types';
import ArticlesTab from '../../components/dashboard/ArticlesTab';
import PromotionTab from '../../components/dashboard/PromotionTab';

type TabType = 'overview' | 'articles' | 'promotion' | 'profile';

const InstitutionDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [profile, setProfile] = useState<Institution | null>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    students: 0,
    programs: 0,
    psychologists: 0,
    views: 0
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id) return;
        
        // Fetch institution profile
        const institutionData = await getInstitutionByUserId(user.id);
        if (institutionData) {
          setProfile(institutionData);
          
          // Update stats based on institution data
          setStats({
            students: 45, // TODO: Replace with actual data
            programs: institutionData.services?.length || 0,
            psychologists: institutionData.psychologists_count || 0,
            views: 1234 // TODO: Replace with actual data
          });
        }
      } catch (error) {
        console.error('Error fetching institution data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const statCards = [
    { title: 'Студенты', value: stats.students, icon: Users, color: 'bg-blue-500' },
    { title: 'Программы', value: stats.programs, icon: GraduationCap, color: 'bg-green-500' },
    { title: 'Специалисты', value: stats.psychologists, icon: Users, color: 'bg-purple-500' },
    { title: 'Просмотры', value: stats.views, icon: TrendingUp, color: 'bg-orange-500' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header section */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-16 w-16 rounded-lg mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500">Учебное заведение • ID: {user?.id}</p>
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

      {/* Stats section */}
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

      {/* Tabs */}
      <div className="mt-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="h-5 w-5 inline-block mr-2" />
              Обзор
            </button>
            <button
              onClick={() => setActiveTab('articles')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'articles'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-5 w-5 inline-block mr-2" />
              Статьи
            </button>
            <button
              onClick={() => setActiveTab('promotion')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'promotion'
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <TrendingUp className="h-5 w-5 inline-block mr-2" />
              Продвижение
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Последние действия</h2>
                <div className="space-y-4">
                  {/* Activity list would go here */}
                </div>
              </div>
            </div>
          )}
          {activeTab === 'articles' && <ArticlesTab />}
          {activeTab === 'promotion' && <PromotionTab />}
        </div>
      </div>
    </div>
  );
};

export default InstitutionDashboard;