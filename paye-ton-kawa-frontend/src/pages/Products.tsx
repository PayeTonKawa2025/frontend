
'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable } from '@/components/ui/data-table';
import { Badge } from '@/components/ui/badge';
import { AddProductModal } from '@/components/modals/AddProductModal';
import { EditProductModal } from '@/components/modals/EditProductModal';
import { DeleteConfirmationModal } from '@/components/modals/DeleteConfirmationModal';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
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
];

const Products: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editModal, setEditModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; product: Product | null }>({
    open: false,
    product: null,
  });

  const columns = [
    {
      key: 'name' as keyof Product,
      header: 'Nom',
    },
    {
      key: 'category' as keyof Product,
      header: 'Catégorie',
    },
    {
      key: 'price' as keyof Product,
      header: 'Prix',
      render: (value: number) => `€${value.toFixed(2)}`,
    },
    {
      key: 'stock' as keyof Product,
      header: 'Stock',
      render: (value: number) => (
        <span className={value === 0 ? 'text-destructive' : 'text-foreground'}>
          {value}
        </span>
      ),
    },
    {
      key: 'status' as keyof Product,
      header: 'Statut',
      render: (value: string) => (
        <Badge variant={value === 'active' ? 'default' : 'secondary'}>
          {value === 'active' ? 'Actif' : 'Inactif'}
        </Badge>
      ),
    },
  ];

  const handleEdit = (product: Product) => {
    setEditModal({ open: true, product });
  };

  const handleEditProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    toast({
      title: 'Produit modifié',
      description: `${updatedProduct.name} a été modifié avec succès.`,
    });
  };

  const handleDelete = (product: Product) => {
    setDeleteModal({ open: true, product });
  };

  const confirmDelete = () => {
    if (deleteModal.product) {
      setProducts(prev => prev.filter(p => p.id !== deleteModal.product!.id));
      toast({
        title: 'Produit supprimé',
        description: `${deleteModal.product.name} a été supprimé avec succès.`,
        variant: 'destructive',
      });
    }
  };

  const handleAdd = () => {
    setIsAddModalOpen(true);
  };

  const handleAddProduct = (newProduct: Product) => {
    setProducts(prev => [...prev, newProduct]);
    toast({
      title: 'Produit ajouté',
      description: `${newProduct.name} a été ajouté avec succès.`,
    });
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Produits</h2>
            <p className="text-muted-foreground">
              Gérez votre catalogue de produits
            </p>
          </div>
        </div>

        <DataTable
          title="Liste des produits"
          data={products}
          columns={columns}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAdd={handleAdd}
        />

        <AddProductModal
          open={isAddModalOpen}
          onOpenChange={setIsAddModalOpen}
          onSubmit={handleAddProduct}
        />

        <EditProductModal
          open={editModal.open}
          onOpenChange={(open) => setEditModal({ open, product: null })}
          product={editModal.product}
          onSubmit={handleEditProduct}
        />

        <DeleteConfirmationModal
          open={deleteModal.open}
          onOpenChange={(open) => setDeleteModal({ open, product: null })}
          onConfirm={confirmDelete}
          title="Supprimer le produit"
          description="Êtes-vous sûr de vouloir supprimer ce produit ? Cette action supprimera définitivement le produit de votre catalogue."
          itemName={deleteModal.product?.name}
        />
      </div>
    </DashboardLayout>
  );
};

export default Products;
