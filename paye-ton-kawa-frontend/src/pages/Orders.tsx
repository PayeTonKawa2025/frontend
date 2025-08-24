'use client';

import React, { useState } from 'react';
import PrivateRoute from '@/components/routing/PrivateRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { AddOrderModal } from '@/components/modals/AddOrderModal';
import { EditOrderModal } from '@/components/modals/EditOrderModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';

interface Order {
  id: string;
  orderNumber: string;
  client: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
}

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
];

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; order: Order | null }>({
    open: false,
    order: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; order: Order | null }>({
    open: false,
    order: null,
  });

  const columns = [
    { key: 'orderNumber' as keyof Order, header: 'N° Commande' },
    { key: 'client' as keyof Order, header: 'Client' },
    {
      key: 'total' as keyof Order,
      header: 'Total',
      render: (value: number) => `€${value.toFixed(2)}`,
    },
    {
      key: 'status' as keyof Order,
      header: 'Statut',
      render: (value: string) => {
        const variants = {
          pending: 'outline' as const,
          processing: 'secondary' as const,
          shipped: 'default' as const,
          delivered: 'default' as const,
          cancelled: 'destructive' as const,
        };
        const labels = {
          pending: 'En attente',
          processing: 'En cours',
          shipped: 'Expédiée',
          delivered: 'Livrée',
          cancelled: 'Annulée',
        };
        return (
            <Badge variant={variants[value as keyof typeof variants]}>
              {labels[value as keyof typeof labels]}
            </Badge>
        );
      },
    },
    {
      key: 'createdAt' as keyof Order,
      header: 'Date',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    },
  ];

  const handleEdit = (order: Order) => {
    setEditModal({ open: true, order });
  };

  const handleEditOrder = (updatedOrder: Order) => {
    setOrders(prev => prev.map(o => o.id === updatedOrder.id ? updatedOrder : o));
    toast({
      title: 'Commande modifiée',
      description: `${updatedOrder.orderNumber} a été modifiée avec succès.`,
    });
  };

  const handleDelete = (order: Order) => {
    setDeleteModal({ open: true, order });
  };

  const confirmDelete = () => {
    if (deleteModal.order) {
      setOrders(prev => prev.filter(o => o.id !== deleteModal.order!.id));
      toast({
        title: 'Commande supprimée',
        description: `${deleteModal.order.orderNumber} a été supprimée avec succès.`,
        variant: 'destructive',
      });
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddOrder = (newOrder: Order) => {
    setOrders(prev => [...prev, newOrder]);
    toast({
      title: 'Commande créée',
      description: `${newOrder.orderNumber} a été créée avec succès.`,
    });
  };

  return (
      <PrivateRoute>
        <DashboardLayout>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Commandes</h2>
                <p className="text-muted-foreground">
                  Gérez toutes vos commandes
                </p>
              </div>
            </div>

            <DataTable
                title="Liste des commandes"
                data={orders}
                columns={columns}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAdd={handleAdd}
            />

            <AddOrderModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={handleAddOrder}
            />

            <EditOrderModal
                open={editModal.open}
                onOpenChange={(open) => setEditModal({ open, order: null })}
                order={editModal.order}
                onSubmit={handleEditOrder}
            />

            <DeleteConfirmationModal
                open={deleteModal.open}
                onOpenChange={(open) => setDeleteModal({ open, order: null })}
                onConfirm={confirmDelete}
                title="Supprimer la commande"
                description="Êtes-vous sûr de vouloir supprimer cette commande ? Cette action supprimera définitivement la commande et toutes ses données associées."
                itemName={deleteModal.order?.orderNumber}
            />
          </div>
        </DashboardLayout>
      </PrivateRoute>
  );
};

export default Orders;
