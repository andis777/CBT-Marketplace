import React, { useState, useEffect } from 'react';
import { Users, Building, FileText, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getUsers, getInstitutions, getArticles } from '../../lib/api';
import type { User, Institution, Article } from '../../types';

const DashboardPage = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [usersData, institutionsData, articlesData] = await Promise.all([
          getUsers(),
          getInstitutions(),
          getArticles()
        ]);
        setUsers(usersData);
        setInstitutions(institutionsData);
        setArticles(articlesData);
      } catch (err) {
        setError('Failed to load dashboard data');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: 'Всего пользователей',
      value: users.length,
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      title: 'Учебных заведений',
      value: institutions.length,
      change: '+5%',
      icon: Building,
      color: 'bg-green-500',
    },
    {
      title: 'Статей',
      value: articles.length,
      change: '+8%',
      icon: FileText,
      color: 'bg-purple-500',
    },
    {
      title: 'Просмотров за месяц',
      value: '12,456',
      change: '+25%',
      icon: TrendingUp,
      color: 'bg-orange-500',
    },
  ];

  const recentActivities = [
    {
      type: 'user',
      action: 'registered',
      name: 'Анна Петрова',
      time: '2 часа назад',
    },
    {
      type: 'article',
      action: 'published',
      name: 'Как справиться с тревогой',
      time: '4 часа назад',
    },
    {
      type: 'institution',
      action: 'updated',
      name: 'Московский Институт Психоанализа',
      time: '6 часов назад',
    },
  ];

  const quickActions = [
    {
      title: 'Добавить пользователя',
      path: '/admin/users',
      icon: Users,
      color: 'text-blue-500',
    },
    {
      title: 'Добавить учреждение',
      path: '/admin/institutions',
      icon: Building,
      color: 'text-green-500',
    },
    {
      title: 'Создать статью',
      path: '/admin/articles',
      icon: FileText,
      color: 'text-purple-500',
    },
    {
      title: 'Настройки сайта',
      path: '/admin/settings',
      icon: TrendingUp,
      color: 'text-orange-500',
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Панель управления</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => (
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
            <div className="mt-4 flex items-center">
              <span className="text-green-500 text-sm font-medium">{stat.change}</span>
              <span className="text-gray-500 text-sm ml-2">vs прошлый месяц</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Последние действия</h2>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center">
                  <div className="flex-shrink-0">
                    {activity.type === 'user' && <Users className="h-5 w-5 text-blue-500" />}
                    {activity.type === 'article' && <FileText className="h-5 w-5 text-purple-500" />}
                    {activity.type === 'institution' && <Building className="h-5 w-5 text-green-500" />}
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {activity.action} • {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Быстрые действия</h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, index) => (
                <button
                  key={index}
                  onClick={() => navigate(action.path)}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <action.icon className={`h-6 w-6 ${action.color} mx-auto mb-2`} />
                  <span className="text-sm font-medium text-gray-900">{action.title}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;