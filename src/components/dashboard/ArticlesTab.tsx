import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useArticles } from '../../hooks/useArticles';
import ArticleList from '../articles/ArticleList';
import ArticleModal from '../articles/ArticleModal';
import DeleteConfirmModal from '../admin/DeleteConfirmModal';
import ArticleDebug from './ArticleDebug';
import type { Article } from '../../types';
import { createArticle, updateArticle, deleteArticle } from '../../lib/api/articles';
import type { AxiosError } from 'axios';

const ArticlesTab = () => {
  const { user } = useAuth();
  const { articles, setArticles, loading, error } = useArticles(user?.id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleCreate = async (data: any) => {
    try {
      setIsSubmitting(true);
      const newArticle = await createArticle({
        ...data,
        author_id: user?.id,
      });
      setArticles([...articles, newArticle]);
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error creating article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (data: any) => {
    if (!selectedArticle) return;
    
    try {
      setIsSubmitting(true);
      const updatedArticle = await updateArticle(selectedArticle.id, data);
      setArticles(articles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
      ));
      setIsModalOpen(false);
      setSelectedArticle(null);
    } catch (error) {
      console.error('Error updating article:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedArticle) return;
    
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      await deleteArticle(selectedArticle.id);
      setArticles(articles.filter(article => article.id !== selectedArticle.id));
      setIsDeleteModalOpen(false);
      setSelectedArticle(null);
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 404) {
        setErrorMessage('Статья не найдена. Возможно, она уже была удалена.');
        setArticles(articles.filter(article => article.id !== selectedArticle.id));
      } else {
        setErrorMessage('Не удалось удалить статью. Пожалуйста, попробуйте позже.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-900">Мои статьи</h2>
        <button
          onClick={() => {
            setSelectedArticle(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Написать статью
        </button>
      </div>

      {articles.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">У вас пока нет статей</p>
        </div>
      ) : (
        <ArticleList
          articles={articles}
          onEdit={(article) => {
            setSelectedArticle(article);
            setIsModalOpen(true);
          }}
          onDelete={(article) => {
            setSelectedArticle(article);
            setIsDeleteModalOpen(true);
          }}
        />
      )}

      <ArticleModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedArticle(null);
        }}
        onSubmit={selectedArticle ? handleUpdate : handleCreate}
        article={selectedArticle || undefined}
        isLoading={isSubmitting}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setErrorMessage('');
          setIsDeleteModalOpen(false);
          setSelectedArticle(null);
        }}
        onConfirm={handleDelete}
        title="Удаление статьи"
        message={`Вы уверены, что хотите удалить статью "${selectedArticle?.title}"? Это действие нельзя отменить.`}
        isLoading={isSubmitting}
        error={errorMessage}
      />
      <ArticleDebug />
    </div>
  );
};

export default ArticlesTab;