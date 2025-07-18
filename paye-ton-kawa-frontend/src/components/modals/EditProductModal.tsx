'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types/product';

interface EditProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
  onSubmit: () => void;
}

export const EditProductModal: React.FC<EditProductModalProps> = ({
                                                                    open,
                                                                    onOpenChange,
                                                                    product,
                                                                    onSubmit
                                                                  }) => {
  const [formData, setFormData] = useState<Omit<Product, 'id'>>({
    name: '',
    price: 0,
    description: '',
    color: '',
    stock: 0
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (product) {
      const { id, ...rest } = product;
      setFormData(rest);
    }
  }, [product]);

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!product) return;
    setIsSubmitting(true);

    try {
      await api.put(`/products/${product.id}`, formData);
      toast({ title: 'Produit mis à jour.' });
      onSubmit();
      onOpenChange(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'La modification a échoué.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!product) return null;

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Modifier le produit</DialogTitle>
            <DialogDescription>Modifiez les champs souhaités.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Nom *</Label>
              <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label>Prix (€) *</Label>
              <Input
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', parseFloat(e.target.value))}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label>Couleur</Label>
              <Input
                  value={formData.color}
                  onChange={(e) => handleInputChange('color', e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Stock *</Label>
              <Input
                  type="number"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', parseInt(e.target.value))}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Modification...' : 'Modifier'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};
