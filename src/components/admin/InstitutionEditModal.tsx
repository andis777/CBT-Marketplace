import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Institution, Service } from '../../types';

interface InstitutionEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  institution: Institution | null;
  onSave: (institution: Institution) => void;
}

const InstitutionEditModal: React.FC<InstitutionEditModalProps> = ({
  isOpen,
  onClose,
  institution,
  onSave,
}) => {
  const [formData, setFormData] = useState<Partial<Institution>>({
    name: '',
    description: '',
    avatar: '',
    address: '',
    psychologists_count: 0,
    services: [],
    contacts: {
      phone: '',
      email: '',
      website: '',
    },
    is_verified: false,
  });

  const [newService, setNewService] = useState<Partial<Service>>({
    name: '',
    description: '',
    price: 0,
  });

  useEffect(() => {
    if (institution) {
      setFormData(institution);
    } else {
      setFormData({
        name: '',
        description: '',
        avatar: '',
        address: '',
        psychologists_count: 0,
        services: [],
        contacts: {
          phone: '',
          email: '',
          website: '',
        },
        is_verified: false,
      });
    }
  }, [institution]);

  if (!isOpen) return null;

  const handleAddService = () => {
    if (newService.name && newService.description && newService.price) {
      const newServiceWithId: Service = {
        ...newService as Service,
        id: `service${Date.now()}`
      };
      setFormData({
        ...formData,
        services: [...(formData.services || []), newServiceWithId],
      });
      setNewService({
        name: '',
        description: '',
        price: 0,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newInstitution: Institution = {
      ...formData as Institution,
      id: institution?.id ?? `inst${Date.now()}`
    };
    onSave(newInstitution);
  };

  // Rest of the component implementation...
  return (
    // Component JSX...
    <div>Institution Edit Modal</div>
  );
};

export default InstitutionEditModal;