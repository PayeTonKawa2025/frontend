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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { authApi } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types/user';

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSubmit: () => void;
}

export const EditUserModal: React.FC<EditUserModalProps> = ({
                                                              open,
                                                              onOpenChange,
                                                              user,
                                                              onSubmit,
                                                            }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    role: 'user',      // Valeurs en minuscules ici
    status: 'active',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        role: Array.isArray(user.roles) && user.roles.length > 0
            ? user.roles[0]?.name.toLowerCase()
            : 'user',
        status: user.status?.toLowerCase() || 'inactive',
      });
    }
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      role: formData.role.toUpperCase(),       // "ADMIN"
      status: formData.status.toUpperCase(),   // "ACTIVE"
    };

    console.log('📤 Payload envoyé au backend :', payload);

    try {
      await authApi.put(`/users/${user.id}`, payload);

      toast({ title: 'Utilisateur mis à jour.' });
      onSubmit();
      onOpenChange(false);
    } catch (err) {
      console.error('❌ Erreur lors de la requête PUT /users/:id', err);
      toast({
        title: "Erreur",
        description: "Impossible de modifier l'utilisateur.",
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };


  if (!user) return null;

  return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <span>Modifier l'utilisateur</span>
              <Badge variant="outline">Modification</Badge>
            </DialogTitle>
            <DialogDescription>
              Modifiez les informations ci-dessous.
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Rôle</Label>
                <Select
                    value={formData.role}
                    onValueChange={(value) => handleInputChange('role', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">Utilisateur</SelectItem>
                    <SelectItem value="manager">Manager</SelectItem>
                    <SelectItem value="admin">Administrateur</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Statut</Label>
                <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Actif</SelectItem>
                    <SelectItem value="inactive">Inactif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
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
