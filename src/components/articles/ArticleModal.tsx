import React from 'react';
import { X } from 'lucide-react';
import ArticleForm, { ArticleFormData } from './ArticleForm';
import type { Article } from '../../types';

interface ArticleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ArticleFormData) => void;
  article?: Article;
  isLoading?: boolean;
}

const ArticleModal: React.FC<ArticleModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  article,
  isLoading,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />

        <div className="inline-block transform overflow-hidden rounded-lg bg-white px-4 pt-5 pb-4 text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-2xl sm:p-6 sm:align-middle">
          <div className="absolute top-0 right-0 hidden pt-4 pr-4 sm:block">
            <button
              type="button"
              className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Закрыть</span>
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="sm:flex sm:items-start">
            <div className="mt-3 w-full text-center sm:mt-0 sm:text-left">
              <h3 className="text-lg font-medium leading-6 text-gray-900">
                {article ? 'Редактировать статью' : 'Новая статья'}
              </h3>
              <div className="mt-6">
                <ArticleForm
                  onSubmit={onSubmit}
                  onCancel={onClose}
                  initialData={article}
                  isLoading={isLoading}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArticleModal;