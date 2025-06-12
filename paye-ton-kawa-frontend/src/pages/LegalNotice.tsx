
'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, Globe, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';

const LegalNotice: React.FC = () => {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center space-x-2">
          <Building className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Mentions légales</h1>
            <p className="text-muted-foreground">Informations légales obligatoires</p>
          </div>
        </div>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Building className="h-5 w-5" />
                <span>Éditeur du site</span>
              </CardTitle>
              <CardDescription>
                Informations sur l'entreprise éditrice
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Raison sociale</h3>
                  <p className="text-sm text-muted-foreground">CRM PTK SAS</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Capital social</h3>
                  <p className="text-sm text-muted-foreground">100 000 €</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">SIRET</h3>
                  <p className="text-sm text-muted-foreground">123 456 789 00012</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">RCS</h3>
                  <p className="text-sm text-muted-foreground">Paris B 123 456 789</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="h-5 w-5" />
                <span>Adresse du siège social</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">CRM PTK SAS</p>
                <p className="text-sm text-muted-foreground">123 Avenue des Champs-Élysées</p>
                <p className="text-sm text-muted-foreground">75008 Paris, France</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>Contact</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">contact@payetonkawa</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="h-4 w-4" />
                <span className="text-sm">www.payetonkawa.com</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Directeur de publication</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Jean Dupont, Président de CRM PTK SAS
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hébergement</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Ce site est hébergé par :
              </p>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">PayeTonKawa Technologies Inc.</p>
                <p className="text-sm text-muted-foreground">Rennes, BR, France</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LegalNotice;
