"use client";

import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CustomSelect } from "@/components/ui/custom-select";
import { Plus, FileText, Edit, Trash2, Upload, X, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { CreateArticleData, Article, Rubric, Media } from "@/lib/types";
import { getToken } from "@/lib/auth";
import axios from "axios";
import { toast } from "sonner";

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [rubriques, setRubriques] = useState<Rubric[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [files, setFiles] = useState<FileList | null>(null);
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const [articleData, setArticleData] = useState<CreateArticleData>({
    title: "",
    content: "",
    rubricId: "",
  });
  const rubricOptions = rubriques.map(rubric => ({
    value: rubric.id,
    label: rubric.name
  }));
  const [selectedMedia, setSelectedMedia] = useState<Media[]>([]);
  const [activeMediaIndex, setActiveMediaIndex] = useState<number>(0);
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

  const apiUrl = process.env.NEXT_PUBLIC_API;

  const fetchData = async (query: string = "") => {
    try {
      const [articlesRes, rubriquesRes] = await Promise.all([
        axios.get(`${apiUrl}/v1/articles/${query ? "?search=" + query : ""}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
        axios.get(`${apiUrl}/v1/rubrics/`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        })
      ]);
      setArticles(articlesRes.data?.data || articlesRes.data);
      setRubriques(rubriquesRes.data);
    } catch (error) {
      toast.error("Erreur lors du chargement des données");
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles && selectedFiles.length > 10) {
      toast.error("Vous ne pouvez sélectionner que 10 fichiers maximum !");
      event.target.value = "";
      return;
    }
    setFiles(selectedFiles);
  };

  const removeFile = (index: number) => {
    if (files) {
      const dt = new DataTransfer();
      for (let i = 0; i < files.length; i++) {
        if (i !== index) {
          dt.items.add(files[i]);
        }
      }
      setFiles(dt.files);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleData.title.trim() || !articleData.content.trim() || !articleData.rubricId) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("title", articleData.title);
      formData.append("content", articleData.content);
      formData.append("rubric_id", articleData.rubricId);
      if (files) {
        for (let i = 0; i < files.length; i++) {
          formData.append("media[]", files[i]);
        }
      }
      await axios.post(`${apiUrl}/v1/articles/`, formData, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Article créé avec succès !");
      setArticleData({ title: "", content: "", rubricId: "" });
      setFiles(null);
      setShowCreateForm(false);
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la création");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet article ?")) return;
    try {
      await axios.delete(`${apiUrl}/v1/articles/${id}/`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Article supprimé avec succès !");
      fetchData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression");
    }
  };

  const openMediaModal = (media: Media[]) => {
    setSelectedMedia(media);
    setActiveMediaIndex(0);
    setIsMediaModalOpen(true);
  };

  const closeMediaModal = () => {
    setIsMediaModalOpen(false);
    setSelectedMedia([]);
    setActiveMediaIndex(0);
  };

  const nextMedia = () => {
    setActiveMediaIndex((prev) => (prev + 1) % selectedMedia.length);
  };

  const prevMedia = () => {
    setActiveMediaIndex((prev) => (prev - 1 + selectedMedia.length) % selectedMedia.length);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      fetchData(searchTerm)
    }
  }, [searchTerm])

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#074020] font-sofia uppercase">
              Articles : Formulaire
            </h1>
            <p className="text-gray-600 mt-1">
              Créez et gérez vos articles de contenu
            </p>
          </div>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-[#074020] hover:bg-[#074020]/90 text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nouvel article
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Rechercher un article..."
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
                Créer un article
              </CardTitle>
              <CardDescription>
                Rédigez un nouvel article pour votre plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="rubric" className="text-sm font-medium">
                    Rubrique :
                  </Label>
                  <CustomSelect
                    options={rubricOptions}
                    value={articleData.rubricId}
                    onSelect={(value) => setArticleData(prev => ({ ...prev, rubricId: value }))}
                    placeholder="Sélectionner une rubrique"
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="title" className="text-sm font-medium">
                    Titre :
                  </Label>
                  <Input
                    id="title"
                    value={articleData.title}
                    onChange={(e) => setArticleData(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Entrez le titre de l'article"
                    className="mt-1 border-gray-200 focus:border-[#074020] focus:ring-[#074020]/20"
                    disabled={isLoading}
                  />
                </div>

                <div>
                  <Label htmlFor="content" className="text-sm font-medium">
                    Article :
                  </Label>
                  <textarea
                    id="content"
                    value={articleData.content}
                    onChange={(e) => setArticleData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Rédigez votre article..."
                    rows={8}
                    className="mt-1 w-full px-3 py-2 border border-gray-200 rounded-xl focus:border-[#074020] focus:ring-2 focus:ring-[#074020]/20 focus:outline-none resize-none"
                    disabled={isLoading}
                  />
                </div>

                {/* File Upload */}
                <div className="border border-gray-200 rounded-lg p-4">
                  <Label className="text-sm font-medium mb-2 block">
                    Médias (optionnel) :
                  </Label>
                  <div className="space-y-3">
                    <div className="flex items-center justify-center w-full">
                      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-8 h-8 mb-2 text-gray-400" />
                          <p className="mb-2 text-sm text-gray-500">
                            <span className="font-semibold">Cliquez pour uploader</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-gray-500">PNG, JPG, GIF, MP4 (MAX. 10 fichiers)</p>
                        </div>
                        <input
                          type="file"
                          accept="image/*,video/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          disabled={isLoading}
                        />
                      </label>
                    </div>

                    {files && files.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{files.length} fichier(s) sélectionné(s) :</p>
                        <div className="space-y-1 max-h-32 overflow-y-auto">
                          {Array.from(files).map((file, index) => (
                            <div key={index} className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-lg">
                              <span className="text-sm text-gray-700 truncate">{file.name}</span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700 ml-2"
                                disabled={isLoading}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ))}
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
                      setArticleData({ title: "", content: "", rubricId: "" });
                      setFiles(null);
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


        {/* Articles List */}
        <div className="grid gap-6">
          {articles.map((article) => (
            <Card key={article.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold text-gray-900 mb-2">
                        {article.title}
                      </CardTitle>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Rubrique: {article.rubric?.name || "Non définie"}</span>
                        <span>•</span>
                        <span>Créé le {new Date(article.created_at).toLocaleDateString('fr-FR')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button className="p-2 text-gray-400 hover:text-[#074020] hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(article.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {article.content.length > 200 ? `${article.content.substring(0, 200)}...` : article.content}
                </p>
                {article.media && article.media.length > 0 && (
                  // <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer" onClick={() => openMediaModal(article.media)}>
                  //   <Upload className="w-4 h-4" />
                  //   <span>{article.media.length} média(s) attaché(s)</span>
                  // </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 cursor-pointer" onClick={() => openMediaModal(article.media)}>
                      {article.media.map((media, index) => {
                        return (
                          <div
                            key={index}
                            onClick={() => setActiveMediaIndex(index)}
                            className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border ${activeMediaIndex === index ? 'border-green-500' : 'border-transparent'
                              }`}
                          >
                            {media.type == 'video' ? (
                              <video
                                src={`${baseUrl}${media.url}`}
                                className="w-full h-full object-cover"
                                muted
                                autoPlay
                              />
                            ) : (
                              <img
                                src={`${baseUrl}${media.url}`}
                                alt={`thumb-${index}`}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>
                        );
                      })}
                  </div>  
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {isMediaModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/70 flex flex-col items-center justify-center p-6">
            <div className="relative max-w-4xl w-full max-h-[80vh] bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="flex justify-between items-center p-4">
                <button onClick={prevMedia}>
                  <ChevronLeft className="w-6 h-6 text-gray-600" />
                </button>

                {/* ✅ Image ou Vidéo selon l'extension */}
                {selectedMedia[activeMediaIndex].type == 'video' ? (
                  <video
                    src={`${baseUrl}${selectedMedia[activeMediaIndex].url}`}
                    controls
                    autoPlay
                    className="object-contain max-h-[60vh] mx-auto"
                  />
                ) : (
                  <img
                    src={`${baseUrl}${selectedMedia[activeMediaIndex].url}`}
                    alt="media preview"
                    className="object-contain max-h-[60vh] mx-auto"
                  />
                )}

                <button onClick={nextMedia}>
                  <ChevronRight className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* ✅ Liste des miniatures */}
              <div className="flex justify-center overflow-x-auto gap-2 p-4 bg-gray-100">
                {selectedMedia.map((media, index) => {
                  return (
                    <div
                      key={index}
                      onClick={() => setActiveMediaIndex(index)}
                      className={`w-20 h-20 rounded-md overflow-hidden cursor-pointer border ${activeMediaIndex === index ? 'border-green-500' : 'border-transparent'
                        }`}
                    >
                      {media.type == 'video' ? (
                        <video
                          src={`${baseUrl}${media.url}`}
                          className="w-full h-full object-cover"
                          muted
                        />
                      ) : (
                        <img
                          src={`${baseUrl}${media.url}`}
                          alt={`thumb-${index}`}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={closeMediaModal}
                className="absolute top-3 right-3 text-black text-xl"
              >
                ×
              </button>
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}
