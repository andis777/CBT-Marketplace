import { apiClient } from '../apiClient';
import type { Article } from '../../types';

interface CreateArticleRequest {
  title: string;
  content: string;
  image_url?: string;
  preview?: string;
  tags?: string[];
  author_id?: string;
  psychologist_id?: string;
  institution_id?: string;
}

interface CreateArticleData {
  title: string;
  content: string;
  image_url: string;
  tags: string[];
  author_id?: string;
  psychologist_id?: string;
  institution_id?: string;
}

export const createArticle = async (data: CreateArticleData): Promise<Article> => {
  try {
    const requestData: CreateArticleRequest = {
      title: data.title,
      content: data.content,
      image_url: data.image_url,
      preview: data.content.substring(0, 200).replace(/[#*_]/g, ''),
      tags: data.tags,
      author_id: data.author_id,
      psychologist_id: data.psychologist_id,
      institution_id: data.institution_id
    };

    const response = await apiClient.post<Article>('/articles', requestData);
    return response;
  } catch (error) {
    console.error('Error creating article:', error);
    throw error;
  }
};

export const updateArticle = async (id: string, data: Partial<Article>): Promise<Article> => {
  try {
    const response = await apiClient.put<Article>(`/articles/${id}`, data);
    return response;
  } catch (error) {
    console.error('Error updating article:', error);
    throw error;
  }
};

export const deleteArticle = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/articles/${id}`);
  } catch (error) {
    console.error('Error deleting article:', error);
    throw error;
  }
};

export const getArticlesByAuthor = async (authorId: string): Promise<Article[]> => {
  try {
    const response = await apiClient.get<{ data: Article[] }>(`/articles?author_id=${authorId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching articles by author:', error);
    throw error;
  }
};