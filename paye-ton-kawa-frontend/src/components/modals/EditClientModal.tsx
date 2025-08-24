'use client';

import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Client } from '@/types/client';

interface EditClientModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  client: Client | null;
  onSubmit: (id: number, payload: Partial<Client>) => Promise<void>; // PATCH
}

export const EditClientModal: React.FC<EditClientModalProps> = ({
                                                                  open,
                                                                  onOpenChange,
                                                                  client,
                                                                  onSubmit,
                                                                }) => {
  const [form, setForm] = useState<Partial<Client>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (client) {
      setForm({
        name: client.name,
        username: client.username,
        firstName: client.firstName,
        lastName: client.lastName,
        profileFirstName: client.profileFirstName,
        profileLastName: client.profileLastName,
        postalCode: client.postalCode,
        city: client.city,
        companyName: client.companyName,
      });
    }
  }, [client]);

  if (!client) return null;

  const handle = (k: keyof Client, v: string) =>
      setForm((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSubmit(client.id, form);
    setIsSubmitting(false);
    onOpenChange(false);
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Modifier le client</DialogTitle>
            <DialogDescription>Modifiez les informations nécessaires.</DialogDescription>
          </DialogHeader>

          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nom complet</Label>
                <Input value={form.name ?? ''} onChange={(e) => handle('name', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Username</Label>
                <Input value={form.username ?? ''} onChange={(e) => handle('username', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom</Label>
                <Input value={form.firstName ?? ''} onChange={(e) => handle('firstName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nom</Label>
                <Input value={form.lastName ?? ''} onChange={(e) => handle('lastName', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Prénom (profil)</Label>
                <Input value={form.profileFirstName ?? ''} onChange={(e) => handle('profileFirstName', e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Nom (profil)</Label>
                <Input value={form.profileLastName ?? ''} onChange={(e) => handle('profileLastName', e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Code postal</Label>
                <Input value={form.postalCode ?? ''} onChange={(e) => handle('postalCode', e.target.value)} />
              </div>
              <div className="space-y-2 col-span-2">
                <Label>Ville</Label>
                <Input value={form.city ?? ''} onChange={(e) => handle('city', e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Entreprise</Label>
              <Input value={form.companyName ?? ''} onChange={(e) => handle('companyName', e.target.value)} />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Modification…' : 'Modifier'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};
