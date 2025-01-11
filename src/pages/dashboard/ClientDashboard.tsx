import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Star, Heart, Clock, LogOut, Home } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import type { Psychologist, Appointment } from '../../types';
import { getAppointmentsCount } from '../../lib/api';

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [appointmentsCount, setAppointmentsCount] = useState(0);
  const [savedPsychologists, setSavedPsychologists] = useState<Psychologist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Implement API calls
        const count = await getAppointmentsCount();
        setAppointmentsCount(count);
        setSavedPsychologists([]);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const stats = [
    { title: 'Записей', value: appointmentsCount, icon: Calendar, color: 'bg-blue-500' },
    { title: 'Избранных', value: savedPsychologists.length, icon: Heart, color: 'bg-red-500' },
    { title: 'Отзывов', value: '5', icon: Star, color: 'bg-yellow-500' },
    { title: 'Часов консультаций', value: '12', icon: Clock, color: 'bg-green-500' }
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
        <div className="flex items-center">
          <img
            src={user?.avatar}
            alt={user?.name}
            className="h-16 w-16 rounded-full mr-4"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user?.name}</h1>
            <p className="text-gray-500">Клиент • ID: {user?.id}</p>
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
          onClick={handleLogout}
          className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut className="h-5 w-5 mr-2" />
          Выйти
        </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
          </div>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Ближайшие записи</h2>
          {appointmentsCount === 0 ? (
            <p className="text-gray-500">Нет предстоящих записей</p>
          ) : (
            <div className="space-y-4">
              {/* Appointments list would go here */}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Избранные специалисты</h2>
          {savedPsychologists.length === 0 ? (
            <p className="text-gray-500">Нет избранных специалистов</p>
          ) : (
            <div className="space-y-4">
              {/* Saved psychologists list would go here */}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;