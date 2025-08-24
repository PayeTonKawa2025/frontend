'use client';

import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Client } from '@/types/client';

interface AddClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (payload: Omit<Client, 'id'>) => Promise<void>;
}

export const AddClientModal: React.FC<AddClientModalProps> = ({
                                                                open,
                                                                onOpenChange,
                                                                onSubmit,
                                                              }) => {
  const [form, setForm] = useState<Omit<Client, 'id'>>({
    name: '',
    username: '',
    firstName: '',
    lastName: '',
    profileFirstName: '',
    profileLastName: '',
    postalCode: '',
    city: '',
    companyName: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handle = (k: keyof typeof form, v: string) =>
      setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(form);
    setIsSubmitting(false);
    onOpenChange(false);
    // reset
    setForm({
      name: '',
      username: '',
      firstName: '',
      lastName: '',
      profileFirstName: '',
      profileLastName: '',
      postalCode: '',
      city: '',
      companyName: '',
    });
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Ajouter un client</span>
              <Badge variant="outline">Nouveau</Badge>
            </DialogTitle>
            <DialogDescription>Renseignez les informations du client.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={form.name} onChange={(e) => handle('name', e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={form.username} onChange={(e) => handle('username', e.target.value)} required />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input value={form.firstName} onChange={(e) => handle('firstName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={form.lastName} onChange={(e) => handle('lastName', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom (profil)</Label>
                <Input value={form.profileFirstName} onChange={(e) => handle('profileFirstName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nom (profil)</Label>
                <Input value={form.profileLastName} onChange={(e) => handle('profileLastName', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Code postal</Label>
                <Input value={form.postalCode} onChange={(e) => handle('postalCode', e.target.value)} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Ville</Label>
                <Input value={form.city} onChange={(e) => handle('city', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Entreprise</Label>
              <Input value={form.companyName} onChange={(e) => handle('companyName', e.target.value)} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ajout…' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};
