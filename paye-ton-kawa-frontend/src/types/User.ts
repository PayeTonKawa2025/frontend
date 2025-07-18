// src/types/User.ts

export interface User {
    avatar: string | undefined;
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    role: 'admin' | 'manager' | 'user';
    status: 'active' | 'inactive';
    lastLogin: string;
    createdAt: string;
}
