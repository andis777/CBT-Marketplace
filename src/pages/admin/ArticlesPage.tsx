import React, { useState, useEffect } from 'react';
import { FileText, Edit, Trash2, Plus, Eye } from 'lucide-react';
import { getArticles } from '../../lib/api';
import type { Article } from '../../types';
import ArticleEditModal from '../../components/admin/ArticleEditModal';
import DeleteConfirmModal from '../../components/admin/DeleteConfirmModal';

const ArticlesPage = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles();
        setArticles(data);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const handleEdit = (article: Article) => {
    setSelectedArticle(article);
    setIsEditModalOpen(true);
  };

  const handleDelete = (article: Article) => {
    setSelectedArticle(article);
    setIsDeleteModalOpen(true);
  };

  const handleSave = (updatedArticle: Article) => {
    setArticles(articles.map(article => 
      article.id === updatedArticle.id ? updatedArticle : article
    ));
    setIsEditModalOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!selectedArticle) return;
    
    setIsDeleting(true);
    setDeleteError('');
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      setArticles(articles.filter(article => article.id !== selectedArticle.id));
      setIsDeleteModalOpen(false);
    } catch (error) {
      setDeleteError('Failed to delete article');
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Статьи</h1>
        <button
          onClick={() => {
            setSelectedArticle(null);
            setIsEditModalOpen(true);
          }}
          className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          Добавить статью
        </button>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Статья
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Автор
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Дата
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Просмотры
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {articles.map(article => (
              <tr key={article.id}>
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={article.image_url}
                      alt={article.title}
                      className="h-10 w-16 object-cover rounded"
                    />
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {article.title}
                      </div>
                      <div className="text-sm text-gray-500 line-clamp-1">
                        {article.preview}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <img
                      src={article.authorAvatar}
                      alt={article.author}
                      className="h-8 w-8 rounded-full"
                    />
                    <div className="ml-3">
                      <div className="text-sm font-medium text-gray-900">
                        {article.author}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(article.created_at).toLocaleDateString('ru-RU')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {article.views}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() => handleEdit(article)}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    <Edit className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => handleDelete(article)}
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

      <ArticleEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        article={selectedArticle}
        onSave={handleSave}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Удаление статьи"
        message={`Вы уверены, что хотите удалить статью "${selectedArticle?.title}"?`}
      />
    </div>
  );
};

export default ArticlesPage;