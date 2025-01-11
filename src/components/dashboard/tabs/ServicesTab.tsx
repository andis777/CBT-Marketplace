import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useAuth } from '../../../contexts/AuthContext';
import { getPsychologistByUserId } from '../../../lib/api/psychologists';
import PaymentsTab from './PaymentsTab';
import { 
  createService, 
  updateService, 
  deleteService,
  getServicesByProvider,
  getServiceCategories,
  getServiceTemplates,
  type ServiceCategory,
  type ServiceTemplate
} from '../../../lib/api/services';
import type { Service } from '../../../types';

const ServicesTab = () => {
  const { user } = useAuth();
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<ServiceCategory[]>([]);
  const [serviceTemplates, setServiceTemplates] = useState<ServiceTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<ServiceTemplate | null>(null);
  const [providerId, setProviderId] = useState<string | null>(null);

  // Fetch initial data including provider ID and services
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user?.id || !user?.role) return;
        
        // Get psychologist profile to get provider ID
        const profile = await getPsychologistByUserId(user.id);
        if (!profile?.id) {
          setError('Не удалось найти профиль. Пожалуйста, обратитесь к администратору.');
          return;
        }
        
        // Store provider ID for later use
        setProviderId(profile.id);
        
        // Fetch services using provider ID
        const servicesData = await getServicesByProvider(profile.id, 'psychologist');
        
        if (Array.isArray(servicesData)) {
          setServices(servicesData);
        } else {
          setError('Ошибка загрузки услуг');
        }

        // Fetch available service categories
        const categoriesData = await getServiceCategories();
        setCategories(categoriesData);

      } catch (err) {
        setError('Не удалось загрузить услуги');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchData();
  }, [user?.id]);

  useEffect(() => {
    const fetchTemplates = async () => {
      if (!selectedCategory) return;
      console.log('Fetching templates for category:', selectedCategory);
      try {
        const templatesData = await getServiceTemplates(selectedCategory);
        console.log('Fetched templates:', templatesData);
        setServiceTemplates(templatesData);
      } catch (err) {
        console.error('Error fetching templates:', err);
      }
    };

    fetchTemplates();
  }, [selectedCategory]);

  const handleTemplateSelect = (template: ServiceTemplate) => {
    setSelectedTemplate(template);
    setEditingService({
      id: '',
      name: template.name,
      description: template.description || '',
      price: template.default_price,
      duration_minutes: template.default_duration
    } as Service);
  };

  const handleSaveService = async (service: Service, isNew: boolean = false) => {
    try {
      if (!providerId) {
        setError('Не удалось определить ID профиля');
        return;
      }

      setError(null);

      if (isNew) {
        // Create new service with provider ID
        // Create new service with provider ID
        const newService = await createService(providerId, service);
        setServices([...services, newService]);
      } else {
        const updatedService = await updateService(service.id, service);
        setServices(services.map(s => s.id === service.id ? updatedService : s));
      }

      setEditingService(null);
      setSelectedTemplate(null);
      setSelectedCategory('');
    } catch (err) {
      setError('Не удалось сохранить услугу');
      console.error(err);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      setServices(services.filter(s => s.id !== serviceId));
    } catch (err) {
      setError('Не удалось удалить услугу');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Управление услугами</h2>
        <button
          onClick={() => {
            setSelectedTemplate(null);
            setEditingService({ id: '', name: '', description: '', price: 0, duration_minutes: 60 } as Service);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить услугу
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}

      {editingService && (
        <div className="bg-white shadow rounded-lg p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingService.id ? 'Редактирование услуги' : 'Добавление услуги'}
          </h3>

          {!editingService.id && (
            <div className="mb-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Категория услуг
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                >
                  <option value="">Выберите категорию</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {selectedCategory && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Шаблон услуги
                  </label>
                  <select
                    value={selectedTemplate?.id || ''}
                    onChange={(e) => {
                      const template = serviceTemplates.find(t => t.id === e.target.value);
                      if (template) handleTemplateSelect(template);
                    }}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                  >
                    <option value="">Выберите шаблон</option>
                    {serviceTemplates.map(template => (
                      <option key={template.id} value={template.id}>
                        {template.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Название услуги
              </label>
              <input
                type="text"
                value={editingService.name}
                onChange={(e) => setEditingService({
                  ...editingService,
                  name: e.target.value
                })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Описание
              </label>
              <textarea
                value={editingService.description}
                onChange={(e) => setEditingService({
                  ...editingService,
                  description: e.target.value
                })}
                rows={3}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Цена (₽)
                </label>
                <input
                  type="number"
                  value={editingService.price}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    price: Number(e.target.value)
                  })}
                  min="0"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Длительность (минут)
                </label>
                <input
                  type="number"
                  value={editingService.duration_minutes}
                  onChange={(e) => setEditingService({
                    ...editingService,
                    duration_minutes: Number(e.target.value)
                  })}
                  min="0"
                  step="15"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditingService(null)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <X className="h-5 w-5 mr-2" />
                Отмена
              </button>
              <button
                onClick={() => handleSaveService(editingService, !editingService.id)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
              >
                <Save className="h-5 w-5 mr-2" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {services.map((service) => (
            <li key={service.id} className="hover:bg-gray-50 transition-colors">
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900">
                    {service.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {service.description}
                  </p>
                  <div className="mt-2 flex items-center text-sm text-gray-500">
                    <span className="font-medium text-primary-600">{service.price} ₽</span>
                    <span className="mx-2">•</span>
                    <span>{service.duration_minutes} минут</span>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex items-center space-x-4">
                  <button
                    onClick={() => setEditingService(service)}
                    className="p-2 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-full transition-colors"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDeleteService(service.id)}
                    className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-full transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
          {services.length === 0 && !editingService && (
            <li className="px-4 py-8 text-center text-gray-500">
              У вас пока нет добавленных услуг
            </li>
          )}
        </ul>
      </div>
      
      {/* Payment History Section */}
      <div className="mt-12">
        <PaymentsTab />
      </div>
    </div>
  );
};

export default ServicesTab;