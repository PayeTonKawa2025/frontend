'use client';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';
import { cn } from '@/lib/utils';
import {
  ArrowLeft,
  Box,
  Grid2x2,
  Moon,
  Package,
  Sun,
  User,
  Users,
} from 'lucide-react';
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, onToggle }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth(); // ✅ Hook placé dans le composant

  // ✅ Générer la navigation dynamiquement en fonction du rôle
  const navigation = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: Grid2x2,
    },
    {
      name: 'Produits',
      href: '/products',
      icon: Package,
    },
    {
      name: 'Clients',
      href: '/clients',
      icon: Users,
    },
    {
      name: 'Commandes',
      href: '/orders',
      icon: Box,
    },
    ...(user?.roles.includes('ADMIN')
        ? [
          {
            name: 'Utilisateurs',
            href: '/users',
            icon: User,
          },
        ]
        : []),
  ];

  return (
      <div
          className={cn(
              'h-full bg-sidebar border-r border-sidebar-border transition-all duration-300 flex flex-col',
              isCollapsed ? 'w-16' : 'w-64'
          )}
      >
        {/* Header */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center justify-between">
            {!isCollapsed && (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">C</span>
                  </div>
                  <span className="font-semibold text-sidebar-foreground">CRM PTK</span>
                </div>
            )}
            <Button
                variant="ghost"
                size="sm"
                onClick={onToggle}
                className="h-8 w-8 p-0 hover:bg-sidebar-accent"
            >
              <ArrowLeft
                  className={cn(
                      'h-4 w-4 transition-transform',
                      isCollapsed ? 'rotate-180' : 'rotate-0'
                  )}
              />
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = location.pathname.startsWith(item.href);
            return (
                <Link
                    key={item.name}
                    to={item.href}
                    className={cn(
                        'flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                        isActive
                            ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                            : 'text-sidebar-foreground',
                        isCollapsed && 'justify-center'
                    )}
                >
                  <item.icon className={cn('h-5 w-5', !isCollapsed && 'mr-3')} />
                  {!isCollapsed && <span>{item.name}</span>}
                </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-sidebar-border space-y-2">
          <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className={cn(
                  'w-full justify-start hover:bg-sidebar-accent',
                  isCollapsed && 'justify-center'
              )}
          >
            {theme === 'light' ? (
                <Moon className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
            ) : (
                <Sun className={cn('h-4 w-4', !isCollapsed && 'mr-3')} />
            )}
            {!isCollapsed && <span>Thème</span>}
          </Button>

          {/* ✅ User connecté */}
          {!isCollapsed && user && (
              <div className="pt-2">
                <div className="text-xs text-sidebar-foreground/60 mb-1">Connecté en tant que</div>
                <div className="text-sm font-medium text-sidebar-foreground truncate">
                  {user.firstName} {user.lastName}
                </div>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={logout}
                    className="w-full justify-start mt-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                >
                  Se déconnecter
                </Button>
              </div>
          )}
        </div>
      </div>
  );
};
