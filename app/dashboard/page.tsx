"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, FolderOpen, Image, Users, TrendingUp, Activity } from "lucide-react";

const stats = [
  {
    title: "Rubriques",
    value: "12",
    change: "+2 ce mois",
    icon: FolderOpen,
    color: "text-blue-600 bg-blue-100",
  },
  {
    title: "Articles",
    value: "48",
    change: "+8 cette semaine",
    icon: FileText,
    color: "text-green-600 bg-green-100",
  },
  {
    title: "Médias",
    value: "156",
    change: "+23 ce mois",
    icon: Image,
    color: "text-purple-600 bg-purple-100",
  },
  {
    title: "Administrateurs",
    value: "5",
    change: "Actifs",
    icon: Users,
    color: "text-orange-600 bg-orange-100",
  },
];

const recentActivity = [
  {
    action: "Article créé",
    title: "Nouveaux projets communaux",
    time: "Il y a 2 heures",
    type: "article",
  },
  {
    action: "Rubrique ajoutée",
    title: "Événements culturels",
    time: "Il y a 5 heures",
    type: "rubric",
  },
  {
    action: "Média uploadé",
    title: "Photo inauguration.jpg",
    time: "Il y a 1 jour",
    type: "media",
  },
  {
    action: "Administrateur ajouté",
    title: "Marie Dubois",
    time: "Il y a 2 jours",
    type: "admin",
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-[#074020] font-sofia">
              Tableau de bord
            </h1>
            <p className="text-gray-600 mt-1">
              Vue d'ensemble de votre système d'administration
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Activity className="w-4 h-4" />
            Dernière mise à jour: {new Date().toLocaleString('fr-FR')}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  <stat.icon className="w-4 h-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 font-sofia">
                  {stat.value}
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Recent Activity */}
          <Card className="lg:col-span-2 border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#074020] font-sofia">
                Activité récente
              </CardTitle>
              <CardDescription>
                Les dernières actions effectuées sur la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-full ${
                      activity.type === 'article' ? 'bg-green-100 text-green-600' :
                      activity.type === 'rubric' ? 'bg-blue-100 text-blue-600' :
                      activity.type === 'media' ? 'bg-purple-100 text-purple-600' :
                      'bg-orange-100 text-orange-600'
                    }`}>
                      {activity.type === 'article' ? <FileText className="w-4 h-4" /> :
                       activity.type === 'rubric' ? <FolderOpen className="w-4 h-4" /> :
                       activity.type === 'media' ? <Image className="w-4 h-4" /> :
                       <Users className="w-4 h-4" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.action}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {activity.title}
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-[#074020] font-sofia">
                Actions rapides
              </CardTitle>
              <CardDescription>
                Accès direct aux fonctionnalités principales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-[#074020] hover:bg-[#074020]/5 transition-all">
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Créer un article</p>
                  <p className="text-xs text-gray-500">Nouveau contenu</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-[#074020] hover:bg-[#074020]/5 transition-all">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Nouvelle rubrique</p>
                  <p className="text-xs text-gray-500">Organiser le contenu</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-[#074020] hover:bg-[#074020]/5 transition-all">
                <div className="p-2 bg-purple-100 text-purple-600 rounded-lg">
                  <Image className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Ajouter des médias</p>
                  <p className="text-xs text-gray-500">Images et vidéos</p>
                </div>
              </button>
              <button className="w-full flex items-center gap-3 p-3 text-left rounded-lg border border-gray-200 hover:border-[#074020] hover:bg-[#074020]/5 transition-all">
                <div className="p-2 bg-orange-100 text-orange-600 rounded-lg">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Gérer les admins</p>
                  <p className="text-xs text-gray-500">Permissions et accès</p>
                </div>
              </button>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}