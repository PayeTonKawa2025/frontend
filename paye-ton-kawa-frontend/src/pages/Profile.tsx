'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { Edit, Settings, User } from 'lucide-react';

const Profile: React.FC = () => {
    const { user, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '+33 1 23 45 67 89',
        department: 'Administration',
        position: 'Administrateur système',
        location: 'Paris, France',
    });

    const [passwordData, setPasswordData] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });


    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email || '',
                phone: '+33 1 23 45 67 89',
                department: 'Administration',
                position: 'Administrateur système',
                location: 'Paris, France',
            });
        }
    }, [user]);

    const getUserInitials = () => {
        if (!user?.firstName || !user?.lastName) return 'U';
        return (user.firstName[0] + user.lastName[0]).toUpperCase();
    };

    const handleChangePassword = async () => {
        setIsLoading(true);

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            toast({
                title: "Erreur",
                description: "Les mots de passe ne correspondent pas.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }

        try {
            await fetch('/api/auth/change-password', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(passwordData),
            });

            toast({
                title: "Mot de passe modifié",
                description: "Votre mot de passe a été mis à jour avec succès.",
            });

            // Reset form
            setPasswordData({
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            });
        } catch (err) {
            toast({
                title: "Erreur",
                description: "Échec de la mise à jour du mot de passe.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };


    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateProfile(formData.firstName, formData.lastName);
            toast({
                title: 'Profil mis à jour',
                description: 'Vos informations ont été sauvegardées avec succès.',
            });
        } catch (err) {
            toast({
                title: 'Erreur',
                description: 'Impossible de mettre à jour le profil.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
            setIsEditing(false);
        }
    };


    if (!user) {
        return (
            <DashboardLayout>
                <p className="text-center text-muted-foreground">Chargement du profil...</p>
            </DashboardLayout>
        );
    }

    return (

        <DashboardLayout key={user?.id}>
            <div className="space-y-6">
                <h2 className="text-3xl font-bold tracking-tight">Mon Profil</h2>
                <p className="text-muted-foreground">Gérez vos informations personnelles</p>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Carte de profil */}
                    <Card className="lg:col-span-1">
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={user.avatar} alt={user.firstName} />
                                    <AvatarFallback className="text-lg">{getUserInitials()}</AvatarFallback>
                                </Avatar>
                            </div>
                            <CardTitle>{user.firstName} {user.lastName}</CardTitle>
                            <p className="text-muted-foreground">{user.email}</p>

                            <Badge variant="default" className="mt-2">
                                {(user.roles as string[]).join(', ') || 'Inconnu'}
                            </Badge>

                            {user.status && (
                                <Badge
                                    variant={user.status?.toLowerCase() === 'active' ? 'default' : 'secondary'}
                                    className="mt-1"
                                >
                                    {user.status?.toLowerCase() === 'active' ? 'Actif' : 'Inactif'}
                                </Badge>
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
        Membre depuis {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'inconnu'}
      </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Settings className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">
        Dernière connexion : {user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'inconnue'}
      </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Changer le mot de passe</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Mot de passe actuel</Label>
                                <Input
                                    type="password"
                                    value={passwordData.oldPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, oldPassword: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Nouveau mot de passe</Label>
                                <Input
                                    type="password"
                                    value={passwordData.newPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, newPassword: e.target.value })
                                    }
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Confirmer le mot de passe</Label>
                                <Input
                                    type="password"
                                    value={passwordData.confirmPassword}
                                    onChange={(e) =>
                                        setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                                    }
                                />
                            </div>
                            <Button onClick={handleChangePassword} disabled={isLoading}>
                                {isLoading ? "Mise à jour..." : "Changer le mot de passe"}
                            </Button>
                        </CardContent>
                    </Card>


                    {/* Informations détaillées */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Informations personnelles</CardTitle>
                            <Button
                                variant={isEditing ? "destructive" : "outline"}
                                onClick={() => setIsEditing(!isEditing)}
                            >
                                <Edit className="h-4 w-4 mr-2" />
                                {isEditing ? 'Annuler' : 'Modifier'}
                            </Button>
                        </CardHeader>

                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Prénom</Label>
                                    <Input
                                        value={formData.firstName}
                                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Nom</Label>
                                    <Input
                                        value={formData.lastName}
                                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={formData.email}
                                        readOnly
                                        disabled
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Téléphone</Label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Département</Label>
                                    <Input
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Poste</Label>
                                    <Input
                                        value={formData.position}
                                        onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Localisation</Label>
                                    <Input
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            {isEditing && (
                                <div className="flex justify-end space-x-2 mt-6">
                                    <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
                                        Annuler
                                    </Button>
                                    <Button onClick={handleSave} disabled={isLoading}>
                                        {isLoading ? 'Sauvegarde...' : 'Sauvegarder'}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Statistiques */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Produits gérés</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">127</div>
                            <p className="text-xs text-muted-foreground">+12% ce mois-ci</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Clients actifs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">89</div>
                            <p className="text-xs text-muted-foreground">+7% ce mois-ci</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Commandes traitées</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">245</div>
                            <p className="text-xs text-muted-foreground">+23% ce mois-ci</p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;
