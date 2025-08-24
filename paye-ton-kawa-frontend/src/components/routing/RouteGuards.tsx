'use client';

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

type RoleName = 'ADMIN' | 'MANAGER' | 'USER';

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

export const RequireRole: React.FC<{ allowedRoles: RoleName[]; children: React.ReactNode }> = ({
                                                                                                   allowedRoles,
                                                                                                   children,
                                                                                               }) => {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Chargement...</div>;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const userRoles = Array.isArray(user.roles)
        ? user.roles.map((r) => (typeof r === 'string' ? r : r?.name || 'UNKNOWN'))
        : [];

    const hasAccess = userRoles.some((r) => allowedRoles.includes(r as RoleName));

    if (!hasAccess) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
};
