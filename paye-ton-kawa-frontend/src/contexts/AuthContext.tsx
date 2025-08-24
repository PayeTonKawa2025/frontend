'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {authApi} from '@/lib/api';
import { User } from '@/types/User';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await authApi.get('/me');
        setUser(res.data);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.post('/login', { email, password });
      const res = await authApi.get('/me');
      setUser(res.data);
    } catch {
      throw new Error("Login invalide");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      await authApi.post('/register', {
        email,
        password,
        firstName,
        lastName,
      },);
      await authApi.get('/me');
      setUser(null);
    } catch {
      throw new Error("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
      window.location.href = '/login';
    }
  };

  const logout = async () => {
    try {
      await authApi.post('/logout', {});
    } finally {
      setUser(null);
      window.location.href = '/login';
    }
  };

  return (
      <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
        {children}
      </AuthContext.Provider>
  );
};
