'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { AddUserModal } from '@/components/modals/AddUserModal';
import { EditUserModal } from '@/components/modals/EditUserModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'user';
  status: 'active' | 'inactive';
  lastLogin: string;
  createdAt: string;
}

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

const Users: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; user: User | null }>({
    open: false,
    user: null,
  });

  const columns = [
    {
      key: 'name' as keyof User,
      header: 'Nom',
    },
    {
      key: 'email' as keyof User,
      header: 'Email',
    },
    {
      key: 'role' as keyof User,
      header: 'Rôle',
      render: (value: string) => {
        const variants = {
          admin: 'destructive' as const,
          manager: 'default' as const,
          user: 'secondary' as const,
        };
        const labels = {
          admin: 'Administrateur',
          manager: 'Manager',
          user: 'Utilisateur',
        };
        return (
          <Badge variant={variants[value as keyof typeof variants]}>
            {labels[value as keyof typeof labels]}
          </Badge>
        );
      },
    },
    {
      key: 'status' as keyof User,
      header: 'Statut',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
    {
      key: 'lastLogin' as keyof User,
      header: 'Dernière connexion',
      render: (value: string) => new Date(value).toLocaleDateString('fr-FR'),
    },
  ];

  const handleEdit = (user: User) => {
    setEditModal({ open: true, user });
  };

  const handleEditUser = (updatedUser: User) => {
    setUsers(prev => prev.map(u => u.id === updatedUser.id ? updatedUser : u));
    toast({
      title: 'Utilisateur modifié',
      description: `${updatedUser.name} a été modifié avec succès.`,
    });
  };

  const handleDelete = (user: User) => {
    setDeleteModal({ open: true, user });
  };

  const confirmDelete = () => {
    if (deleteModal.user) {
      setUsers(prev => prev.filter(u => u.id !== deleteModal.user!.id));
      toast({
        title: 'Utilisateur supprimé',
        description: `${deleteModal.user.name} a été supprimé avec succès.`,
        variant: 'destructive',
      });
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddUser = (newUser: User) => {
    setUsers(prev => [...prev, newUser]);
    toast({
      title: 'Utilisateur ajouté',
      description: `${newUser.name} a été ajouté avec succès.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Utilisateurs</h2>
            <p className="text-muted-foreground">
              Gérez les utilisateurs du système
            </p>
          </div>
        </div>

        <DataTable
          title="Liste des utilisateurs"
          data={users}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />

        <AddUserModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSubmit={handleAddUser}
        />

        <EditUserModal
          open={editModal.open}
          onOpenChange={(open) => setEditModal({ open, user: null })}
          user={editModal.user}
          onSubmit={handleEditUser}
        />

        <DeleteConfirmationModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, user: null })}
          onConfirm={confirmDelete}
          title="Supprimer l'utilisateur"
          description="Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action supprimera définitivement l'utilisateur et révoquera tous ses accès."
          itemName={deleteModal.user?.name}
        />
      </div>
    </DashboardLayout>
  );
};

export default Users;
