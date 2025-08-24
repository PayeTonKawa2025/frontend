'use client';

import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { api } from '@/lib/api';
import { Product } from '@/types/Product';
import { Order, OrderItem, toApiOrder, calcOrderTotal } from '@/types/Order';

interface Client {
  id: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
}

interface AddOrderModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: () => void;
}

export const AddOrderModal: React.FC<AddOrderModalProps> = ({ open, onOpenChange, onCreated }) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [clientId, setClientId] = useState('');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClients = async () => {
    try {
      const res = await api.get<Client[]>('/clients');
      setClients(res.data);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les clients', variant: 'destructive' });
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await api.get<Product[]>('/products');
      setProducts(res.data);
    } catch {
      toast({ title: 'Erreur', description: 'Impossible de charger les produits', variant: 'destructive' });
    }
  };

  useEffect(() => {
    if (open) {
      fetchClients();
      fetchProducts();
    }
  }, [open]);

  const addItem = () => {
    setItems(prev => [...prev, { productId: 0, quantity: 1, unitPrice: 0 }]);
  };

  const updateItem = (index: number, field: keyof OrderItem, value: any) => {
    setItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };

      if (field === 'productId') {
        const product = products.find(p => p.id === Number(value));
        if (product) {
          updated[index].unitPrice = product.price;
        }
      }
      return updated;
    });
  };

  const removeItem = (index: number) => {
    setItems(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientId || items.length === 0) {
      toast({ title: 'Erreur', description: 'Veuillez sélectionner un client et au moins un produit', variant: 'destructive' });
      return;
    }
    setIsSubmitting(true);

    const order: Order = { clientId, items };
    try {
      await api.post('/orders', toApiOrder(order));
      toast({ title: 'Commande créée' });
      onCreated();
      onOpenChange(false);
    } catch {
      toast({ title: 'Erreur', description: 'Création échouée', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Nouvelle commande</DialogTitle>
            <DialogDescription>Créez une commande avec un client et plusieurs produits.</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Sélection client */}
            <div className="space-y-2">
              <Label>Client</Label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger>
                  <SelectValue placeholder="Sélectionner un client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map(c => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name || `${c.firstName} ${c.lastName}` || c.companyName}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Produits */}
            <div className="space-y-3">
              {items.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-3 items-end">
                    <Select
                        value={item.productId ? String(item.productId) : ''}
                        onValueChange={(v) => updateItem(idx, 'productId', Number(v))}
                    >
                      <SelectTrigger><SelectValue placeholder="Produit" /></SelectTrigger>
                      <SelectContent>
                        {products.map(p => (
                            <SelectItem key={p.id} value={String(p.id)}>
                              {p.name} (€{p.price})
                            </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => updateItem(idx, 'quantity', Number(e.target.value))}
                    />

                    <Input
                        type="number"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => updateItem(idx, 'unitPrice', Number(e.target.value))}
                    />

                    <Button type="button" variant="destructive" onClick={() => removeItem(idx)}>Supprimer</Button>
                  </div>
              ))}
              <Button type="button" variant="outline" onClick={addItem}>Ajouter un produit</Button>
            </div>

            {/* Total */}
            <div className="p-4 bg-muted rounded-lg font-semibold">
              Total : €{calcOrderTotal({ clientId, items }).toFixed(2)}
            </div>

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Création...' : 'Créer la commande'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};
