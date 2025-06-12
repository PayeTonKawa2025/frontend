
'use client';

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface AddOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (order: any) => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({
  open,
  onOpenChange,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    client: '',
    total: '',
    status: 'pending',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const orderNumber = `ORD-${String(Date.now()).slice(-6)}`;
    
    const newOrder = {
      id: Date.now().toString(),
      orderNumber,
      client: formData.client,
      total: parseFloat(formData.total),
      status: formData.status as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled',
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Simulation d'un appel API
    await new Promise(resolve => setTimeout(resolve, 1000));

    onSubmit(newOrder);
    setIsSubmitting(false);
    
    // Reset form
    setFormData({
      client: '',
      total: '',
      status: 'pending',
    });
    
    onOpenChange(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const mockClients = [
    'Jean Dupont',
    'Marie Martin',
    'Pierre Durand',
    'Sophie Leblanc',
    'Michel Bernard',
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <span>Créer une nouvelle commande</span>
            <Badge variant="outline">Nouveau</Badge>
          </DialogTitle>
          <DialogDescription>
            Remplissez les informations ci-dessous pour créer une nouvelle commande.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="client">Client</Label>
            <Select value={formData.client} onValueChange={(value) => handleInputChange('client', value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner un client" />
              </SelectTrigger>
              <SelectContent>
                {mockClients.map((client) => (
                  <SelectItem key={client} value={client}>
                    {client}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="total">Montant total (€)</Label>
              <Input
                id="total"
                type="number"
                step="0.01"
                placeholder="0.00"
                value={formData.total}
                onChange={(e) => handleInputChange('total', e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Statut initial</Label>
              <Select value={formData.status} onValueChange={(value) => handleInputChange('status', value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">En attente</SelectItem>
                  <SelectItem value="processing">En cours</SelectItem>
                  <SelectItem value="shipped">Expédiée</SelectItem>
                  <SelectItem value="delivered">Livrée</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">
              Un numéro de commande sera automatiquement généré après la création.
            </p>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Création en cours...' : 'Créer la commande'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
