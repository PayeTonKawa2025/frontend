
'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { EditClientModal } from '@/components/modals/EditClientModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive' | 'prospect';
  totalOrders: number;
  createdAt: string;
}

const mockClients: Client[] = [
  {
    id: '1',
    name: 'Jean Dupont',
    email: 'jean.dupont@email.com',
    phone: '+33 1 23 45 67 89',
    company: 'TechCorp',
    status: 'active',
    totalOrders: 12,
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Marie Martin',
    email: 'marie.martin@email.com',
    phone: '+33 1 98 76 54 32',
    company: 'Design Studio',
    status: 'active',
    totalOrders: 8,
    createdAt: '2024-01-14',
  },
  {
    id: '3',
    name: 'Pierre Durand',
    email: 'pierre.durand@email.com',
    phone: '+33 1 11 22 33 44',
    company: 'Startup Inc',
    status: 'prospect',
    totalOrders: 0,
    createdAt: '2024-01-10',
  },
];

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>(mockClients);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null,
  });

  const columns = [
    {
      key: 'name' as keyof Client,
      header: 'Nom',
    },
    {
      key: 'email' as keyof Client,
      header: 'Email',
    },
    {
      key: 'company' as keyof Client,
      header: 'Entreprise',
    },
    {
      key: 'phone' as keyof Client,
      header: 'Téléphone',
    },
    {
      key: 'status' as keyof Client,
      header: 'Statut',
      render: (value: string) => {
        const variants = {
          active: 'default' as const,
          inactive: 'secondary' as const,
          prospect: 'outline' as const,
        };
        const labels = {
          active: 'Actif',
          inactive: 'Inactif',
          prospect: 'Prospect',
        };
        return (
          <Badge variant={variants[value as keyof typeof variants]}>
            {labels[value as keyof typeof labels]}
          </Badge>
        );
      },
    },
    {
      key: 'totalOrders' as keyof Client,
      header: 'Commandes',
    },
  ];

  const handleEdit = (client: Client) => {
    setEditModal({ open: true, client });
  };

  const handleEditClient = (updatedClient: Client) => {
    setClients(prev => prev.map(c => c.id === updatedClient.id ? updatedClient : c));
    toast({
      title: 'Client modifié',
      description: `${updatedClient.name} a été modifié avec succès.`,
    });
  };

  const handleDelete = (client: Client) => {
    setDeleteModal({ open: true, client });
  };

  const confirmDelete = () => {
    if (deleteModal.client) {
      setClients(prev => prev.filter(c => c.id !== deleteModal.client!.id));
      toast({
        title: 'Client supprimé',
        description: `${deleteModal.client.name} a été supprimé avec succès.`,
        variant: 'destructive',
      });
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddClient = (newClient: Client) => {
    setClients(prev => [...prev, newClient]);
    toast({
      title: 'Client ajouté',
      description: `${newClient.name} a été ajouté avec succès.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
            <p className="text-muted-foreground">
              Gérez votre base de clients
            </p>
          </div>
        </div>

        <DataTable
          title="Liste des clients"
          data={clients}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />

        <AddClientModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSubmit={handleAddClient}
        />

        <EditClientModal
          open={editModal.open}
          onOpenChange={(open) => setEditModal({ open, client: null })}
          client={editModal.client}
          onSubmit={handleEditClient}
        />

        <DeleteConfirmationModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, client: null })}
          onConfirm={confirmDelete}
          title="Supprimer le client"
          description="Êtes-vous sûr de vouloir supprimer ce client ? Cette action supprimera définitivement le client et toutes ses données associées."
          itemName={deleteModal.client?.name}
        />
      </div>
    </DashboardLayout>
  );
};

export default Clients;
