import React from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Eye } from 'lucide-react';
import type { Article } from '../../types';

interface ArticleListProps {
  articles: Article[];
  onEdit: (article: Article) => void;
  onDelete: (article: Article) => void;
}

const ArticleList: React.FC<ArticleListProps> = ({
  articles,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {articles.map((article) => (
          <li key={article.id}>
            <div className="flex items-center p-4 sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="truncate">
                  <div className="flex text-sm">
                    <p className="truncate font-medium text-primary-600">
                      {article.title}
                    </p>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <p>
                        {new Date(article.created_at).toLocaleDateString('ru-RU')} • {article.views} просмотров
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                  <div className="flex -space-x-1 overflow-hidden">
                    {article.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 mr-2"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="ml-5 flex-shrink-0">
                <Link
                  to={`/article/${article.id}`}
                  className="mr-4 text-gray-400 hover:text-gray-500"
                >
                  <Eye className="h-5 w-5" />
                </Link>
                <button
                  onClick={() => onEdit(article)}
                  className="mr-4 text-gray-400 hover:text-gray-500"
                >
                  <Edit className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(article)}
                  className="text-red-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ArticleList;