import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { login as apiLogin, register as apiRegister } from '../lib/api';
import { logEvent } from '../utils/logger';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { email: string; password: string; phone: string; name: string; role: 'psychologist' | 'institute' | 'client' }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    try {
      console.log('Attempting login with:', { email });
      const response = await apiLogin(email, password);
      if (!response || !response.token || !response.user) {
        throw new Error('Invalid response from server');
      }
      
      console.log('Login response:', {
        hasToken: !!response.token,
        tokenLength: response.token?.length,
        user: {
          id: response.user.id,
          role: response.user.role,
          email: response.user.email
        }
      });

      const userData = { ...response.user, token: response.token };
      setUser(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      console.log('Auth state updated:', {
        token: response.token?.substring(0, 20) + '...',
        user: userData.email
      });

      logEvent('login_success', {
        success: true,
        message: 'User logged in successfully',
        role: userData.role
      });
    } catch (error) {
      console.error('Login error:', error);
      logEvent('login_error', {
        success: false,
        message: error instanceof Error ? error.message : 'Login failed'
      });
      throw error;
    }
  };

  const register = async (data: { email: string; password: string; phone: string; name: string; role: 'psychologist' | 'institute' | 'client' }) => {
    try {
      const response = await apiRegister(data);
      if (!response || !response.token || !response.user) {
        throw new Error('Registration failed - invalid server response');
      }

      const userData = { ...response.user, token: response.token };
      setUser(userData);
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      logEvent('register_success', {
        success: true,
        message: 'User registered successfully',
        role: userData.role
      });
    } catch (error) {
      logEvent('register_error', {
        success: false,
        message: error instanceof Error ? error.message : 'Registration failed'
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    
    logEvent('logout', {
      success: true,
      message: 'User logged out successfully'
    });
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};