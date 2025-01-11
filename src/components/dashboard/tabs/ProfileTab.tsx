import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { getPsychologist, updatePsychologist, getPsychologistByUserId } from '../../../lib/api/psychologists';
import { Building, Mail, Phone, MapPin, GraduationCap, Award, Languages, Plus, X, Save, RefreshCw } from 'lucide-react';
import type { Psychologist } from '../../../types';
import ProfileDebug from '../ProfileDebug';

const ProfileTab = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Psychologist | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [newLanguage, setNewLanguage] = useState('');
  const [newSpecialization, setNewSpecialization] = useState('');
  const [newEducation, setNewEducation] = useState('');
  const [socialLinks, setSocialLinks] = useState({
    vk: '',
    telegram: '',
    whatsapp: '',
    youtube: '',
    linkedin: '',
    profi_ru: '',
    b17_ru: '',
    yasno_live: ''
  });
  const [refreshing, setRefreshing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Psychologist>>({});

  const fetchProfile = async () => {
    try {
      if (!user?.id) return;
      setLoading(true);
      
      const data = await getPsychologistByUserId(user.id);
      
      // Parse social links if they're a string
      const parsedSocialLinks = typeof data?.social_links === 'string' 
        ? JSON.parse(data.social_links)
        : data?.social_links || {};
      
      setProfile(data);
      if (data) {
        setEditedProfile({
          ...data,
          social_links: parsedSocialLinks,
          contacts: { ...data.contacts },
          location: { ...data.location },
          specializations: [...(data.specializations || [])],
          languages: [...(data.languages || [])],
          education: [...(data.education || [])]
        });
      }
    } catch (err) {
      setError('Не удалось загрузить данные профиля');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'psychologist') fetchProfile();
  }, [user?.id, user?.role]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchProfile();
  };

  const handleSave = async () => {
    if (!profile?.id) return;
    
    type ProfileKey = keyof Psychologist;
    const changes: Partial<Record<ProfileKey, any>> = {};
    
    (Object.keys(editedProfile) as ProfileKey[]).forEach(key => {
      const editedValue = editedProfile[key];
      const originalValue = profile[key];
      
      if (JSON.stringify(editedValue) !== JSON.stringify(originalValue)) {
        changes[key] = editedValue;
      }
    });

    if (Object.keys(changes).length === 0) {
      return; // No changes to save
    }

    try {
      setSaving(true);
      const updatedProfile = await updatePsychologist(profile.id, changes);
      setProfile(updatedProfile);
      setEditedProfile(updatedProfile);
      setError(null);
      // Refresh the page after successful save
      window.location.reload();
    } catch (err) {
      setError('Не удалось сохранить изменения. Пожалуйста, попробуйте еще раз.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: any) => {
    // Special handling for social links
    if (field === 'social_links') {
      const defaultSocialLinks = {
        vk: null,
        b17_ru: null,
        youtube: null,
        linkedin: null,
        profi_ru: null,
        telegram: null,
        whatsapp: null,
        yasno_live: null
      };

      setEditedProfile(prev => ({
        ...prev,
        social_links: {
          ...defaultSocialLinks,
          ...(typeof prev.social_links === 'string' 
            ? JSON.parse(prev.social_links)
            : prev.social_links),
          ...value
        }
      }));
      return;
    }

    setEditedProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleContactChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      contacts: {
        ...(prev.contacts || {}),
        [field]: value
      }
    }));
  };

  const handleLocationChange = (field: string, value: string) => {
    setEditedProfile(prev => ({
      ...prev,
      location: prev.location ? {
        ...prev.location,
        [field]: value,
      } : { city: '', country: '', [field]: value }
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Профиль психолога не найден. Пожалуйста, обратитесь к администратору.</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-lg">
            {error}
            <button
              onClick={handleRefresh}
              className="ml-4 text-primary-600 hover:text-primary-700"
            >
              Попробовать снова
            </button>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Описание</h2>
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="inline-flex items-center px-3 py-1 text-sm text-primary-600 hover:text-primary-700 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-1 ${refreshing ? 'animate-spin' : ''}`} />
              {refreshing ? 'Обновление...' : 'Обновить'}
            </button>
          </div>
          <textarea
            value={editedProfile.description || ''}
            onChange={(e) => handleInputChange('description', e.target.value)}
            className="w-full h-48 p-3 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Расскажите о себе и своём опыте..."
          />
        </div>

        {/* Specializations */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Специализации</h2>
          <div className="space-y-2">
            {editedProfile.specializations?.map((spec, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={spec}
                  onChange={(e) => {
                    const newSpecs = [...(editedProfile.specializations || [])];
                    newSpecs[index] = e.target.value;
                    handleInputChange('specializations', newSpecs);
                  }}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={() => {
                    const newSpecs = editedProfile.specializations?.filter((_, i) => i !== index);
                    handleInputChange('specializations', newSpecs);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newSpecialization}
                onChange={(e) => setNewSpecialization(e.target.value)}
                placeholder="Добавить специализацию"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={() => {
                  if (newSpecialization) {
                    handleInputChange('specializations', [...(editedProfile.specializations || []), newSpecialization]);
                    setNewSpecialization('');
                  }
                }}
                className="text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Languages */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Языки</h2>
          <div className="space-y-2">
            {editedProfile.languages?.map((lang, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={lang}
                  onChange={(e) => {
                    const newLangs = [...(editedProfile.languages || [])];
                    newLangs[index] = e.target.value;
                    handleInputChange('languages', newLangs);
                  }}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={() => {
                    const newLangs = editedProfile.languages?.filter((_, i) => i !== index);
                    handleInputChange('languages', newLangs);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newLanguage}
                onChange={(e) => setNewLanguage(e.target.value)}
                placeholder="Добавить язык"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={() => {
                  if (newLanguage) {
                    handleInputChange('languages', [...(editedProfile.languages || []), newLanguage]);
                    setNewLanguage('');
                  }
                }}
                className="text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Образование</h2>
          <div className="space-y-2">
            {editedProfile.education?.map((edu, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={edu}
                  onChange={(e) => {
                    const newEducation = [...(editedProfile.education || [])];
                    newEducation[index] = e.target.value;
                    handleInputChange('education', newEducation);
                  }}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                <button
                  onClick={() => {
                    const newEducation = editedProfile.education?.filter((_, i) => i !== index);
                    handleInputChange('education', newEducation);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ))}
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newEducation}
                onChange={(e) => setNewEducation(e.target.value)}
                placeholder="Добавить образование"
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <button
                onClick={() => {
                  if (newEducation) {
                    handleInputChange('education', [...(editedProfile.education || []), newEducation]);
                    setNewEducation('');
                  }
                }}
                className="text-primary-600 hover:text-primary-700"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Основная информация</h2>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                value={editedProfile.contacts?.email || ''}
                onChange={(e) => handleContactChange('email', e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Email"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <input
                type="tel"
                value={editedProfile.contacts?.phone || ''}
                onChange={(e) => handleContactChange('phone', e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Телефон"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <MapPin className="h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  value={editedProfile.location?.city || ''}
                  onChange={(e) => handleLocationChange('city', e.target.value)}
                  className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Город"
                />
              </div>
              <input
                type="text"
                value={editedProfile.location?.country || ''}
                onChange={(e) => handleLocationChange('country', e.target.value)}
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Страна"
              />
            </div>
          </div>
        </div>

        {/* Professional Info */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Профессиональная информация</h2>
          <div className="space-y-6">
            <div>
              <div className="flex items-center text-gray-900 mb-2">
                <Award className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Опыт работы (лет)</h3>
              </div>
              <input
                type="number"
                value={editedProfile.experience || 0}
                onChange={(e) => handleInputChange('experience', parseInt(e.target.value))}
                min="0"
                className="p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>

            <div>
              <div className="flex items-center text-gray-900 mb-2">
                <GraduationCap className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Образование</h3>
              </div>
              <div className="space-y-2">
                {editedProfile.education?.map((edu, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={edu}
                      onChange={(e) => {
                        const newEducation = [...(editedProfile.education || [])];
                        newEducation[index] = e.target.value;
                        handleInputChange('education', newEducation);
                      }}
                      className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <button
                      onClick={() => {
                        const newEducation = editedProfile.education?.filter((_, i) => i !== index);
                        handleInputChange('education', newEducation);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newEducation}
                    onChange={(e) => setNewEducation(e.target.value)}
                    placeholder="Добавить образование"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={() => {
                      if (newEducation) {
                        handleInputChange('education', [...(editedProfile.education || []), newEducation]);
                        setNewEducation('');
                      }
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-900 mb-2">
                <Languages className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Языки</h3>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {editedProfile.languages?.map((lang, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {lang}
                      <button
                        onClick={() => {
                          const newLanguages = editedProfile.languages?.filter((_, i) => i !== index);
                          handleInputChange('languages', newLanguages);
                        }}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    placeholder="Добавить язык"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={() => {
                      if (newLanguage) {
                        handleInputChange('languages', [...(editedProfile.languages || []), newLanguage]);
                        setNewLanguage('');
                      }
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center text-gray-900 mb-2">
                <Building className="h-5 w-5 mr-2" />
                <h3 className="font-medium">Специализации</h3>
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {editedProfile.specializations?.map((spec, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
                    >
                      {spec}
                      <button
                        onClick={() => {
                          const newSpecs = editedProfile.specializations?.filter((_, i) => i !== index);
                          handleInputChange('specializations', newSpecs);
                        }}
                        className="ml-1 text-primary-600 hover:text-primary-800"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newSpecialization}
                    onChange={(e) => setNewSpecialization(e.target.value)}
                    placeholder="Добавить специализацию"
                    className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    onClick={() => {
                      if (newSpecialization) {
                        handleInputChange('specializations', [...(editedProfile.specializations || []), newSpecialization]);
                        setNewSpecialization('');
                      }
                    }}
                    className="text-primary-600 hover:text-primary-700"
                  >
                    <Plus className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Социальные сети</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                VK
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.vk || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...(typeof editedProfile.social_links === 'string'
                    ? JSON.parse(editedProfile.social_links)
                    : editedProfile.social_links),
                  vk: e.target.value
                })}
                placeholder="https://vk.com/username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Telegram
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.telegram || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...(typeof editedProfile.social_links === 'string'
                    ? JSON.parse(editedProfile.social_links)
                    : editedProfile.social_links),
                  telegram: e.target.value
                })}
                placeholder="@username"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                WhatsApp
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.whatsapp || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...editedProfile.social_links,
                  whatsapp: e.target.value
                })}
                placeholder="+7XXXXXXXXXX"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                YouTube
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.youtube || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...editedProfile.social_links,
                  youtube: e.target.value
                })}
                placeholder="https://youtube.com/c/channel"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                LinkedIn
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.linkedin || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...editedProfile.social_links,
                  linkedin: e.target.value
                })}
                placeholder="https://linkedin.com/in/profile"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Profi.ru
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.profi_ru || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...editedProfile.social_links,
                  profi_ru: e.target.value
                })}
                placeholder="https://profi.ru/profile/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                B17.ru
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.b17_ru || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...editedProfile.social_links,
                  b17_ru: e.target.value
                })}
                placeholder="https://b17.ru/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Ясно.Live
              </label>
              <input
                type="text"
                value={editedProfile.social_links?.yasno_live || ''}
                onChange={(e) => handleInputChange('social_links', {
                  ...editedProfile.social_links,
                  yasno_live: e.target.value
                })}
                placeholder="https://yasno.live/..."
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
          >
            <Save className="h-5 w-5 mr-2" />
            {saving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>
        </div>
      </div>
      <ProfileDebug />
    </>
  );
};

export default ProfileTab;