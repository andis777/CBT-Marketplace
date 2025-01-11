import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { User, Lock } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState(user?.email || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Here would be the API call to update email
      setMessage('Email успешно обновлен');
      setError('');
    } catch (err) {
      setError('Ошибка при обновлении email');
      setMessage('');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    try {
      // Here would be the API call to update password
      setMessage('Пароль успешно обновлен');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setError('Ошибка при обновлении пароля');
      setMessage('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Настройки</h1>

      <div className="space-y-6 max-w-2xl">
        {/* Email Update Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <User className="h-5 w-5 mr-2" />
            Изменить Email
          </h2>
          <form onSubmit={handleEmailUpdate}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Новый Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Обновить Email
              </button>
            </div>
          </form>
        </div>

        {/* Password Update Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            Изменить пароль
          </h2>
          <form onSubmit={handlePasswordUpdate}>
            <div className="space-y-4">
              <div>
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                  Текущий пароль
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                  Новый пароль
                </label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Подтвердите новый пароль
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Обновить пароль
              </button>
            </div>
          </form>
        </div>

        {message && (
          <div className="rounded-md bg-green-50 p-4">
            <div className="text-sm font-medium text-green-800">
              {message}
            </div>
          </div>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-4">
            <div className="text-sm font-medium text-red-800">
              {error}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;