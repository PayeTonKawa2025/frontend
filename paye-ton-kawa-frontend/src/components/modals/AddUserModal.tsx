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
import { authApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

interface AddUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;  // déclenche fetchUsers côté parent
}

export const AddUserModal: React.FC<AddUserModalProps> = ({
                                                            open,
                                                            onOpenChange,
                                                            onSubmit,
                                                          }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await authApi.post('/register', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
      });

      toast({ title: "Utilisateur ajouté avec succès." });
      onSubmit();  // rafraîchir la liste des utilisateurs
      onOpenChange(false);

      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
      });
    } catch {
      toast({
        title: "Erreur",
        description: "Impossible d'ajouter l'utilisateur.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Ajouter un utilisateur</span>
              <Badge variant="outline">Nouveau</Badge>
            </DialogTitle>
            <DialogDescription>
              Remplissez les informations de l'utilisateur.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Prénom</Label>
              <Input
                  value={formData.firstName}
                  onChange={(e) => handleInputChange('firstName', e.target.value)}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label>Nom</Label>
              <Input
                  value={formData.lastName}
                  onChange={(e) => handleInputChange('lastName', e.target.value)}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  required
              />
            </div>

            <div className="space-y-2">
              <Label>Mot de passe</Label>
              <Input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  required
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Ajout en cours...' : 'Ajouter'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
  );
};
