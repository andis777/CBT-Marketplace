import React, { useState } from 'react';
import { User } from '../../types';
import { BadgeCheck, MapPin, Mail, Phone, Globe, Edit, Trash2 } from 'lucide-react';
import UserEditModal from './UserEditModal';
import DeleteConfirmModal from './DeleteConfirmModal';

interface UserProfileCardProps {
  user: User;
}

const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  const handleEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  };

  const handleSave = (updatedUser: User) => {
    // Here would be the API call to update user
    console.log('Saving user:', updatedUser);
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    setDeleteError('');
    try {
      // Here would be the API call to delete user
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      console.log('Deleting user:', user.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      setDeleteError('Failed to delete user');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <img
                src={user.avatar}
                alt={user.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  {user.name}
                  {(user.role === 'psychologist' || user.role === 'institute') && (
                    <BadgeCheck className="ml-2 h-5 w-5 text-primary-600" />
                  )}
                </h3>
                <span className="text-sm text-gray-500">
                  {user.role === 'admin' && 'Администратор'}
                  {user.role === 'institute' && 'Учебное заведение'}
                  {user.role === 'psychologist' && 'Психолог'}
                  {user.role === 'client' && 'Клиент'}
                </span>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={handleEdit}
                className="p-2 text-gray-400 hover:text-primary-600 transition-colors"
              >
                <Edit className="h-5 w-5" />
              </button>
              <button
                onClick={handleDelete}
                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
              >
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-500">
              <Mail className="h-4 w-4 mr-2" />
              <span>{user.email}</span>
            </div>
            {user.role === 'psychologist' && (
              <>
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>Москва, Россия</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>+7 (999) 123-45-67</span>
                </div>
              </>
            )}
            {user.role === 'institute' && (
              <>
                <div className="flex items-center text-gray-500">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>ул. Пушкина, д. 10</span>
                </div>
                <div className="flex items-center text-gray-500">
                  <Globe className="h-4 w-4 mr-2" />
                  <a
                    href="https://example.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-600 hover:text-primary-700"
                  >
                    example.com
                  </a>
                </div>
              </>
            )}
          </div>

          {(user.role === 'psychologist' || user.role === 'institute') && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Статус верификации</span>
                <span className="text-primary-600 font-medium">Подтвержден</span>
              </div>
            </div>
          )}
        </div>
      </div>

      <UserEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление пользователя"
        message={`Вы уверены, что хотите удалить пользователя ${user.name}?`}
      />
    </>
  );
};

export default UserProfileCard;