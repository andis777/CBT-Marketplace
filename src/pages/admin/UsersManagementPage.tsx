import React, { useState, useEffect } from 'react';
import { Building, Search, Filter, User as UserIcon } from 'lucide-react';
import { getUsers } from '../../lib/api';
import type { User } from '../../types';
import SearchInput from '../../components/admin/SearchInput';
import FilterDropdown from '../../components/admin/FilterDropdown';
import UserProfileCard from '../../components/admin/UserProfileCard';

const UsersManagementPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to load users');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);
  const roleOptions = [
    { value: 'all', label: 'Все роли' },
    { value: 'psychologist', label: 'Психологи' },
    { value: 'institute', label: 'Учебные заведения' },
    { value: 'client', label: 'Клиенты' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Все статусы' },
    { value: 'verified', label: 'Верифицированные' },
    { value: 'unverified', label: 'Не верифицированные' },
  ];

  const filteredUsers = users.filter((user: User) => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesStatus = selectedStatus === 'all' || 
                         (selectedStatus === 'verified' && user.role !== 'client') ||
                         (selectedStatus === 'unverified' && user.role === 'client');
    return matchesSearch && matchesRole && matchesStatus;
  });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Управление пользователями</h1>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <SearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Поиск по имени или email..."
          />
          <FilterDropdown
            options={roleOptions}
            value={selectedRole}
            onChange={setSelectedRole}
            label="Роль"
          />
          <FilterDropdown
            options={statusOptions}
            value={selectedStatus}
            onChange={setSelectedStatus}
            label="Статус"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredUsers.map(user => (
          <UserProfileCard key={user.id} user={user} />
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            {selectedRole === 'institute' ? (
              <Building className="h-8 w-8 text-gray-400" />
            ) : (
              <UserIcon className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <h3 className="text-lg font-medium text-gray-900">Пользователи не найдены</h3>
          <p className="mt-2 text-gray-500">
            Попробуйте изменить параметры поиска или фильтры
          </p>
        </div>
      )}
    </div>
  );
};

export default UsersManagementPage;