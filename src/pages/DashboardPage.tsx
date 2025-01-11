import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate } from 'react-router-dom';
import DebugPanel from '../components/dashboard/DebugPanel';
import AdminDashboard from './dashboard/AdminDashboard';
import PsychologistDashboard from './dashboard/PsychologistDashboard';
import InstitutionDashboard from './dashboard/InstitutionDashboard';
import ClientDashboard from './dashboard/ClientDashboard';
import { User, Settings, FileText, Users, Building, LogOut } from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
    window.dispatchEvent(new CustomEvent('api-log', {
      detail: {
        response: {
          success: true,
          message: 'User logged out'
        }
      }
    }));
  };

  // Redirect to role-specific dashboard
  if (user.role === 'admin') {
    return (
      <div className="relative">
        <AdminDashboard />
        <DebugPanel />
      </div>
    );
  }
  if (user.role === 'psychologist') {
    return (
      <div className="relative">
        <PsychologistDashboard />
        <DebugPanel />
      </div>
    );
  }
  if (user.role === 'institute') {
    return (
      <div className="relative">
        <InstitutionDashboard />
        <DebugPanel />
      </div>
    );
  }
  if (user.role === 'client') {
    return (
      <div className="relative">
        <ClientDashboard />
        <DebugPanel />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-2xl font-bold text-primary-600">КПТ.рф</span>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-md flex items-center transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Выйти
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex items-center mb-8">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-16 w-16 rounded-full"
            />
            <div className="ml-4">
              <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
              <p className="text-sm text-gray-500">
                {user.role === 'admin' && 'Администратор'}
                {user.role === 'institute' && 'Учебное заведение'}
                {user.role === 'psychologist' && 'Психолог'}
                {user.role === 'client' && 'Клиент'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {user.role === 'admin' && (
              <>
                <DashboardCard
                  icon={Users}
                  title="Пользователи"
                  description="Управление пользователями системы"
                />
                <DashboardCard
                  icon={Building}
                  title="Институты"
                  description="Управление учебными заведениями"
                />
                <DashboardCard
                  icon={FileText}
                  title="Статьи"
                  description="Управление публикациями"
                />
              </>
            )}

            {user.role === 'institute' && (
              <>
                <DashboardCard
                  icon={Users}
                  title="Психологи"
                  description="Управление специалистами"
                />
                <DashboardCard
                  icon={FileText}
                  title="Программы"
                  description="Управление учебными программами"
                />
              </>
            )}

            {user.role === 'psychologist' && (
              <>
                <DashboardCard
                  icon={FileText}
                  title="Услуги"
                  description="Управление услугами и ценами"
                />
                <DashboardCard
                  icon={Users}
                  title="Клиенты"
                  description="Управление записями клиентов"
                />
              </>
            )}

            {user.role === 'client' && (
              <>
                <DashboardCard
                  icon={FileText}
                  title="Записи"
                  description="Мои записи к специалистам"
                />
                <DashboardCard
                  icon={Users}
                  title="Избранное"
                  description="Сохраненные специалисты"
                />
              </>
            )}

            <DashboardCard
              icon={Settings}
              title="Настройки"
              description="Настройки профиля и уведомлений"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
}> = ({ icon: Icon, title, description }) => (
  <div className="bg-white overflow-hidden shadow rounded-lg">
    <div className="p-5">
      <div className="flex items-center">
        <div className="flex-shrink-0">
          <Icon className="h-6 w-6 text-primary-600" />
        </div>
        <div className="ml-5">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
    </div>
    <div className="bg-gray-50 px-5 py-3">
      <div className="text-sm">
        <a href="#" className="font-medium text-primary-600 hover:text-primary-500">
          Перейти
        </a>
      </div>
    </div>
  </div>
);

export default DashboardPage;