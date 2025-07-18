'use client';

import React, { useState, useEffect } from 'react';
import PrivateRoute from '@/components/routing/PrivateRoute';
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
    const { user } = useAuth();
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

    const handleSave = async () => {
        setIsLoading(true);

        // Ici tu peux faire un appel API réel
        await new Promise(resolve => setTimeout(resolve, 1000));

        setIsLoading(false);
        setIsEditing(false);

        toast({
            title: 'Profil mis à jour',
            description: 'Vos informations ont été sauvegardées avec succès.',
        });
    };

    if (!user) {
        return (
            <PrivateRoute>
                <DashboardLayout>
                    <p className="text-center text-muted-foreground">Chargement du profil...</p>
                </DashboardLayout>
            </PrivateRoute>
        );
    }

    return (
        <PrivateRoute>
            <DashboardLayout>
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
                                    {user.role === 'admin' ? 'Administrateur' : 'Utilisateur'}
                                </Badge>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="flex items-center space-x-2">
                                        <User className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Membre depuis janvier 2024</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Settings className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">Dernière connexion : Aujourd'hui</span>
                                    </div>
                                </div>
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
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            disabled={!isEditing}
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
        </PrivateRoute>
    );
};

export default Profile;
