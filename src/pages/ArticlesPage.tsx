import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Eye, Search } from 'lucide-react';
import { getArticles } from '../lib/api';
import type { Article } from '../types';

const ArticlesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const data = await getArticles({
          tag: selectedTag || undefined
        });
        setArticles(data);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();

    const tagFromUrl = searchParams.get('tag');
    if (tagFromUrl) {
      setSelectedTag(tagFromUrl);
    }
  }, [searchParams, selectedTag]);

  const allTags = Array.from(
    new Set(articles.flatMap(article => article.tags))
  ).sort();

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (article.preview?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || article.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
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

  const handleTagSelect = (tag: string | null) => {
    setSelectedTag(tag);
    if (tag) {
      setSearchParams({ tag });
    } else {
      setSearchParams({});
    }
  };

  return (
    <main className="bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900">Статьи</h1>
        <p className="mt-4 text-lg text-gray-600">
          Полезные материалы о когнитивно-поведенческой терапии
        </p>

        <div className="mt-8 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Поиск по статьям..."
                className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="sm:w-64">
            <select
              value={selectedTag || ''}
              onChange={(e) => handleTagSelect(e.target.value || null)}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Все темы</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredArticles.map(article => (
            <article
              key={article.id}
              className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
            >
              <Link to={`/article/${article.id}`}>
                <img
                  src={article.image_url}
                  alt={article.title}
                  className="w-full h-48 object-cover"
                />
              </Link>
              <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <Link to={`/article/${article.id}`}>
                  <h2 className="text-xl font-bold text-gray-900 hover:text-primary-600">
                    {article.title}
                  </h2>
                </Link>

                <div className="mt-4 flex items-center space-x-4">
                  <Link
                    to={`/psychologist/${article.authorId}`}
                    className="flex items-center group"
                  >
                    <img
                      src={article.authorAvatar}
                      alt={article.author}
                      className="h-8 w-8 rounded-full"
                    />
                    <span className="ml-2 text-sm text-gray-700 group-hover:text-primary-600">
                      {article.author}
                    </span>
                  </Link>
                </div>

                <p className="mt-4 text-gray-600 line-clamp-3">{article.preview}</p>

                <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(article.created_at).toLocaleDateString('ru-RU')}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Eye className="h-4 w-4 mr-1" />
                    {article.views} просмотров
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {article.tags.slice(0, 3).map((tag, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.preventDefault();
                        handleTagSelect(tag);
                      }}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">По вашему запросу ничего не найдено</p>
          </div>
        )}
      </div>
    </main>
  );
};

export default ArticlesPage;