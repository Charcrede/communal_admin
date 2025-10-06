"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Shield, ShieldCheck, Search, Edit, Trash2, Eye, EyeOff } from "lucide-react";
import { CreateAdminData, Admin } from "@/lib/types";
import { getToken } from "@/lib/auth";
import axios from "axios";
import { toast } from "sonner";

export default function AdministrateursPage() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [adminData, setAdminData] = useState<CreateAdminData>({
    name: "",
    email: "",
    password: "",
    role: "admin",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API;

  const fetchAdmins = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admins/`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setAdmins(response.data.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des administrateurs");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!adminData.name.trim() || !adminData.email.trim() || !adminData.password.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    // Validation email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(adminData.email)) {
      toast.error("Veuillez entrer une adresse email valide");
      return;
    }

    // Validation mot de passe
    if (adminData.password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post(`${apiUrl}/admins/`, adminData, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });
      
      toast.success("Administrateur créé avec succès !");
      setAdminData({ name: "", email: "", password: "", role: "admin" });
      setShowCreateForm(false);
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet administrateur ?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/admins/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("Administrateur supprimé avec succès !");
      fetchAdmins();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <Badge className="bg-[#940806] hover:bg-[#940806]/90 text-white">
            <ShieldCheck className="w-3 h-3 mr-1" />
            Super Admin
          </Badge>
        );
      case 'admin':
        return (
          <Badge className="bg-[#074020] hover:bg-[#074020]/90 text-white">
            <Shield className="w-3 h-3 mr-1" />
            Admin
          </Badge>
        );
      default:
        return (
          <Badge variant="secondary">
            <Users className="w-3 h-3 mr-1" />
            Utilisateur
          </Badge>
        );
    }
  };

  const filteredAdmins = admins.filter(admin =>
    admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#074020] font-sofia uppercase">
              Gestion des Administrateurs
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les accès et permissions de votre équipe
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#074020] hover:bg-[#074020]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel administrateur
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un administrateur..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
          />
        </div>

        {/* Create Form */}
        {showCreateForm && (
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-[#940806] font-sofia uppercase">
                Créer un nouvel administrateur
              </CardTitle>
              <CardDescription>
                Ajoutez un nouveau membre à votre équipe d'administration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">
                      Nom complet :
                    </Label>
                    <Input
                      id="name"
                      value={adminData.name}
                      onChange={(e) => setAdminData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Nom et prénom"
                      className="mt-1 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                      disabled={isLoading}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">
                      Adresse e-mail :
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={adminData.email}
                      onChange={(e) => setAdminData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@example.com"
                      className="mt-1 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="password" className="text-sm font-medium">
                    Mot de passe :
                  </Label>
                  <div className="relative mt-1">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={adminData.password}
                      onChange={(e) => setAdminData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="••••••••"
                      className="pr-12 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-600"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Le mot de passe doit contenir au moins 6 caractères
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium mb-3 block">
                    Rôle :
                  </Label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={adminData.role === "admin"}
                        onChange={(e) => setAdminData(prev => ({ ...prev, role: e.target.value as "admin" | "super_admin" }))}
                        className="w-4 h-4 text-[#074020] border-gray-300 focus:ring-[#074020]/20"
                        disabled={isLoading}
                      />
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[#074020]" />
                        <div>
                          <p className="font-medium text-gray-900">Administrateur</p>
                          <p className="text-sm text-gray-500">Accès aux fonctionnalités de base</p>
                        </div>
                      </div>
                    </label>
                    
                    <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                      <input
                        type="radio"
                        name="role"
                        value="super_admin"
                        checked={adminData.role === "super_admin"}
                        onChange={(e) => setAdminData(prev => ({ ...prev, role: e.target.value as "admin" | "super_admin" }))}
                        className="w-4 h-4 text-[#940806] border-gray-300 focus:ring-[#940806]/20"
                        disabled={isLoading}
                      />
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-[#940806]" />
                        <div>
                          <p className="font-medium text-gray-900">Super Administrateur</p>
                          <p className="text-sm text-gray-500">Accès complet à toutes les fonctionnalités</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setAdminData({ name: "", email: "", password: "", role: "admin" });
                    }}
                    disabled={isLoading}
                  >
                    Annuler
                  </Button>
                  <Button
                    type="submit"
                    className="bg-[#074020] hover:bg-[#074020]/90 text-white font-bold uppercase"
                    disabled={isLoading}
                  >
                    {isLoading ? "Création..." : "Créer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Admins List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAdmins.map((admin) => (
            <Card key={admin.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-full ${
                      admin.role === 'super_admin' 
                        ? 'bg-[#940806]/10 text-[#940806]' 
                        : 'bg-[#074020]/10 text-[#074020]'
                    }`}>
                      {admin.role === 'super_admin' ? (
                        <ShieldCheck className="w-6 h-6" />
                      ) : (
                        <Shield className="w-6 h-6" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {admin.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(admin.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Rôle :</span>
                    {getRoleBadge(admin.role)}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Statut :</span>
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      Actif
                    </Badge>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <p className="text-xs text-gray-500">
                      Créé le {new Date(admin.created_at).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredAdmins.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Aucun administrateur trouvé" : "Aucun administrateur créé"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? "Essayez de modifier votre recherche"
                  : "Commencez par créer votre premier administrateur"
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-[#074020] hover:bg-[#074020]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer mon premier administrateur
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}