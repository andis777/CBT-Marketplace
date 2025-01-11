import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { createArticle } from '../../lib/api/articles';
import { Article } from '../../types';

interface ArticleEditorProps {
  onSave?: (article: Article) => void;
  initialData?: Partial<Article>;
}

const ArticleEditor: React.FC<ArticleEditorProps> = ({ onSave, initialData }) => {
  const { user } = useAuth();
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [imageUrl, setImageUrl] = useState(initialData?.image_url || '');
  const [tags, setTags] = useState<string[]>(initialData?.tags || []);
  const [newTag, setNewTag] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const articleData = {
        title,
        content,
        image_url: imageUrl,
        tags,
        author_id: user?.id,
        psychologist_id: user?.role === 'psychologist' ? user.id : undefined,
        institution_id: user?.role === 'institute' ? user.id : undefined
      };

      const response = await createArticle(articleData);
      if (onSave) {
        onSave(response);
      }
    } catch (err) {
      setError('Failed to save article');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Заголовок
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Содержание
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={10}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          URL изображения
        </label>
        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Теги
        </label>
        <div className="mt-1 flex gap-2">
          <input
            type="text"
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            className="block flex-1 rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
            placeholder="Добавить тег"
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
          />
          <button
            type="button"
            onClick={handleAddTag}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700"
          >
            Добавить
          </button>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800"
            >
              {tag}
              <button
                type="button"
                onClick={() => setTags(tags.filter(t => t !== tag))}
                className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-primary-400 hover:bg-primary-200 hover:text-primary-500"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-sm">{error}</div>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
        >
          {loading ? 'Сохранение...' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
};

export default ArticleEditor;