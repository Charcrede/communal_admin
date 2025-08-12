"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { login, LoginCredentials } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Eye, EyeOff, Shield } from 'lucide-react';
import { toast } from 'sonner';

export default function LoginPage() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!credentials.email || !credentials.password) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    
    try {
      await login(credentials);
      toast.success('Connexion réussie !');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erreur de connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof LoginCredentials) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCredentials(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex">
      {/* Left side - Image/Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#074020] to-[#0a5429] items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10 text-center text-white px-8">
          <Shield className="w-20 h-20 mx-auto mb-6" />
          <h1 className="text-4xl font-bold mb-4 font-sofia">
            Communal Admin
          </h1>
          <p className="text-xl opacity-90">
            Plateforme d'administration pour la gestion de contenu communal
          </p>
          <div className="mt-8 space-y-4 text-lg opacity-80">
            <p>✓ Gestion des rubriques</p>
            <p>✓ Création d'articles</p>
            <p>✓ Gestion des médias</p>
            <p>✓ Administration sécurisée</p>
          </div>
        </div>
      </div>

      {/* Right side - Login form */}
      <div className="flex-1 flex items-center justify-center px-6 lg:px-8 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-[#074020]/10 rounded-full mb-4">
                <Shield className="w-8 h-8 text-[#074020]" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 font-sofia">
                Connexion
              </h2>
              <p className="text-gray-600 mt-2">
                Accédez à votre espace d'administration
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Adresse e-mail
                </Label>
                <Input
                  id="email"
                  type="text"
                  value={credentials.email}
                  onChange={handleInputChange('email')}
                  className="mt-1 block w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074020]/20 focus:border-[#074020] transition-colors"
                  placeholder="admin@example.com"
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Mot de passe
                </Label>
                <div className="relative mt-1">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleInputChange('password')}
                    className="block w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#074020]/20 focus:border-[#074020] transition-colors"
                    placeholder="••••••••"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !credentials.email || !credentials.password}
                className="w-full bg-[#074020] hover:bg-[#074020]/90 text-white py-3 px-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Spinner size="sm" className="mr-2" />
                    Connexion...
                  </div>
                ) : (
                  'Se connecter'
                )}
              </Button>
            </form>

            <div className="mt-6 text-center text-sm text-gray-500">
              <p>Accès sécurisé réservé aux administrateurs</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}