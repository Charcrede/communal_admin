"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Image,
  Users,
  LogOut,
  User,
  Menu,
  X,
} from "lucide-react";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [admin, setAdmin] = useState<{ name?: string; role?: string }>({});

  useEffect(() => {
    const storedAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
    setAdmin(storedAdmin);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  const navigationItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, show: true },
    { name: "Rubriques", href: "/dashboard/rubriques", icon: FolderOpen, show: true },
    { name: "Articles", href: "/dashboard/articles", icon: FileText, show: true },
    { name: "Médias", href: "/dashboard/medias", icon: Image, show: true },
    { name: "Administrateurs", href: "/dashboard/administrateurs", icon: Users, show: admin?.role === "super_admin" },
  ];

  return (
    <>
      {/* --- Bouton Burger --- */}
      <div className="md:hidden z-50 fixed top-0 mb-16 flex justify-between items-center px-4 w-full bg-opacity-50 bg-gray-10 border-b shadow-sm">
        <button
          onClick={toggleSidebar}
          className="rounded-lg bg-white p-2 shadow-lg text-gray-800"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <div className={`${isOpen ? "opacity-0" : "opacity-100"} flex items-center gap-2 text-sm text-gray-800 px-2 py-3 duration-500`}>
          <img src="/logo.png" alt="Logo" className="h-8 w-8 shrink-0" />
          <span className="truncate">
            {admin?.name || "Administrateur"} –{" "}
            {admin?.role === "super_admin" ? "Super Admin" : "Admin"}
          </span>
        </div>
      </div>


      {/* --- Overlay mobile --- */}
      <div
        onClick={() => setIsOpen(false)}
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity",
          isOpen ? "opacity-100 visible md:hidden" : "opacity-0 invisible"
        )}
      />

      {/* --- Sidebar principale --- */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-screen bg-white shadow-lg flex flex-col z-50 transition-transform duration-300 ease-in-out",
          "w-64 md:translate-x-0 md:w-64", // Toujours visible sur desktop
          isOpen ? "translate-x-0" : "-translate-x-full", // Cachée sur mobile
        )}
      >
        {/* --- Logo --- */}
        <div className="flex items-center h-16 border-b px-3 gap-2 overflow-hidden">
          <img src="/logo.png" alt="Logo" className="h-8 w-8 shrink-0" />
          <h1 className="text-xl font-bold text-[#074020] uppercase tracking-wide truncate">
            Communal Admin
          </h1>
        </div>

        {/* --- Navigation --- */}
        <nav className="flex-1 space-y-1 px-3 py-6">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              item.show && (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsOpen(false)} // ferme le menu sur mobile après clic
                  className={cn(
                    "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-[#074020] text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100 hover:text-[#074020]"
                  )}
                >
                  <item.icon
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isActive ? "text-white" : "text-gray-400 group-hover:text-[#074020]"
                    )}
                  />
                  <span className="ml-3">{item.name}</span>
                </Link>
              )
            );
          })}
        </nav>

        {/* --- Bas de la sidebar --- */}
        <div className="border-t p-4 space-y-1 mb-16">
          <div className="flex items-center gap-2 text-sm text-gray-500 px-2 py-2">
            <span className="w-6 h-6 rounded-full bg-green-200 flex items-center justify-center">
              <User className="w-4 h-4 stroke-green-600" />
            </span>
            <span className="truncate">
              {admin?.name || "Administrateur"} –{" "}
              {admin?.role === "super_admin" ? "Super Admin" : "Admin"}
            </span>
          </div>

          <button
            onClick={logout}
            className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
          >
            <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
            Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
