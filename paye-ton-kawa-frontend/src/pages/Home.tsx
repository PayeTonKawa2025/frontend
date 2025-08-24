
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowRight,
  BarChart3,
  CheckCircle,
  MessageSquare,
  Package,
  Shield,
  TrendingUp,
  Users
} from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  const features = [
    {
      icon: Users,
      title: "Gestion Clients",
      description: "Centralisez toutes les informations de vos clients en un seul endroit"
    },
    {
      icon: Package,
      title: "Catalogue Produits",
      description: "Gérez votre inventaire et vos produits facilement"
    },
    {
      icon: BarChart3,
      title: "Analytics Avancés",
      description: "Suivez vos performances avec des tableaux de bord intuitifs"
    },
    {
      icon: MessageSquare,
      title: "Suivi Commandes",
      description: "Pilotez vos ventes du devis à la livraison"
    }
  ];

  const benefits = [
    "Interface moderne et intuitive",
    "Tableau de bord en temps réel",
    "Gestion complète du cycle de vente",
    "Rapports et analyses détaillés",
    "Sécurité des données garantie",
    "Support technique 24/7"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">C</span>
            </div>
            <span className="text-xl font-bold text-gray-900">CRM PTK</span>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <Button variant="ghost" className="hover-scale">
                Se connecter
              </Button>
            </Link>
            <Link to="/login">
              <Button className="hover-scale">
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="animate-fade-in">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Votre CRM
              <span className="text-primary"> Nouvelle Génération</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transformez votre gestion client avec une solution complète, 
              moderne et intuitive. Augmentez vos ventes, fidélisez vos clients 
              et développez votre business.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link to="/login">
                <Button size="lg" className="hover-scale text-lg px-8 py-3">
                  Essayer gratuitement
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="hover-scale text-lg px-8 py-3">
                Voir la démo
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>14 jours gratuits</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Sans engagement</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span>Support inclus</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Fonctionnalités Puissantes
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tout ce dont vous avez besoin pour gérer efficacement 
              votre relation client et booster vos ventes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-scale border-0 shadow-lg">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center text-gray-600">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Pourquoi choisir CRM PKT ?
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Notre solution CRM a été conçue pour répondre aux besoins 
                des entreprises modernes qui veulent rester compétitives.
              </p>
              
              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <Link to="/login">
                  <Button size="lg" className="hover-scale">
                    Commencer maintenant
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <div className="bg-gradient-to-br from-primary to-purple-600 rounded-2xl p-8 text-white">
                <TrendingUp className="h-12 w-12 mb-6" />
                <h3 className="text-2xl font-bold mb-4">+150% de croissance</h3>
                <p className="text-primary-foreground/90">
                  Les entreprises utilisant notre CRM voient en moyenne 
                  une augmentation de 150% de leur taux de conversion.
                </p>
                
                <div className="mt-6 flex items-center gap-4">
                  <Shield className="h-8 w-8" />
                  <div>
                    <div className="font-semibold">Sécurité Garantie</div>
                    <div className="text-sm text-primary-foreground/80">
                      Vos données sont protégées
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-primary-foreground mb-6">
            Prêt à transformer votre business ?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'entreprises qui ont déjà fait le choix 
            de CRM PKT pour accélérer leur croissance.
          </p>
          
          <Link to="/login">
            <Button size="lg" variant="secondary" className="hover-scale text-lg px-8 py-3">
              Essayer gratuitement
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold">C</span>
            </div>
            <span className="text-lg font-bold">CRM PKT</span>
          </div>
          
          <p className="text-gray-400 mb-4">
            La solution CRM nouvelle génération pour entreprises ambitieuses.
          </p>
          
          <div className="flex justify-center gap-8 text-sm text-gray-400">
            <span>© 2024 CRM PTK. Tous droits réservés.</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
