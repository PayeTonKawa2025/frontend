'use client';

import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Product } from '@/types/product';

interface AddProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
}

export const AddProductModal: React.FC<AddProductModalProps> = ({
                                                                  open,
                                                                  onOpenChange,
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

  const handleInputChange = (field: keyof Product, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await api.post('/products', formData);
      toast({ title: 'Produit ajouté avec succès.' });
      onSubmit();
      onOpenChange(false);
    } catch {
      toast({
        title: 'Erreur',
        description: 'Impossible d\'ajouter le produit.',
        variant: 'destructive'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Ajouter un nouveau produit</DialogTitle>
            <DialogDescription>Remplissez les champs pour créer un produit.</DialogDescription>
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
                {isSubmitting ? 'Ajout...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};
