"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Shield, ShieldCheck, Edit } from "lucide-react";
import { Admin } from "@/lib/types";
import { getToken } from "@/lib/auth";
import axios from "axios";
import { toast } from "sonner";

interface PasswordUpdateFormProps {
  onSubmit: (currentPassword: string, newPassword: string) => void;
  onCancel: () => void;
}

const PasswordUpdateForm = ({ onSubmit, onCancel }: PasswordUpdateFormProps) => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les nouveaux mots de passe ne correspondent pas !");
      return;
    }
    if (newPassword.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères !");
      return;
    }

    setIsLoading(true);
    try {
      await onSubmit(currentPassword, newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-[#940806] font-sofia uppercase">
          Modifier le mot de passe
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium">Mot de passe actuel :</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full border-gray-200 rounded-md focus:border-[#074020] focus:ring-[#074020]/20"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Nouveau mot de passe :</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full border-gray-200 rounded-md focus:border-[#074020] focus:ring-[#074020]/20"
              disabled={isLoading}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Confirmer le nouveau mot de passe :</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full border-gray-200 rounded-md focus:border-[#074020] focus:ring-[#074020]/20"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3 justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              disabled={isLoading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#074020] hover:bg-[#074020]/90 text-white font-bold uppercase rounded-md"
              disabled={isLoading}
            >
              {isLoading ? "Modification..." : "Modifier"}
            </button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default function AdministrateursPage() {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [storedAdmin, setStoredAdmin] = useState<{ id?: string } | null>(null);
  const [showUpdateForm, setShowUpdateForm] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API;

  // Lecture safe du localStorage côté client
  useEffect(() => {
    const adminFromStorage = localStorage.getItem("admin");
    if (adminFromStorage) setStoredAdmin(JSON.parse(adminFromStorage));
  }, []);

  const fetchAdmin = async () => {
    if (!storedAdmin?.id) return;
    try {
      const response = await axios.get(`${apiUrl}/admins/${storedAdmin.id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setAdmin(response.data.data);
    } catch (error) {
      toast.error("Erreur lors du chargement de l'administrateur");
    }
  };

  useEffect(() => {
    if (storedAdmin) fetchAdmin();
  }, [storedAdmin]);

  const handlePasswordUpdate = async (currentPassword: string, newPassword: string) => {
    if (!admin) return;
    try {
      await axios.patch(`${apiUrl}/admins/${admin.id}/password`, { currentPassword, newPassword }, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Mot de passe mis à jour avec succès !");
      setShowUpdateForm(false);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Erreur lors de la mise à jour du mot de passe");
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

  return (
    <DashboardLayout>
      <div className="space-y-6">
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

        {showUpdateForm && (
          <PasswordUpdateForm
            onSubmit={handlePasswordUpdate}
            onCancel={() => setShowUpdateForm(false)}
          />
        )}

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {admin && (
            <Card key={admin.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">{admin.name}</CardTitle>
                      <p className="text-sm text-gray-600">{admin.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button
                      onClick={() => setShowUpdateForm(true)}
                      className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors"
                    >
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
                    <Badge variant="outline" className="text-green-600 border-green-200">Actif</Badge>
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
