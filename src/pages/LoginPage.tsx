import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, Home, UserPlus } from 'lucide-react';
import LoginDebug from '../components/LoginDebug';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(email, password);
      // Let DashboardPage handle the role-based redirect
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Неверный email или пароль');
    } finally {
      setLoading(false);
    }
  };

  const handleTestLogin = async (testEmail: string, testPassword: string) => {
    setEmail(testEmail);
    setPassword(testPassword);
    try {
      await login(testEmail, testPassword);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setError('Ошибка входа с тестовым аккаунтом');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="fixed top-4 left-4 sm:top-8 sm:left-8">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <Home className="h-5 w-5 mr-2" />
          На главную
        </Link>
      </div>

      <div className="fixed top-4 right-4 sm:top-8 sm:right-8">
        <Link
          to="/register"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          <UserPlus className="h-5 w-5 mr-2" />
          Регистрация
        </Link>
      </div>
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Вход в личный кабинет
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {loading ? 'Вход...' : 'Войти'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Тестовые аккаунты
                </span>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <button
                onClick={() => handleTestLogin('admin@kpt.ru', 'test123')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Администратор: admin@kpt.ru / test123
              </button>
              <button
                onClick={() => handleTestLogin('test.inst@kpt.ru', 'test123')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Институт: test.inst@kpt.ru / test123
              </button>
              <button
                onClick={() => handleTestLogin('test.psy@kpt.ru', 'test123')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Психолог: test.psy@kpt.ru / test123
              </button>
              <button
                onClick={() => handleTestLogin('test.client@kpt.ru', 'test123')}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-md"
              >
                Клиент: test.client@kpt.ru / test123
              </button>
            </div>
          </div>
        </div>
      </div>
      <LoginDebug />
    </div>
  );
};

export default LoginPage;