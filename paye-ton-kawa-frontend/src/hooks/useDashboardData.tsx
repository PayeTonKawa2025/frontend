// src/hooks/useDashboardData.ts
'use client';

import { useEffect, useMemo, useState } from 'react';
import { api } from '@/lib/api';
import type { Product } from '@/types/Product';
import type { ApiOrder, Order } from '@/types/Order';
import { fromApiOrder } from '@/types/Order';

export interface Client {
    id: string | number;
    name?: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    createdAt?: string | number;
}

export interface User {
    id: string | number;
    name?: string;
    email?: string;
    role?: 'admin' | 'manager' | 'user';
    status?: 'active' | 'inactive';
    lastLogin?: string;
    createdAt?: string | number;
}

/* ---------- Helpers ---------- */

const toArray = <T,>(x: unknown): T[] => (Array.isArray(x) ? (x as T[]) : []);

const calcOrderTotal = (o: Order): number =>
    (o.items || []).reduce((acc, it) => acc + (it.unitPrice || 0) * (it.quantity || 0), 0);

const minutesAgo = (ts?: string | number) => {
    if (!ts) return '—';
    const d = new Date(typeof ts === 'number' ? ts : Date.parse(ts));
    const diffMin = Math.max(0, Math.floor((Date.now() - d.getTime()) / 60000));
    return `Il y a ${diffMin} min`;
};

const monthLabelFR = (year: number, monthIndex0: number) =>
    new Intl.DateTimeFormat('fr-FR', { month: 'short' }).format(new Date(year, monthIndex0, 1));

/** Donne la liste des mois de janvier -> mois courant (année courante) */
const getMonthsFromJanToCurrent = () => {
    const now = new Date();
    const year = now.getFullYear();
    const lastMonthIdx = now.getMonth(); // 0..11
    const months: { key: string; label: string; year: number; monthIdx: number }[] = [];
    for (let m = 0; m <= lastMonthIdx; m++) {
        const key = `${year}-${String(m + 1).padStart(2, '0')}`;
        months.push({ key, label: monthLabelFR(year, m), year, monthIdx: m });
    }
    return months;
};

/* ---------- Hook ---------- */

export const useDashboardData = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [clients, setClients] = useState<Client[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);

    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        const load = async () => {
            setLoading(true);
            setError(null);

            try {
                // 1) produits / clients / users
                const [prodRes, clientsRes, usersRes] = await Promise.all([
                    api.get<Product[]>('/products').catch(() => ({ data: [] as Product[] })),
                    api.get<Client[]>('/clients').catch(() => ({ data: [] as Client[] })),
                    api.get<User[]>('/auth/users').catch(() => ({ data: [] as User[] })), // harmonisé
                ]);

                if (cancelled) return;

                const productsList = toArray<Product>(prodRes.data);
                const clientsList = toArray<Client>(clientsRes.data);
                const usersList = toArray<User>(usersRes.data);

                setProducts(productsList);
                setClients(clientsList);
                setUsers(usersList);

                // 2) commandes : /orders (global) sinon fallback /orders/{clientId}
                let apiOrders: ApiOrder[] = [];
                try {
                    const allOrdersRes = await api.get<ApiOrder[]>('/orders');
                    apiOrders = toArray<ApiOrder>(allOrdersRes.data);
                } catch {
                    const perClient = await Promise.all(
                        clientsList.map((c) =>
                            api
                                .get<ApiOrder[]>(`/orders/${c.id}`)
                                .then((r) => toArray<ApiOrder>(r.data))
                                .catch(() => [] as ApiOrder[])
                        )
                    );
                    apiOrders = perClient.flat();
                }

                if (cancelled) return;

                setOrders(apiOrders.map(fromApiOrder));
            } catch (e: any) {
                if (!cancelled) setError(e?.message ?? 'Erreur de chargement');
            } finally {
                if (!cancelled) setLoading(false);
            }
        };

        load();
        return () => {
            cancelled = true;
        };
    }, []);

    const dashboardStats = useMemo(() => {
        // 👉 Base unique : commandes confirmées
        const confirmedOrders = orders.filter((o) => o.status === 'CONFIRMED');

        /* Totaux simples — uniquement confirmées */
        const totalRevenue = confirmedOrders.reduce((sum, o) => sum + calcOrderTotal(o), 0);
        const totalOrders = confirmedOrders.length;
        const activeClients = clients.length;
        const productsInStock = products.reduce((sum, p) => sum + (Number(p.stock) || 0), 0);

        /* ---------- Répartition produits par TRANCHES DE STOCK ---------- */
        let rupture = 0; // stock = 0
        let faible = 0; // 1..10
        let moyen = 0; // 11..50
        let eleve = 0; // 51+
        products.forEach((p) => {
            const s = Number(p.stock) || 0;
            if (s <= 0) rupture++;
            else if (s <= 10) faible++;
            else if (s <= 50) moyen++;
            else eleve++;
        });

        const productData = [
            { name: 'Rupture (0)', value: rupture, color: '#ef4444' },
            { name: 'Faible (1–10)', value: faible, color: '#f59e0b' },
            { name: 'Moyen (11–50)', value: moyen, color: '#10b981' },
            { name: 'Élevé (51+)', value: eleve, color: '#3b82f6' },
        ];

        /* ---------- Graphiques mensuels (Jan → mois courant) — uniquement confirmées ---------- */
        const months = getMonthsFromJanToCurrent();
        const revenueByKey: Record<string, number> = {};
        const countByKey: Record<string, number> = {};

        months.forEach((m) => {
            revenueByKey[m.key] = 0;
            countByKey[m.key] = 0;
        });

        const currentYear = new Date().getFullYear();
        confirmedOrders.forEach((o) => {
            const d = new Date(Number(o.createdAt || Date.now()));
            if (d.getFullYear() !== currentYear) return;
            const key = `${currentYear}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            if (key in revenueByKey) {
                revenueByKey[key] += calcOrderTotal(o);
                countByKey[key] += 1;
            }
        });

        const salesData = months.map((m) => ({
            name: m.label, // 'janv.', 'févr.', ...
            ventes: Math.round(revenueByKey[m.key]), // CA
            commandes: countByKey[m.key], // nb de commandes confirmées
            profit: Math.round(revenueByKey[m.key] * 0.6), // marge fictive
        }));

        const revenueData = months.map((m) => ({
            name: m.label,
            revenue: Math.round(revenueByKey[m.key]),
        }));

        /* ---------- Commandes récentes — uniquement confirmées ---------- */
        const recentOrders = [...confirmedOrders]
            .sort((a, b) => Number(b.createdAt || 0) - Number(a.createdAt || 0))
            .slice(0, 4)
            .map((o) => ({
                id: String(o.id ?? ''),
                client: o.clientId ?? '',
                amount: Math.round(calcOrderTotal(o) * 100) / 100,
                status: o.status ?? 'PENDING',
                time: minutesAgo(o.createdAt),
            }));

        /* ---------- Top produits — basé sur les confirmées ---------- */
        const qtyByProduct: Record<number, number> = {};
        const revenueByProduct: Record<number, number> = {};
        confirmedOrders.forEach((o) =>
            (o.items || []).forEach((it) => {
                const pid = Number(it.productId);
                const q = Number(it.quantity || 0);
                const rev = (it.unitPrice || 0) * q;
                if (!Number.isFinite(pid)) return;
                qtyByProduct[pid] = (qtyByProduct[pid] || 0) + q;
                revenueByProduct[pid] = (revenueByProduct[pid] || 0) + rev;
            })
        );
        const productById = new Map(products.map((p) => [Number(p.id), p]));
        const topProducts = Object.keys(qtyByProduct)
            .map((idStr) => {
                const id = Number(idStr);
                const p = productById.get(id);
                return {
                    name: p?.name ?? `Produit #${id}`,
                    sales: qtyByProduct[id],
                    revenue: Math.round((revenueByProduct[id] || 0) * 100) / 100,
                };
            })
            .sort((a, b) => b.sales - a.sales)
            .slice(0, 4);

        return {
            totalRevenue,
            totalOrders,
            activeClients,
            productsInStock,
            salesData, // BarChart (ventes / commandes / profit) — confirmées
            revenueData, // AreaChart (revenue) — confirmées
            productData, // PieChart (tranches de stock)
            recentOrders, // confirmées
            topProducts, // confirmées
        };
    }, [orders, clients, products]);

    const refresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const [prodRes, clientsRes, usersRes] = await Promise.all([
                api.get<Product[]>('/products').catch(() => ({ data: [] as Product[] })),
                api.get<Client[]>('/clients').catch(() => ({ data: [] as Client[] })),
                api.get<User[]>('/auth/users').catch(() => ({ data: [] as User[] })), // harmonisé
            ]);
            const productsList = toArray<Product>(prodRes.data);
            const clientsList = toArray<Client>(clientsRes.data);
            const usersList = toArray<User>(usersRes.data);

            setProducts(productsList);
            setClients(clientsList);
            setUsers(usersList);

            let apiOrders: ApiOrder[] = [];
            try {
                const allOrdersRes = await api.get<ApiOrder[]>('/orders');
                apiOrders = toArray<ApiOrder>(allOrdersRes.data);
            } catch {
                const perClient = await Promise.all(
                    clientsList.map((c) =>
                        api
                            .get<ApiOrder[]>(`/orders/${c.id}`)
                            .then((r) => toArray<ApiOrder>(r.data))
                            .catch(() => [] as ApiOrder[])
                    )
                );
                apiOrders = perClient.flat();
            }
            setOrders(apiOrders.map(fromApiOrder));
        } catch (e: any) {
            setError(e?.message ?? 'Erreur de rechargement');
        } finally {
            setLoading(false);
        }
    };

    return {
        products,
        clients,
        users,
        orders,
        dashboardStats,
        loading,
        error,
        refresh,
    };
};
