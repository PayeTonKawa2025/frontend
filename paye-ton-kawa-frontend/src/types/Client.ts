// src/types/client.ts
export interface Client {
    id: string;
    name: string;
    email: string;
    phone: string;
    company: string;
    status: 'active' | 'inactive' | 'prospect';
    totalOrders: number;
    createdAt: string;
}
