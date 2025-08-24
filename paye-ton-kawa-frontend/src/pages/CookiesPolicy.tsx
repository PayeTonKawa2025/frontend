
'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Cookie, Settings, BarChart, Shield } from 'lucide-react';

const CookiesPolicy: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Cookie className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Politique des cookies</h1>
            <p className="text-muted-foreground">Comment nous utilisons les cookies sur notre site</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Cookie className="h-5 w-5" />
                <span>Qu'est-ce qu'un cookie ?</span>
              </CardTitle>
              <CardDescription>
                Explication des cookies et de leur utilisation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Un cookie est un petit fichier texte stocké sur votre appareil lorsque vous visitez un site web. 
                Les cookies nous permettent de reconnaître votre navigateur et de capturer et mémoriser certaines informations. 
                Ils nous aident à améliorer votre expérience sur notre site.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Cookies essentiels</span>
              </CardTitle>
              <CardDescription>
                Cookies nécessaires au fonctionnement du site
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Authentification</h3>
                <p className="text-sm text-muted-foreground">
                  Ces cookies sont nécessaires pour vous maintenir connecté et sécuriser votre session.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Préférences</h3>
                <p className="text-sm text-muted-foreground">
                  Stockent vos préférences comme le thème choisi (clair/sombre) et la langue.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BarChart className="h-5 w-5" />
                <span>Cookies d'analyse</span>
              </CardTitle>
              <CardDescription>
                Cookies pour améliorer notre service
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Analytics</h3>
                <p className="text-sm text-muted-foreground">
                  Nous utilisons des cookies d'analyse pour comprendre comment vous utilisez notre site 
                  et améliorer votre expérience.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Performance</h3>
                <p className="text-sm text-muted-foreground">
                  Ces cookies nous aident à identifier les problèmes de performance et à optimiser notre site.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Gestion des cookies</span>
              </CardTitle>
              <CardDescription>
                Comment contrôler l'utilisation des cookies
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Paramètres du navigateur</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez contrôler et/ou supprimer les cookies via les paramètres de votre navigateur. 
                  Vous pouvez supprimer tous les cookies déjà présents sur votre ordinateur et configurer 
                  la plupart des navigateurs pour qu'ils bloquent leur installation.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Impact de la désactivation</h3>
                <p className="text-sm text-muted-foreground">
                  Si vous désactivez les cookies, certaines fonctionnalités du site peuvent ne pas fonctionner 
                  correctement et votre expérience utilisateur peut être affectée.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CookiesPolicy;
