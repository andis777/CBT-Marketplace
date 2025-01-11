import { useState, useEffect } from 'react';
import type { Article } from '../types';
import { getArticlesByAuthor } from '../lib/api/articles';

export const useArticles = (authorId?: string) => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        if (!authorId) {
          setArticles([]);
          return;
        }
        const data = await getArticlesByAuthor(authorId);
        setArticles(data);
      } catch (err) {
        setError('Failed to load articles');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (authorId) {
      fetchArticles();
    }
  }, [authorId]);

  return { articles, setArticles, loading, error };
};

export default useArticles;