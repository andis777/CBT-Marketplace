import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { User } from '../../types';

interface UserEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onSave: (user: User) => void;
}

const UserEditModal: React.FC<UserEditModalProps> = ({
  isOpen,
  onClose,
  user,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'client',
    avatar: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      });
    } else {
      setFormData({
        name: '',
        email: '',
        role: 'client',
        avatar: '',
      });
    }
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Имя обязательно для заполнения';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email обязателен для заполнения';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Введите корректный email';
    }

    if (!formData.avatar?.trim()) {
      newErrors.avatar = 'URL аватара обязателен для заполнения';
    } else if (!/^https?:\/\/.+/.test(formData.avatar)) {
      newErrors.avatar = 'Введите корректный URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const newUser = {
      id: user?.id ?? `user${Date.now()}`,
      name: formData.name ?? '',
      email: formData.email ?? '',
      role: formData.role ?? 'client',
      avatar: formData.avatar ?? '',
      is_verified: user?.is_verified ?? false,
      is_active: user?.is_active ?? true
    };
    onSave(newUser);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-40" onClick={onClose}></div>
        
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {user ? 'Редактировать пользователя' : 'Добавить пользователя'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Имя
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${
                  errors.email ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Роль
              </label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as User['role'] })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="admin">Администратор</option>
                <option value="institute">Учебное заведение</option>
                <option value="psychologist">Психолог</option>
                <option value="client">Клиент</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                URL аватара
              </label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className={`mt-1 block w-full rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 ${
                  errors.avatar ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errors.avatar && (
                <p className="mt-1 text-sm text-red-600">{errors.avatar}</p>
              )}
            </div>

            {formData.avatar && (
              <div className="mt-2">
                <img
                  src={formData.avatar}
                  alt="Preview"
                  className="h-20 w-20 rounded-full object-cover mx-auto"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/200';
                  }}
                />
              </div>
            )}

            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Отмена
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
              >
                {user ? 'Сохранить' : 'Добавить'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserEditModal;