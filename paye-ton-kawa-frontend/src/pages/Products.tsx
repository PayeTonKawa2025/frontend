'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { EditProductModal } from '@/components/modals/EditProductModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { api } from '@/lib/api';
import { useAuth } from '@/contexts/AuthContext'; // ✅ Import du contexte

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: Product | null }>({ open: false, product: null });

  const { user } = useAuth(); // ✅ Récupération de l'utilisateur connecté
  const isAdmin = user?.roles.includes('ADMIN'); // ✅ Check rôle ADMIN

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await api.get<Product[]>('/products');
      setProducts(res.data);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de récupérer les produits.', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteModal.product) return;
    try {
      await api.delete(`/products/${deleteModal.product.id}`);
      toast({ title: 'Produit supprimé.' });
      fetchProducts();
    } catch {
      toast({ title: 'Erreur', description: 'La suppression a échoué.', variant: 'destructive' });
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const columns = [
    { key: 'name', header: 'Nom' },
    { key: 'price', header: 'Prix (€)', render: (value: number) => `€${value.toFixed(2)}` },
    { key: 'stock', header: 'Stock' },
    { key: 'color', header: 'Couleur' },
    { key: 'description', header: 'Description' },
  ];

  return (
      <DashboardLayout>
        <DataTable
            title="Liste des produits"
            data={products}
            columns={columns}
            isLoading={isLoading}
            onEdit={isAdmin ? (product) => setEditModal({ open: true, product }) : undefined} // ✅ restreint
            onDelete={isAdmin ? (product) => setDeleteModal({ open: true, product }) : undefined} // ✅ restreint
            onAdd={isAdmin ? () => setIsAddModalOpen(true) : undefined} // ✅ restreint
        />

        {isAdmin && (
            <AddProductModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onSubmit={fetchProducts}
            />
        )}

        <EditProductModal
            open={editModal.open}
            onOpenChange={(open) => setEditModal({ open, product: null })}
            product={editModal.product}
            onSubmit={fetchProducts}
        />

        <DeleteConfirmationModal
            open={deleteModal.open}
            onOpenChange={(open) => setDeleteModal({ open, product: null })}
            onConfirm={confirmDelete}
            title="Supprimer le produit"
            description="Cette action est irréversible."
            itemName={deleteModal.product?.name}
        />
      </DashboardLayout>
  );
};

export default Products;
