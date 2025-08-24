'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, type Column } from '@/components/ui/data-table';
import { AddClientModal } from '@/components/modals/AddClientModal';
import { EditClientModal } from '@/components/modals/EditClientModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';
import { Client } from '@/types/client';
import { api} from '@/lib/api';

const Clients: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; client: Client | null }>({
    open: false,
    client: null,
  });

  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<Client[]>('/clients');
      console.log('Clients fetched:', res.data);
      setClients(res.data);
    } catch (e) {
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les clients.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const columns: Column<Client>[] = [
    { key: 'name', header: 'Nom complet' },
    { key: 'username', header: 'Username' },
    { key: 'firstName', header: 'Prénom' },
    { key: 'lastName', header: 'Nom' },
    { key: 'profileFirstName', header: 'Prénom (profil)' },
    { key: 'profileLastName', header: 'Nom (profil)' },
    { key: 'postalCode', header: 'Code postal' },
    { key: 'city', header: 'Ville' },
    { key: 'companyName', header: 'Entreprise' },
  ];

  const handleAdd = () => setIsAddModalOpen(true);

  const handleEdit = (client: Client) => {
    setEditModal({ open: true, client });
  };

  const handleDelete = (client: Client) => {
    setDeleteModal({ open: true, client });
  };

  return (
      <DashboardLayout>
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Clients</h2>
              <p className="text-muted-foreground">Gérez votre base de clients</p>
            </div>
          </div>

          <DataTable
              title="Liste des clients"
              data={clients}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={handleAdd}
              isLoading={isLoading}
          />

          {/* Ajout */}
          <AddClientModal
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
              onSubmit={async (payload) => {
                try {
                  await api.post('/clients', payload);
                  toast({ title: 'Client ajouté' });
                  fetchClients();
                } catch {
                  toast({
                    title: 'Erreur',
                    description: "Impossible d'ajouter le client.",
                    variant: 'destructive',
                  });
                }
              }}
          />

          {/* Edition */}
          <EditClientModal
              open={editModal.open}
              onOpenChange={(open) => setEditModal({ open, client: null })}
              client={editModal.client}
              onSubmit={async (id, payload) => {
                try {
                  await api.patch(`/clients/${id}`, payload);
                  toast({ title: 'Client modifié' });
                  fetchClients();
                } catch {
                  toast({
                    title: 'Erreur',
                    description: 'La modification a échoué.',
                    variant: 'destructive',
                  });
                }
              }}
          />

          {/* Suppression */}
          <DeleteConfirmationModal
              open={deleteModal.open}
              onOpenChange={(open) => setDeleteModal({ open, client: null })}
              onConfirm={async () => {
                if (!deleteModal.client) return;
                try {
                  await api.delete(`/clients/${deleteModal.client.id}`);
                  toast({ title: 'Client supprimé' });
                  fetchClients();
                } catch {
                  toast({
                    title: 'Erreur',
                    description: 'La suppression a échoué.',
                    variant: 'destructive',
                  });
                }
              }}
              title="Supprimer le client"
              description="Cette action supprimera définitivement le client."
              itemName={deleteModal.client?.name}
          />
        </div>
      </DashboardLayout>
  );
};

export default Clients;
