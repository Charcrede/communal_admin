"use client";

import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { getRole, getToken } from "@/lib/auth";
import { DashboardOverview } from "@/lib/types";
import { formatDate } from "@/lib/utils";
import axios from "axios";

import { FileText, FolderOpen, Image, Users, TrendingUp, Activity, TrendingDown, Shield, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";



export default function DashboardPage() {
  const apiUrl = process.env.NEXT_PUBLIC_API;
  const [stats, setStats] = useState<DashboardOverview | null>(null);
  const fetchData = async (query: string = "") => {
    try {
      const [dashboard] = await Promise.all([
        axios.get(`${apiUrl}/dashboard/${getRole() === "super_admin" ? 'super' : 'admin'}`, {
          headers: { Authorization: `Bearer ${getToken()}` },
        }),
      ]);
      console.log(dashboard.data);
      setStats(dashboard.data.data);
    } catch (error) {
      console.error("Erreur lors du chargement des données");
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
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
            Dernière mise à jour: { formatDate(new Date().toLocaleString('fr-FR')) }
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {stats?.overview?.counts?.map((stat) => (
            <Card key={stat.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${stat.color}`}>
                  {stat.icon === 'FileText' ? <FileText className="w-4 h-4" /> :
                    stat.icon === 'FolderOpen' ? <FolderOpen className="w-4 h-4" /> :
                      stat.icon === 'Image' ? <Image className="w-4 h-4" /> :
                        <Users className="w-4 h-4" />}
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 font-sofia">
                  {stat.value}
                </div>
                {stat.title !== 'Administrateurs' ? (
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    {stat.trend == "increase" ? (
                      <span className="text-green-600 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" />
                      </span>
                    ) : stat.trend == "decrease" ? (
                      <span className="text-red-600 flex items-center">
                        <TrendingDown className="w-3 h-3 mr-1" />
                      </span>
                    ) : null}

                    {stat.change}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500 flex items-center mt-1">
                    <span className="text-red-600 flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1" />
                    </span>
                    {stat.change.split('/')[0]}
                    <span className="text-green-600 flex items-center">
                      <Shield className="w-3 h-3 mx-1" />
                    </span>
                    {stat.change.split('/')[1]}

                  </p>
                )}
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
                {stats?.overview?.lasts?.map((activity, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className={`p-2 rounded-full ${activity.type === 'article' ? 'bg-green-100 text-green-600' :
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
                        {formatDate(activity.time)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {/* <Card className="border-0 shadow-md">
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
          </Card> */}
        </div>
      </div>
    </DashboardLayout>
  );
}