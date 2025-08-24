'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '@/lib/api';
import { User } from '@/types/User';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (firstName: string, lastName: string) => Promise<void>;
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

  const normalizeRoles = (roles: unknown): string[] => {
    if (Array.isArray(roles)) {
      return roles.map((r) => (typeof r === 'string' ? r : typeof r === 'object' && r?.name ? r.name : 'UNKNOWN'));
    }
    return [];
  };

  const fetchUserProfile = async () => {
    try {
      const res = await authApi.get('/me');
      const safeUser: User = {
        ...res.data,
        firstName: res.data.firstname, // <-- on corrige ici
        lastName: res.data.lastname,
        roles: normalizeRoles(res.data.roles),
      };

      setUser(safeUser);
      console.log('👤 Utilisateur connecté (fetchUserProfile):', safeUser);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const updateProfile = async (firstName: string, lastName: string) => {
    try {
      await authApi.put('/me', { firstName, lastName });
      await fetchUserProfile(); // 🔁 Recharge les infos à jour
    } catch {
      throw new Error("Erreur lors de la mise à jour du profil");
    }
  };


  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      await authApi.post('/login', { email, password });
      await fetchUserProfile();
    } catch (err: any) {
      const msg = err?.response?.data || 'Connexion refusée';
      throw new Error(msg);
    } finally {
      setIsLoading(false);
    }
  };



  const register = async (email: string, password: string, firstName: string, lastName: string) => {
    setIsLoading(true);
    try {
      await authApi.post('/register', { email, password, firstName, lastName });
      window.location.href = '/login';
    } catch {
      throw new Error("Erreur lors de l'inscription");
    } finally {
      setIsLoading(false);
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
      <AuthContext.Provider value={{ user, login, register, logout, updateProfile, isLoading }}>
        {children}
      </AuthContext.Provider>
  );
};
