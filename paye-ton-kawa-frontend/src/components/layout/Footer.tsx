
'use client';

import { Heart, Mail, MapPin, Phone } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Company Info */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">C</span>
              </div>
              <span className="text-base font-bold">CRM PTK</span>
            </div>
            <p className="text-muted-foreground text-xs leading-relaxed">
              La solution CRM nouvelle génération pour entreprises ambitieuses. 
              Transformez votre gestion client et accélérez votre croissance.
            </p>
            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span>contact@payetonkawa.com</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Liens rapides</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link to="/dashboard" className="hover:text-foreground transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-foreground transition-colors">
                  Produits
                </Link>
              </li>
              <li>
                <Link to="/clients" className="hover:text-foreground transition-colors">
                  Clients
                </Link>
              </li>
              <li>
                <Link to="/orders" className="hover:text-foreground transition-colors">
                  Commandes
                </Link>
              </li>
              <li>
                <Link to="/users" className="hover:text-foreground transition-colors">
                  Utilisateurs
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Légal</h3>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>
                <Link to="/privacy-policy" className="hover:text-foreground transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/terms-of-service" className="hover:text-foreground transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link to="/legal-notice" className="hover:text-foreground transition-colors">
                  Mentions légales
                </Link>
              </li>
              <li>
                <Link to="/cookies-policy" className="hover:text-foreground transition-colors">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Contact</h3>
            <div className="space-y-2 text-xs text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Phone className="h-3 w-3" />
                <span>+33 1 23 45 67 89</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-3 w-3" />
                <span>support@payetonkawa.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-3 w-3" />
                <span>Rennes, France</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-4 pt-4 flex flex-col md:flex-row justify-between items-center">
          <div className="text-xs text-muted-foreground">
            © {currentYear} CRM PTK. Tous droits réservés.
          </div>
          <div className="flex items-center space-x-1 text-xs text-muted-foreground mt-2 md:mt-0">
            <span>Développé avec</span>
            <Heart className="h-3 w-3 text-red-500" />
            <span>en France</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
