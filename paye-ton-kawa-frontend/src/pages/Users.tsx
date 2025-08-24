'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, type Column } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { AddUserModal } from '@/components/modals/AddUserModal';
import { EditUserModal } from '@/components/modals/EditUserModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/user';
import { authApi } from '@/lib/api';

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

      // Sécurité : garantir que user.roles est toujours un tableau
      const safeUsers = res.data.map((user) => ({
        ...user,
        roles: Array.isArray(user.roles) ? user.roles : [],
        status: user.status?.toLowerCase() ?? 'inactive',
      }));

      setUsers(safeUsers);
      console.log('Utilisateurs récupérés:', safeUsers);
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

  const columns: Column<User>[] = [
    { key: 'firstName', header: 'Prénom' },
    { key: 'lastName', header: 'Nom' },
    { key: 'email', header: 'Email' },
    {
      key: 'roles',
      header: 'Rôle',
      render: (roles: User['roles']) => {
        const variants = {
          ADMIN: 'destructive',
          MANAGER: 'default',
          USER: 'secondary',
        } as const;

        if (!Array.isArray(roles) || roles.length === 0) {
          return <Badge variant="secondary">Inconnu</Badge>;
        }

        return (
            <>
              {roles.map((role: any, index: number) => {
                const name = typeof role === 'string' ? role : role?.name;

                if (!name) {
                  return (
                      <Badge key={index} variant="secondary" className="mr-1">
                        Inconnu
                      </Badge>
                  );
                }

                const variant = variants[name as keyof typeof variants] ?? 'secondary';

                return (
                    <Badge key={index} variant={variant} className="mr-1">
                      {name}
                    </Badge>
                );
              })}
            </>
        );
      },
    },
    {
      key: 'status',
      header: 'Statut',
      render: (status: User['status']) => (
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status === 'active' ? 'Actif' : 'Inactif'}
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
            onSubmit={fetchUsers}
        />

        <EditUserModal
            open={editModal.open}
            onOpenChange={(open) => setEditModal({ open, user: null })}
            user={editModal.user}
            onSubmit={fetchUsers}
        />

        <DeleteConfirmationModal
            open={deleteModal.open}
            onOpenChange={(open) => setDeleteModal({ open, user: null })}
            onConfirm={async () => {
              if (!deleteModal.user) return;
              try {
                await authApi.delete(`/users/${deleteModal.user.id}`);
                toast({ title: 'Utilisateur supprimé.' });
                fetchUsers();
              } catch {
                toast({
                  title: 'Erreur',
                  description: 'La suppression a échoué.',
                  variant: 'destructive',
                });
              }
            }}
            title="Supprimer l'utilisateur"
            description="Cette action supprimera définitivement l'utilisateur."
            itemName={deleteModal.user?.firstName}
        />
      </DashboardLayout>
  );
};

export default Users;
