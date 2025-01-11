import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Home, Lock, Phone, Mail, User, Building, Users } from 'lucide-react';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    name: '',
    role: '' as 'psychologist' | 'institute' | 'client'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Пароли не совпадают');
      setLoading(false);
      return;
    }

    try {
      await register({
        email: formData.email,
        password: formData.password,
        phone: formData.phone,
        name: formData.name,
        role: formData.role
      });
      navigate('/dashboard');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Ошибка при регистрации';
      setError(message);
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="fixed top-4 left-4 sm:top-8 sm:left-8">
        <Link
          to="/"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700"
        >
          <Home className="h-5 w-5 mr-2" />
          На главную
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Lock className="h-12 w-12 text-primary-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Регистрация
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Телефон
              </label>
              <div className="mt-1 relative">
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <Phone className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <div className="mt-1 relative">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <User className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Роль
              </label>
              <div className="mt-2 grid grid-cols-1 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'psychologist' })}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors ${
                    formData.role === 'psychologist' ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <Users className="h-6 w-6 text-primary-600 mr-3" />
                    <span className="text-lg font-medium text-gray-900">
                      Психолог
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'institute' })}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors ${
                    formData.role === 'institute' ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <Building className="h-6 w-6 text-primary-600 mr-3" />
                    <span className="text-lg font-medium text-gray-900">
                      Учебное заведение
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'client' })}
                  className={`flex items-center justify-between p-4 border rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-colors ${
                    formData.role === 'client' ? 'border-primary-500 bg-primary-50' : ''
                  }`}
                >
                  <div className="flex items-center">
                    <User className="h-6 w-6 text-primary-600 mr-3" />
                    <span className="text-lg font-medium text-gray-900">
                      Клиент
                    </span>
                  </div>
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Пароль
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Подтвердите пароль
              </label>
              <div className="mt-1">
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm">{error}</div>
            )}

            <button
              type="submit"
              disabled={loading || !formData.role}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Регистрация...' : 'Зарегистрироваться'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              to="/login"
              className="text-sm text-primary-600 hover:text-primary-500"
            >
              Уже есть аккаунт? Войти
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;