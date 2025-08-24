'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';

import { Order, ApiOrder, fromApiOrder } from '@/types/Order';
import { AddOrderModal } from '@/components/modals/AddOrderModal';
import { EditOrderModal } from '@/components/modals/EditOrderModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { useAuth } from '@/contexts/AuthContext';

interface Client {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

const Orders: React.FC = () => {
  const { user } = useAuth();
  const isAdmin = user?.roles.includes('ADMIN');

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; order: Order | null }>({ open: false, order: null });

  const clientLabel = (c: Client) =>
      c.name || [c.firstName, c.lastName].filter(Boolean).join(' ') || c.companyName || c.id;

  const fetchClients = async () => {
    try {
      const res = await api.get<Client[]>('/clients');
      setClients(res.data);
      if (res.data.length === 1) {
        setSelectedClientId(String(res.data[0].id));
      }
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les clients.', variant: 'destructive' });
    }
  };

  const fetchOrders = async (clientId: string) => {
    if (!clientId) return;
    setIsLoading(true);
    try {
      const res = await api.get<ApiOrder[]>(`/orders/${clientId}`);
      setOrders(res.data.map(fromApiOrder));
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de récupérer les commandes.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    if (selectedClientId) fetchOrders(selectedClientId);
  }, [selectedClientId]);

  const onCreatedOrUpdated = () => {
    if (selectedClientId) fetchOrders(selectedClientId);
  };

  const confirmDelete = async () => {
    if (!deleteModal.order?.id) return;
    try {
      await api.delete(`/orders/${deleteModal.order.id}`);
      toast({ title: 'Commande supprimée.' });
      onCreatedOrUpdated();
    } catch {
      toast({ title: 'Erreur', description: 'La suppression a échoué.', variant: 'destructive' });
    } finally {
      setDeleteModal({ open: false, order: null });
    }
  };

  const columns = useMemo(
      () => [
        {
          key: 'id' as keyof Order,
          header: 'ID',
        },
        {
          key: 'createdAt' as keyof Order,
          header: 'Créée le',
          render: (value: number | undefined) =>
              value ? new Date(value).toLocaleString('fr-FR') : '—',
        },
        {
          key: 'items' as keyof Order,
          header: 'Articles',
          render: (items: Order['items']) => (items || []).length,
        },
        {
          key: 'total' as unknown as keyof Order,
          header: 'Total (€)',
          render: (_: unknown, row: Order) => {
            const total = (row.items || []).reduce(
                (acc, it) => acc + (it.unitPrice || 0) * (it.quantity || 0),
                0
            );
            return `€${total.toFixed(2)}`;
          },
        },
        {
          key: 'client' as unknown as keyof Order,
          header: 'Client',
          render: () => {
            const c = clients.find((x) => String(x.id) === String(selectedClientId));
            return c ? clientLabel(c) : selectedClientId;
          },
        },
        {
          key: 'status' as unknown as keyof Order,
          header: 'Statut',
          render: (_: unknown, row: Order) => <StatusBadge status={row.status} />,
        },
      ],
      [clients, selectedClientId]
  );

  return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Commandes</h2>
              <p className="text-muted-foreground">Gérez les commandes par client</p>
            </div>

            <div className="flex items-center gap-3">
              <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                <SelectTrigger className="w-[260px]">
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {clientLabel(c)}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                  onClick={() => {
                    if (!selectedClientId) {
                      toast({
                        title: 'Sélection requise',
                        description: 'Choisissez un client avant de créer une commande.',
                        variant: 'destructive',
                      });
                      return;
                    }
                    setIsAddModalOpen(true);
                  }}
                  disabled={!selectedClientId}
              >
                Nouvelle commande
              </Button>
            </div>
          </div>

          <DataTable
              title={selectedClientId ? 'Commandes du client' : 'Sélectionnez un client'}
              data={orders}
              columns={columns}
              isLoading={isLoading}
              onEdit={(order) => setEditModal({ open: true, order })}
              onDelete={isAdmin ? (order) => setDeleteModal({ open: true, order }) : undefined}
          />

          <AddOrderModal
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
              defaultClientId={selectedClientId || ''}
              onCreated={onCreatedOrUpdated}
          />

          <EditOrderModal
              open={editModal.open}
              onOpenChange={(open) => setEditModal({ open, order: null })}
              order={editModal.order}
              onUpdated={onCreatedOrUpdated}
          />

          {isAdmin && (
              <DeleteConfirmationModal
                  open={deleteModal.open}
                  onOpenChange={(open) => setDeleteModal({ open, order: null })}
                  onConfirm={confirmDelete}
                  title="Supprimer la commande"
                  description="Cette action est irréversible."
                  itemName={`Commande #${deleteModal.order?.id}`}
              />
          )}
        </div>
      </DashboardLayout>
  );
};

export default Orders;
