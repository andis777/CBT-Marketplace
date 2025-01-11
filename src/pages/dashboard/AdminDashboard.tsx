import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Users, Building, FileText, TrendingUp, Home, LogOut } from 'lucide-react';
import { getUsers, getInstitutions, getArticles } from '../../lib/api';
import type { User, Institution, Article } from '../../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({
    users: 0,
    institutions: 0,
    articles: 0,
    views: 0
  });
  const [loading, setLoading] = useState(true);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/login');
  }, [logout, navigate]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [users, institutions, articles] = await Promise.all([
          getUsers(),
          getInstitutions(),
          getArticles()
        ]);

        setStats({
          users: users.length,
          institutions: institutions.length,
          articles: articles.length,
          views: articles.reduce((sum, article) => sum + article.views, 0)
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { title: 'Пользователи', value: stats.users, icon: Users, color: 'bg-blue-500' },
    { title: 'Институты', value: stats.institutions, icon: Building, color: 'bg-green-500' },
    { title: 'Статьи', value: stats.articles, icon: FileText, color: 'bg-purple-500' },
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Панель администратора</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center px-4 py-2 text-primary-600 hover:bg-primary-50 rounded-md transition-colors"
          >
            <Home className="h-5 w-5 mr-2" />
            На главную
          </button>
          <button
            onClick={handleLogout}
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

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Последние действия</h2>
          <div className="space-y-4">
            {/* Activity list would go here */}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Статистика</h2>
          {/* Stats chart would go here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;