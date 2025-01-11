import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Calendar, Eye, User } from 'lucide-react';
import { getArticle } from '../lib/api';
import type { Article } from '../types';
import ReactMarkdown from 'react-markdown';

const ArticlePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const data = await getArticle(id!);
        setArticle(data);
      } catch (err) {
        setError('Failed to load article');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchArticle();
    }
  }, [id]);

  const handleTagClick = (tag: string) => {
    navigate(`/articles?tag=${encodeURIComponent(tag)}`);
  };

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

  if (!article) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Статья не найдена</h2>
          <Link to="/articles" className="mt-4 text-primary-600 hover:text-primary-500">
            Вернуться к списку статей
          </Link>
        </div>
      </div>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <article className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img
          src={article.image_url}
          alt={article.title}
          className="w-full h-48 sm:h-[400px] object-cover"
        />

        <div className="p-4 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{article.title}</h1>

          <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 text-sm text-gray-500">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {new Date(article.created_at).toLocaleDateString('ru-RU')}
            </div>
            <div className="flex items-center">
              <Eye className="h-5 w-5 mr-2" />
              {article.views} просмотров
            </div>
          </div>

          <div className="mt-4 sm:mt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <Link
                  to={`/psychologist/${article.authorId}`}
                  className="text-lg font-medium text-gray-900 hover:text-primary-600"
                >
                  {article.author}
                </Link>
                <div className="text-sm text-gray-500">Психолог КПТ</div>
              </div>
            </div>
          </div>

          <div className="mt-4 sm:mt-6 flex flex-wrap gap-2">
            {article.tags.map((tag, index) => (
              <button
                key={index}
                onClick={() => handleTagClick(tag)}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800 hover:bg-primary-200 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </div>

          <div className="mt-6 sm:mt-8 prose prose-primary max-w-none">
            <ReactMarkdown>{article.content}</ReactMarkdown>
          </div>

          <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-gray-50 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900">Об авторе</h2>
            <div className="mt-4 flex flex-col sm:flex-row items-center sm:items-start gap-4">
              <img
                src={article.authorAvatar}
                alt={article.author}
                className="w-16 h-16 rounded-full"
              />
              <div className="text-center sm:text-left">
                <Link
                  to={`/psychologist/${article.authorId}`}
                  className="text-xl font-medium text-gray-900 hover:text-primary-600"
                >
                  {article.author}
                </Link>
                <p className="mt-1 text-gray-600">
                  Психолог-консультант, специалист по когнитивно-поведенческой терапии
                </p>
                <div className="mt-2">
                  <Link
                    to={`/psychologist/${article.authorId}`}
                    className="text-primary-600 hover:text-primary-500"
                  >
                    Записаться на консультацию
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </main>
  );
};

export default ArticlePage;