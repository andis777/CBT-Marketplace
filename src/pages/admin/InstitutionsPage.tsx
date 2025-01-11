import React, { useState, useEffect } from 'react';
import { Building, Edit, Trash2, Plus } from 'lucide-react';
import { getInstitutions } from '../../lib/api';
import type { Institution } from '../../types';
import InstitutionEditModal from '../../components/admin/InstitutionEditModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';

const InstitutionsPage = () => {
  const [institutions, setInstitutions] = useState<Institution[]>([]);
  const [selectedInstitution, setSelectedInstitution] = useState<Institution | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstitutions = async () => {
      try {
        setLoading(true);
        const data = await getInstitutions();
        setInstitutions(data);
      } catch (err) {
        setError('Failed to load institutions');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstitutions();
  }, []);

  const handleEdit = (institution: Institution) => {
    setSelectedInstitution(institution);
    setIsEditModalOpen(true);
  };

  const handleDelete = (institution: Institution) => {
    setSelectedInstitution(institution);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (updatedInstitution: Institution) => {
    setInstitutions(institutions.map(institution => 
      institution.id === updatedInstitution.id ? updatedInstitution : institution
    ));
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedInstitution) return;
    
    setIsDeleting(true);
    setDeleteError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setInstitutions(institutions.filter(institution => institution.id !== selectedInstitution.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      setDeleteError('Failed to delete institution');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Учебные заведения</h1>
        <button
          onClick={() => {
            setSelectedInstitution(null);
            setIsEditModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить учебное заведение
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Учебное заведение
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Адрес
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Контакты
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {institutions.map(institution => (
              <tr key={institution.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={institution.avatar}
                      alt={institution.name}
                      className="h-10 w-10 rounded-lg"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {institution.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {institution.psychologists_count} специалистов
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{institution.address}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{institution.contacts.phone}</div>
                  <div className="text-sm text-gray-500">{institution.contacts.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(institution)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(institution)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <InstitutionEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        institution={selectedInstitution}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление учебного заведения"
        message={`Вы уверены, что хотите удалить учебное заведение ${selectedInstitution?.name}?`}
      />
    </div>
  );
};

export default InstitutionsPage;