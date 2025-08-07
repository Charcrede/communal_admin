"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, FolderOpen, Edit, Trash2, Search } from "lucide-react";
import { CreateRubricData, Rubric } from "@/lib/types";
import { getToken } from "@/lib/auth";
import axios from "axios";
import { toast } from "sonner";

export default function RubriquesPage() {
  const [rubriques, setRubriques] = useState<Rubric[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [rubricData, setRubricData] = useState<CreateRubricData>({
    name: "",
    description: "",
  });

  const apiUrl = process.env.NEXT_PUBLIC_API;

  const fetchRubriques = async () => {
    try {
      const response = await axios.get(`${apiUrl}/rubrics/`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setRubriques(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des rubriques");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!rubricData.name.trim() || !rubricData.description.trim()) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);
    
    try {
      await axios.post(`${apiUrl}/rubrics/`, rubricData, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json"
        }
      });
      
      toast.success("Rubrique créée avec succès !");
      setRubricData({ name: "", description: "" });
      setShowCreateForm(false);
      fetchRubriques();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette rubrique ?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/rubrics/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("Rubrique supprimée avec succès !");
      fetchRubriques();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const filteredRubriques = rubriques.filter(rubrique =>
    rubrique.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rubrique.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchRubriques();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#074020] font-sofia uppercase">
              Gestion des Rubriques
            </h1>
            <p className="text-gray-600 mt-1">
              Organisez et structurez vos contenus par catégories
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#074020] hover:bg-[#074020]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvelle rubrique
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher une rubrique..."
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
                Créer une nouvelle rubrique
              </CardTitle>
              <CardDescription>
                Ajoutez une nouvelle catégorie pour organiser vos contenus
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nom de la rubrique :
                  </Label>
                  <Input
                    id="name"
                    value={rubricData.name}
                    onChange={(e) => setRubricData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Entrez le nom de la rubrique"
                    className="mt-1 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                    disabled={isLoading}
                  />
                </div>
                
                <div>
                  <Label htmlFor="description" className="text-sm font-medium">
                    Description :
                  </Label>
                  <textarea
                    id="description"
                    value={rubricData.description}
                    onChange={(e) => setRubricData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez cette rubrique..."
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#074020] focus:ring-2 focus:ring-[#074020]/20 focus:outline-none resize-none"
                    disabled={isLoading}
                  />
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setRubricData({ name: "", description: "" });
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

        {/* Rubriques List */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredRubriques.map((rubrique) => (
            <Card key={rubrique.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                      <FolderOpen className="w-5 h-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg font-semibold text-gray-900">
                        {rubrique.name}
                      </CardTitle>
                      <p className="text-xs text-gray-500">
                        Créée le {new Date(rubrique.created_at).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(rubrique.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {rubrique.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredRubriques.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Aucune rubrique trouvée" : "Aucune rubrique créée"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? "Essayez de modifier votre recherche"
                  : "Commencez par créer votre première rubrique pour organiser vos contenus"
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-[#074020] hover:bg-[#074020]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Créer ma première rubrique
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}