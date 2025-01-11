import axios, { AxiosInstance, AxiosError, CreateAxiosDefaults } from 'axios';

interface ApiResponse<T> {
  data: T;
  error?: string;
  token?: string;
  user?: any;
}
import { safeClone } from '../utils/cloneHelper';

class ApiClient {
  private static instance: ApiClient;
  private client: AxiosInstance;
  
  private constructor() {
    const config: CreateAxiosDefaults = {
      baseURL: 'https://kpt.arisweb.ru:8443/api',
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    this.client = axios.create(config);
    this.setupInterceptors();
  }

  public static getInstance(): ApiClient {
    if (!ApiClient.instance) {
      ApiClient.instance = new ApiClient();
    }
    return ApiClient.instance;
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      (config) => {
        try {
          const token = localStorage.getItem('token');

          if (token) {
            config.headers.Authorization = token.startsWith('Bearer ') ? token : `Bearer ${token}`;
          }

          // Clean up undefined/null params
          if (config.params) {
            Object.keys(config.params).forEach(key => {
              if (config.params[key] === undefined || config.params[key] === null) {
                delete config.params[key];
              }
            });
          }

          // Safe logging
          const logData = {
            url: config.url,
            method: config.method,
            params: config.params,
            hasData: !!config.data
          };

          this.safeLogEvent('request', logData);
        } catch (error) {
          console.warn('Error in request interceptor:', error);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    this.client.interceptors.response.use(
      (response) => {
        try {
          if (!response) {
            return null;
          }

          // Safe logging
          const logData = {
            status: response.status,
            hasData: !!response.data
          };

          this.safeLogEvent('response', logData);
        
          return response.data;
        } catch (error) {
          console.warn('Error in response interceptor:', error);
          return response.data;
        }
      },
      (error: AxiosError<ApiResponse<unknown>>) => {
        try {
          // Handle 401 Unauthorized
          if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }

          // Safe logging
          const logData = {
            message: error.message,
            status: error.response?.status
          };

          this.safeLogEvent('error', logData);
        } catch (loggingError) {
          console.warn('Error in error interceptor:', loggingError);
        }

        throw error;
      }
    );
  }

  private safeLogEvent(type: 'request' | 'response' | 'error', data: any) {
    try {
      // Use our improved safeClone helper
      const safeData = safeClone({
        timestamp: new Date().toISOString(), 
        type: type,
        data: data
      });

      window.dispatchEvent(new CustomEvent('api-log', {
        detail: { [type]: safeData }
      }));
    } catch (error) {
      // Silently fail for logging errors
    }
  }

  private sanitizeResponse<T>(response: any): T {
    if (!response) return null as any;
    try {
      return safeClone(response);
    } catch (error) {
      console.warn('Failed to sanitize response:', error);
      // Return a clean copy without non-serializable data
      const clean = { ...response };
      delete clean.toJSON;
      delete clean.toString;
      return clean as T;
    }
  }

  public async get<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, config);
      return this.sanitizeResponse(response);
    } catch (error) {
      console.error('GET Error:', error);
      throw error;
    }
  }

  public async post<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data, config);
      return this.sanitizeResponse(response);
    } catch (error) {
      console.error('POST Error:', error);
      throw error;
    }
  }

  public async put<T>(url: string, data = {}, config = {}): Promise<T> {
    try {
      const response = await this.client.put<ApiResponse<T>>(url, data, config);
      return this.sanitizeResponse(response);
    } catch (error) {
      console.error('PUT Error:', error);
      throw error;
    }
  }

  public async delete<T>(url: string, config = {}): Promise<T> {
    try {
      const response = await this.client.delete<ApiResponse<T>>(url, config);
      return this.sanitizeResponse(response);
    } catch (error) {
      console.error('DELETE Error:', error);
      throw error;
    }
  }
}

export const apiClient = ApiClient.getInstance();