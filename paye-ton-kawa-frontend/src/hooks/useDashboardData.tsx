
import { useState, useMemo } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
  createdAt: string;
}

interface Order {
  id: string;
  orderNumber: string;
  client: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Ordinateur Portable Pro',
    category: 'Informatique',
    price: 1299.99,
    stock: 45,
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Smartphone Elite',
    category: 'Téléphonie',
    price: 899.99,
    stock: 23,
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Tablette Design',
    category: 'Informatique',
    price: 599.99,
    stock: 0,
    status: 'inactive',
    createdAt: '2024-01-10',
  },
  {
    id: '4',
    name: 'Écouteurs Premium',
    category: 'Audio',
    price: 299.99,
    stock: 78,
    status: 'active',
    createdAt: '2024-01-08',
  },
];

const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'ORD-001234',
    client: 'Jean Dupont',
    total: 1299.99,
    status: 'delivered',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    orderNumber: 'ORD-001235',
    client: 'Marie Martin',
    total: 899.99,
    status: 'shipped',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    orderNumber: 'ORD-001236',
    client: 'Pierre Durand',
    total: 599.99,
    status: 'processing',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    orderNumber: 'ORD-001237',
    client: 'Sophie Leblanc',
    total: 1899.99,
    status: 'pending',
    createdAt: '2024-01-12',
  },
  {
    id: '5',
    orderNumber: 'ORD-001238',
    client: 'Michel Bernard',
    total: 750.50,
    status: 'delivered',
    createdAt: '2024-01-11',
  },
];

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrateur',
    email: 'admin@crm.com',
    role: 'admin',
    status: 'active',
    lastLogin: '2024-01-15T10:30:00Z',
    createdAt: '2024-01-01',
  },
  {
    id: '2',
    name: 'Manager Commercial',
    email: 'manager@crm.com',
    role: 'manager',
    status: 'active',
    lastLogin: '2024-01-14T14:20:00Z',
    createdAt: '2024-01-05',
  },
  {
    id: '3',
    name: 'Utilisateur Test',
    email: 'user@crm.com',
    role: 'user',
    status: 'inactive',
    lastLogin: '2024-01-10T09:15:00Z',
    createdAt: '2024-01-10',
  },
];

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 1 23 45 67 89',
    company: 'Tech Solutions',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    phone: '+33 1 23 45 67 90',
    company: 'Digital Corp',
    status: 'active',
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    phone: '+33 1 23 45 67 91',
    company: 'Innovation Ltd',
    status: 'active',
    createdAt: '2024-01-13',
  },
  {
    id: '4',
    name: 'Sophie Leblanc',
    email: 'sophie.leblanc@email.com',
    phone: '+33 1 23 45 67 92',
    company: 'Creative Agency',
    status: 'inactive',
    createdAt: '2024-01-12',
  },
];

export const useDashboardData = () => {
  const [products] = useState<Product[]>(mockProducts);
  const [orders] = useState<Order[]>(mockOrders);
  const [users] = useState<User[]>(mockUsers);
  const [clients] = useState<Client[]>(mockClients);

  const dashboardStats = useMemo(() => {
    // Calcul du revenu total
    const totalRevenue = orders
      .filter(order => order.status === 'delivered')
      .reduce((sum, order) => sum + order.total, 0);

    // Calcul du nombre de commandes
    const totalOrders = orders.length;

    // Calcul des clients actifs
    const activeClients = clients.filter(client => client.status === 'active').length;

    // Calcul des produits en stock
    const productsInStock = products.reduce((sum, product) => sum + product.stock, 0);

    // Données pour les graphiques
    const salesData = [
      { name: 'Jan', ventes: 4000, commandes: 24, profit: 2400 },
      { name: 'Fév', ventes: 3000, commandes: 18, profit: 1800 },
      { name: 'Mar', ventes: 5000, commandes: 32, profit: 3200 },
      { name: 'Avr', ventes: 4500, commandes: 28, profit: 2800 },
      { name: 'Mai', ventes: 6000, commandes: 38, profit: 3800 },
      { name: 'Jun', ventes: totalRevenue, commandes: totalOrders, profit: totalRevenue * 0.6 },
    ];

    const revenueData = [
      { name: 'Jan', revenue: 12000 },
      { name: 'Fév', revenue: 15000 },
      { name: 'Mar', revenue: 18000 },
      { name: 'Avr', revenue: 16000 },
      { name: 'Mai', revenue: 22000 },
      { name: 'Jun', revenue: totalRevenue },
    ];

    const productData = [
      { name: 'Informatique', value: products.filter(p => p.category === 'Informatique').length * 100, color: '#3b82f6' },
      { name: 'Téléphonie', value: products.filter(p => p.category === 'Téléphonie').length * 100, color: '#10b981' },
      { name: 'Audio', value: products.filter(p => p.category === 'Audio').length * 100, color: '#f59e0b' },
      { name: 'Autres', value: 100, color: '#ef4444' },
    ];

    // Commandes récentes
    const recentOrders = orders
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 4)
      .map(order => ({
        id: order.orderNumber,
        client: order.client,
        amount: order.total,
        status: order.status,
        time: `Il y a ${Math.floor(Math.random() * 60)} min`,
      }));

    // Produits les plus vendus (simulation basée sur les produits existants)
    const topProducts = products
      .filter(p => p.status === 'active')
      .map(product => ({
        name: product.name,
        sales: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 100000) + 20000,
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 4);

    return {
      totalRevenue,
      totalOrders,
      activeClients,
      productsInStock,
      salesData,
      revenueData,
      productData,
      recentOrders,
      topProducts,
    };
  }, [products, orders, users, clients]);

  return {
    products,
    orders,
    users,
    clients,
    dashboardStats,
  };
};
