'use client';

import React, { useEffect, useState } from 'react';
import PrivateRoute from '@/components/routing/PrivateRoute';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { AddUserModal } from '@/components/modals/AddUserModal';
import { EditUserModal } from '@/components/modals/EditUserModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/user';
import {authApi} from '@/lib/api';

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const res = await authApi.get<User[]>('/users');
      setUsers(res.data);
    } catch (error) {
      toast({
        title: 'Erreur',
        description: 'Impossible de récupérer les utilisateurs.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns: ({ header: string; key: string } | { header: string; key: string } | {
    header: string;
    key: string
  } | { header: string; render: (value: User["role"]) => React.JSX.Element; key: string } | {
    header: string;
    render: (value: User["status"]) => React.JSX.Element;
    key: string
  })[] = [
    { key: 'firstName', header: 'Prénom' },
    { key: 'lastName', header: 'Nom' },
    { key: 'email', header: 'Email' },
    {
      key: 'role',
      header: 'Rôle',
      render: (value: User['role']) => {
        const variants = {
          admin: 'destructive',
          manager: 'default',
          user: 'secondary',
        } as const;

        const labels = {
          admin: 'Administrateur',
          manager: 'Manager',
          user: 'Utilisateur',
        };

        return (
            <Badge variant={variants[value]}>
              {labels[value]}
            </Badge>
        );
      },
    },
    {
      key: 'status',
      header: 'Statut',
      render: (value: User['status']) => (
          <Badge variant={value === 'active' ? 'default' : 'secondary'}>
            {value === 'active' ? 'Actif' : 'Inactif'}
          </Badge>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    setEditModal({ open: true, user });
  };

  const handleDelete = (user: User) => {
    setDeleteModal({ open: true, user });
  };

  return (
      <PrivateRoute>
        <DashboardLayout>
          <DataTable
              title="Liste des utilisateurs"
              data={users}
              columns={columns}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onAdd={() => setIsAddModalOpen(true)}
              isLoading={isLoading}
          />


          <AddUserModal
              open={isAddModalOpen}
              onOpenChange={setIsAddModalOpen}
              onSubmit={() => fetchUsers()} // Rafraîchit après ajout
          />

          <EditUserModal
              open={editModal.open}
              onOpenChange={(open) => setEditModal({ open, user: null })}
              user={editModal.user}
              onSubmit={() => fetchUsers()} // Rafraîchit après édition
          />

          <DeleteConfirmationModal
              open={deleteModal.open}
              onOpenChange={(open) => setDeleteModal({ open, user: null })}
              onConfirm={async () => {
                if (!deleteModal.user) return;
                try {
                  await authApi.delete(`/users/${deleteModal.user.id}`);
                  toast({ title: "Utilisateur supprimé." });
                  fetchUsers();  // Rafraîchit la liste après suppression
                } catch {
                  toast({
                    title: "Erreur",
                    description: "La suppression a échoué.",
                    variant: "destructive",
                  });
                }
              }}
              title="Supprimer l'utilisateur"
              description="Cette action supprimera définitivement l'utilisateur."
              itemName={deleteModal.user?.firstName}
          />

        </DashboardLayout>
      </PrivateRoute>
  );
};

export default Users;
