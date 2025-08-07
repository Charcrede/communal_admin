"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Image, Video, Music, Upload, Search, Edit, Trash2, Eye } from "lucide-react";
import { CreateMediaData, Media } from "@/lib/types";
import { getToken } from "@/lib/auth";
import axios from "axios";
import { toast } from "sonner";

export default function MediasPage() {
  const [medias, setMedias] = useState<Media[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mediaData, setMediaData] = useState<CreateMediaData>({
    title: "",
    description: "",
    file: null as any,
  });

  const apiUrl = process.env.NEXT_PUBLIC_API;

  const fetchMedias = async () => {
    try {
      const response = await axios.get(`${apiUrl}/medias/`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      setMedias(response.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des médias");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérification de la taille (max 50MB)
      if (file.size > 50 * 1024 * 1024) {
        toast.error("Le fichier ne peut pas dépasser 50MB");
        return;
      }
      setMediaData(prev => ({ ...prev, file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mediaData.title.trim() || !mediaData.description.trim() || !mediaData.file) {
      toast.error("Veuillez remplir tous les champs et sélectionner un fichier");
      return;
    }

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("title", mediaData.title);
      formData.append("description", mediaData.description);
      formData.append("file", mediaData.file);

      await axios.post(`${apiUrl}/medias/`, formData, {
        headers: { 
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data"
        }
      });
      
      toast.success("Média créé avec succès !");
      setMediaData({ title: "", description: "", file: null as any });
      setShowCreateForm(false);
      fetchMedias();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce média ?")) {
      return;
    }

    try {
      await axios.delete(`${apiUrl}/medias/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` }
      });
      toast.success("Média supprimé avec succès !");
      fetchMedias();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const getMediaIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <Image className="w-5 h-5" />;
      case 'video':
        return <Video className="w-5 h-5" />;
      case 'audio':
        return <Music className="w-5 h-5" />;
      default:
        return <Image className="w-5 h-5" />;
    }
  };

  const getMediaColor = (type: string) => {
    switch (type) {
      case 'image':
        return 'bg-purple-100 text-purple-600';
      case 'video':
        return 'bg-red-100 text-red-600';
      case 'audio':
        return 'bg-green-100 text-green-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const filteredMedias = medias.filter(media =>
    media.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    media.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchMedias();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#074020] font-sofia uppercase">
              Gestion des Médias
            </h1>
            <p className="text-gray-600 mt-1">
              Gérez vos images, vidéos et fichiers audio
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#074020] hover:bg-[#074020]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouveau média
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un média..."
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
                Ajouter un nouveau média
              </CardTitle>
              <CardDescription>
                Uploadez une image, vidéo ou fichier audio
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Titre du média :
                  </Label>
                  <Input
                    id="title"
                    value={mediaData.title}
                    onChange={(e) => setMediaData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Entrez le titre du média"
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
                    value={mediaData.description}
                    onChange={(e) => setMediaData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Décrivez ce média..."
                    rows={4}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#074020] focus:ring-2 focus:ring-[#074020]/20 focus:outline-none resize-none"
                    disabled={isLoading}
                  />
                </div>

                {/* File Upload */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Fichier :
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4, MP3, WAV (MAX. 50MB)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*,video/*,audio/*"
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>
                    </div>
                    
                    {mediaData.file && (
                      <div className="bg-gray-50 px-4 py-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                              <Upload className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{mediaData.file.name}</p>
                              <p className="text-xs text-gray-500">{formatFileSize(mediaData.file.size)}</p>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => setMediaData(prev => ({ ...prev, file: null as any }))}
                            className="text-red-500 hover:text-red-700"
                            disabled={isLoading}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 justify-end">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCreateForm(false);
                      setMediaData({ title: "", description: "", file: null as any });
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
                    {isLoading ? "Upload..." : "Créer"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {/* Medias Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredMedias.map((media) => (
            <Card key={media.id} className="border-0 shadow-md hover:shadow-lg transition-shadow overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${getMediaColor(media.type)}`}>
                      {getMediaIcon(media.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                        {media.title}
                      </CardTitle>
                      <p className="text-xs text-gray-500 capitalize">
                        {media.type} • {formatFileSize(media.size)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => handleDelete(media.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              
              {/* Media Preview */}
              {media.type === 'image' && (
                <div className="px-6 pb-4">
                  <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <img 
                      src={media.url} 
                      alt={media.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              <CardContent className="pt-0">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                  {media.description}
                </p>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs text-gray-500">
                    Ajouté le {new Date(media.created_at).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredMedias.length === 0 && (
          <Card className="border-0 shadow-md">
            <CardContent className="text-center py-12">
              <Image className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {searchTerm ? "Aucun média trouvé" : "Aucun média uploadé"}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? "Essayez de modifier votre recherche"
                  : "Commencez par uploader votre premier média"
                }
              </p>
              {!searchTerm && (
                <Button
                  onClick={() => setShowCreateForm(true)}
                  className="bg-[#074020] hover:bg-[#074020]/90 text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Uploader mon premier média
                </Button>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}