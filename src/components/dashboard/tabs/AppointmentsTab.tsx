import React from 'react';
import { Calendar } from 'lucide-react';

const AppointmentsTab = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Записи</h2>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-32 text-gray-500">
          <Calendar className="h-8 w-8 mr-2" />
          <span>Нет предстоящих записей</span>
        </div>
      </div>
    </div>
  );
};

export default AppointmentsTab;