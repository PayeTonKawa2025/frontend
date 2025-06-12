
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, CreditCard, FileText, Users } from 'lucide-react';
import React from 'react';

const TermsOfService: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Conditions d'utilisation</h1>
            <p className="text-muted-foreground">Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Acceptation des conditions</span>
              </CardTitle>
              <CardDescription>
                En utilisant notre service, vous acceptez ces conditions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                En accédant et en utilisant CRM PKT, vous acceptez d'être lié par ces conditions d'utilisation. 
                Si vous n'acceptez pas ces conditions, vous ne devez pas utiliser notre service.
              </p>
              <p className="text-sm text-muted-foreground">
                Nous nous réservons le droit de modifier ces conditions à tout moment. 
                Les modifications entreront en vigueur dès leur publication sur cette page.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <CreditCard className="h-5 w-5" />
                <span>Utilisation du service</span>
              </CardTitle>
              <CardDescription>
                Règles d'utilisation acceptable de notre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Utilisation autorisée</h3>
                <p className="text-sm text-muted-foreground">
                  Vous pouvez utiliser notre service uniquement à des fins légales et conformément à ces conditions. 
                  Vous vous engagez à ne pas utiliser le service d'une manière qui pourrait endommager, 
                  désactiver ou compromettre le service.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Compte utilisateur</h3>
                <p className="text-sm text-muted-foreground">
                  Vous êtes responsable de maintenir la confidentialité de votre compte et mot de passe. 
                  Vous acceptez la responsabilité de toutes les activités qui se produisent sous votre compte.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Limitations de responsabilité</span>
              </CardTitle>
              <CardDescription>
                Limites de notre responsabilité légale
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Disponibilité du service</h3>
                <p className="text-sm text-muted-foreground">
                  Nous nous efforçons de maintenir le service disponible, mais nous ne garantissons pas 
                  qu'il sera toujours accessible, ininterrompu ou exempt d'erreurs.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Limitation des dommages</h3>
                <p className="text-sm text-muted-foreground">
                  En aucun cas nous ne serons responsables des dommages indirects, accessoires, 
                  spéciaux ou consécutifs résultant de l'utilisation ou de l'impossibilité d'utiliser le service.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default TermsOfService;
