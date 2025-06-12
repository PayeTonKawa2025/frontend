
'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Sparkles, Shield, Zap } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthFormProps {
  mode: 'login' | 'register';
  onToggleMode: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ mode, onToggleMode }) => {
  const [error, setError] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { login, register, isLoading, user } = useAuth();
  const navigate = useNavigate();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(mode === 'login' ? loginSchema : registerSchema),
  });

  useEffect(() => {
    if (user) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const onSubmit = async (data: RegisterFormData) => {
    setError('');
    try {
      if (mode === 'login') {
        await login(data.email, data.password);
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre CRM !",
        });
      } else {
        await register(data.email, data.password, data.name);
        toast({
          title: "Compte créé",
          description: "Votre compte a été créé avec succès !",
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Features */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold text-gray-900">
              Transformez votre
              <span className="text-primary"> business</span>
            </h1>
            <p className="text-xl text-gray-600">
              La solution CRM nouvelle génération qui booste vos ventes et simplifie votre gestion client.
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Interface Moderne</h3>
                <p className="text-gray-600 text-sm">Design intuitif et responsive</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Sécurisé</h3>
                <p className="text-gray-600 text-sm">Vos données sont protégées</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white rounded-lg shadow-sm border">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Zap className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Performant</h3>
                <p className="text-gray-600 text-sm">Analyses en temps réel</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-2xl">C</span>
              </div>
              <div>
                <CardTitle className="text-3xl font-bold">
                  {mode === 'login' ? 'Connexion' : 'Créer un compte'}
                </CardTitle>
                <CardDescription className="text-gray-600 mt-2">
                  {mode === 'login' 
                    ? 'Accédez à votre espace CRM'
                    : 'Commencez votre essai gratuit'
                  }
                </CardDescription>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-gray-700 font-medium">Nom complet</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Votre nom complet"
                        {...registerField('name')}
                        className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200"
                      />
                    </div>
                    {errors.name && (
                      <p className="text-sm text-red-500 flex items-center gap-1">
                        {errors.name.message}
                      </p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="votre@email.com"
                      {...registerField('email')}
                      className="pl-10 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-sm text-red-500">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">Mot de passe</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...registerField('password')}
                      className="pl-10 pr-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-sm text-red-500">{errors.password.message}</p>
                  )}
                </div>

                {mode === 'register' && (
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-gray-700 font-medium">Confirmer le mot de passe</Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        {...registerField('confirmPassword')}
                        className="pl-10 pr-12 h-12 bg-gray-50 border-gray-200 focus:bg-white transition-all duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                    )}
                  </div>
                )}

                {error && (
                  <Alert variant="destructive" className="bg-red-50 border-red-200">
                    <AlertDescription className="text-red-800">{error}</AlertDescription>
                  </Alert>
                )}

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg transition-all duration-200 transform hover:scale-[1.02]" 
                  disabled={isLoading}
                >
                  {isLoading 
                    ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Chargement...
                      </div>
                    )
                    : mode === 'login' ? 'Se connecter' : 'Créer mon compte'
                  }
                </Button>

                <div className="text-center pt-4">
                  <button
                    type="button"
                    onClick={onToggleMode}
                    className="text-gray-600 hover:text-primary transition-colors font-medium"
                  >
                    {mode === 'login' 
                      ? "Pas encore de compte ? Créer un compte"
                      : "Déjà un compte ? Se connecter"
                    }
                  </button>
                </div>
              </form>

              {mode === 'register' && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 text-center">
                    En créant un compte, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Mobile features */}
          <div className="lg:hidden mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
                <Sparkles className="h-5 w-5 text-blue-600" />
              </div>
              <p className="text-sm text-gray-600">Moderne</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mx-auto">
                <Shield className="h-5 w-5 text-green-600" />
              </div>
              <p className="text-sm text-gray-600">Sécurisé</p>
            </div>
            <div className="space-y-2">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mx-auto">
                <Zap className="h-5 w-5 text-purple-600" />
              </div>
              <p className="text-sm text-gray-600">Rapide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
