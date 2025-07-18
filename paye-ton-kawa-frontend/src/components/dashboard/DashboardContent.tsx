
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDashboardData } from '@/hooks/useDashboardData';
import {
    Calendar,
    Clock,
    DollarSign,
    Mail,
    Package,
    ShoppingCart,
    TrendingDown,
    TrendingUp,
    Users
} from 'lucide-react';
import React from 'react';
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

const Dashboard: React.FC = () => {
    const { dashboardStats } = useDashboardData();

    const stats = [
        {
            title: 'Revenus totaux',
            value: `€${dashboardStats.totalRevenue.toLocaleString('fr-FR', { minimumFractionDigits: 2 })}`,
            change: '+20.1% par rapport au mois dernier',
            positive: true,
            icon: DollarSign,
            color: 'text-green-600',
        },
        {
            title: 'Commandes',
            value: dashboardStats.totalOrders.toString(),
            change: '+12.5% par rapport au mois dernier',
            positive: true,
            icon: ShoppingCart,
            color: 'text-blue-600',
        },
        {
            title: 'Clients actifs',
            value: dashboardStats.activeClients.toString(),
            change: '+3.2% par rapport au mois dernier',
            positive: true,
            icon: Users,
            color: 'text-purple-600',
        },
        {
            title: 'Produits en stock',
            value: dashboardStats.productsInStock.toString(),
            change: dashboardStats.productsInStock > 100 ? '+2.8% par rapport au mois dernier' : '-0.8% par rapport au mois dernier',
            positive: dashboardStats.productsInStock > 100,
            icon: Package,
            color: 'text-orange-600',
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'delivered': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'shipped': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'completed': return 'Terminée';
            case 'delivered': return 'Livrée';
            case 'pending': return 'En attente';
            case 'shipped': return 'Expédiée';
            case 'processing': return 'En cours';
            default: return status;
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                        <p className="text-muted-foreground">
                            Aperçu de vos données commerciales
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                            <Calendar className="h-4 w-4 mr-2" />
                            Aujourd'hui
                        </Button>
                        <Button variant="outline" size="sm">
                            Exporter
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat, index) => {
                        const IconComponent = stat.icon;
                        return (
                            <Card key={index} className="hover-scale">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                    <CardTitle className="text-sm font-medium">
                                        {stat.title}
                                    </CardTitle>
                                    <IconComponent className={`h-5 w-5 ${stat.color}`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                    <div className="flex items-center space-x-1">
                                        {stat.positive ? (
                                            <TrendingUp className="h-3 w-3 text-green-600" />
                                        ) : (
                                            <TrendingDown className="h-3 w-3 text-red-600" />
                                        )}
                                        <p className={`text-xs ${
                                            stat.positive ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                            {stat.change}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        );
                    })}
                </div>

                {/* Charts Row */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Revenue Chart */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle>Évolution des revenus</CardTitle>
                            <CardDescription>
                                Revenus des 6 derniers mois
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <AreaChart data={dashboardStats.revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip formatter={(value) => [`€${value}`, 'Revenus']} />
                                    <Area type="monotone" dataKey="revenue" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </Card>

                    {/* Product Distribution */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Répartition des produits</CardTitle>
                            <CardDescription>
                                Ventes par catégorie
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={dashboardStats.productData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {dashboardStats.productData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="mt-4 space-y-2">
                                {dashboardStats.productData.map((item, index) => (
                                    <div key={index} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center space-x-2">
                                            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                                            <span>{item.name}</span>
                                        </div>
                                        <span className="font-medium">{item.value}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sales Performance Chart */}
                <Card>
                    <CardHeader>
                        <CardTitle>Performance des ventes</CardTitle>
                        <CardDescription>
                            Ventes, commandes et profits des 6 derniers mois
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart data={dashboardStats.salesData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="ventes" fill="#3b82f6" name="Ventes" />
                                <Bar dataKey="commandes" fill="#10b981" name="Commandes" />
                                <Bar dataKey="profit" fill="#f59e0b" name="Profit" />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Bottom Row - Recent Orders and Top Products */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Recent Orders */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Commandes récentes</CardTitle>
                            <CardDescription>
                                Dernières commandes reçues
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardStats.recentOrders.map((order, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{order.id}</p>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{order.client}</p>
                                            <div className="flex items-center justify-between mt-1">
                                                <p className="text-sm font-medium">€{order.amount}</p>
                                                <p className="text-xs text-muted-foreground flex items-center">
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    {order.time}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Top Products */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Produits les plus vendus</CardTitle>
                            <CardDescription>
                                Classement par nombre de ventes
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {dashboardStats.topProducts.map((product, index) => (
                                    <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between">
                                                <p className="font-medium">{product.name}</p>
                                                <Badge variant="secondary">#{index + 1}</Badge>
                                            </div>
                                            <div className="flex items-center justify-between mt-2">
                                                <p className="text-sm text-muted-foreground">{product.sales} ventes</p>
                                                <p className="text-sm font-medium">€{product.revenue.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                    <CardHeader>
                        <CardTitle>Actions rapides</CardTitle>
                        <CardDescription>
                            Raccourcis vers les tâches courantes
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                            <Button className="h-20 flex-col space-y-2" variant="outline">
                                <Users className="h-6 w-6" />
                                <span>Ajouter un client</span>
                            </Button>
                            <Button className="h-20 flex-col space-y-2" variant="outline">
                                <Package className="h-6 w-6" />
                                <span>Nouveau produit</span>
                            </Button>
                            <Button className="h-20 flex-col space-y-2" variant="outline">
                                <ShoppingCart className="h-6 w-6" />
                                <span>Créer commande</span>
                            </Button>
                            <Button className="h-20 flex-col space-y-2" variant="outline">
                                <Mail className="h-6 w-6" />
                                <span>Envoyer email</span>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
