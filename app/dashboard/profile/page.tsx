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
import PasswordUpdateForm from "@/components/PasswordUpdateForm";

export default function AdministrateursPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
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
  const storedAdmin = JSON.parse(localStorage.getItem("admin") || "{}");

  const fetchAdmin = async () => {
    try {
      const response = await axios.get(`${apiUrl}/admins/${storedAdmin.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setAdmin(response.data.data);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'administrateur");
    }
  };

  const handleSubmit = async (currentPassword: string, newPassword: string) => {
    try {
      await axios.patch(`${apiUrl}/admins/${admin?.id}`, {
        password : newPassword
      }, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("Mot de passe mis à jour avec succès !");
      setShowUpdateForm(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du mot de passe");
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


  useEffect(() => {
    fetchAdmin();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#074020] font-sofia uppercase">
              Profil administrateur
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez les accès et permissions de votre équipe
            </p>
          </div>
        </div>



        {showUpdateForm && (<PasswordUpdateForm onSubmit={({currentPassword, newPassword})=>{handleSubmit(currentPassword, newPassword)}}></PasswordUpdateForm>)}

        {/* Admin List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {admin && (
              <Card key={admin.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {admin.name}
                      </CardTitle>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button onClick={() => setShowUpdateForm(true)} className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
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
        )}
        </div>
      </div>
    </DashboardLayout>
  );
}