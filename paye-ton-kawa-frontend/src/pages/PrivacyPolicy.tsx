
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, Lock, UserCheck } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Politique de confidentialité</h1>
            <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Eye className="h-5 w-5" />
                <span>Collecte des données</span>
              </CardTitle>
              <CardDescription>
                Comment nous collectons et utilisons vos informations personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Données collectées automatiquement</h3>
                <p className="text-sm text-muted-foreground">
                  Nous collectons automatiquement certaines informations lorsque vous utilisez notre service, 
                  notamment votre adresse IP, le type de navigateur, les pages consultées et les horodatages.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Données fournies par l'utilisateur</h3>
                <p className="text-sm text-muted-foreground">
                  Nous collectons les informations que vous nous fournissez directement, comme votre nom, 
                  adresse e-mail, et autres informations de profil nécessaires au fonctionnement du service.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Protection des données</span>
              </CardTitle>
              <CardDescription>
                Mesures de sécurité mises en place pour protéger vos informations
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Chiffrement</h3>
                <p className="text-sm text-muted-foreground">
                  Toutes les données sont chiffrées en transit et au repos à l'aide de technologies 
                  de chiffrement de niveau industriel.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Accès limité</h3>
                <p className="text-sm text-muted-foreground">
                  L'accès à vos données personnelles est strictement limité aux employés autorisés 
                  qui ont besoin de ces informations pour fournir nos services.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCheck className="h-5 w-5" />
                <span>Vos droits</span>
              </CardTitle>
              <CardDescription>
                Droits dont vous disposez concernant vos données personnelles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Droit d'accès</h3>
                <p className="text-sm text-muted-foreground">
                  Vous avez le droit de demander une copie des données personnelles que nous détenons sur vous.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Droit de rectification</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez demander la correction de données inexactes ou incomplètes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Droit à l'effacement</h3>
                <p className="text-sm text-muted-foreground">
                  Dans certaines circonstances, vous pouvez demander la suppression de vos données personnelles.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PrivacyPolicy;
