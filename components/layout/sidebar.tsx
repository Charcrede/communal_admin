"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  FolderOpen, 
  Image, 
  Users, 
  LogOut,
  Settings
} from "lucide-react";
import { logout } from "@/lib/auth";
import { cn } from "@/lib/utils";

const navigationItems = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    name: "Rubriques",
    href: "/dashboard/rubriques",
    icon: FolderOpen,
  },
  {
    name: "Articles",
    href: "/dashboard/articles",
    icon: FileText,
  },
  {
    name: "Médias",
    href: "/dashboard/medias",
    icon: Image,
  },
  {
    name: "Administrateurs",
    href: "/dashboard/administrateurs",
    icon: Users,
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-screen w-64 flex-col bg-white shadow-lg fixed left-0">
      {/* Logo */}
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold text-[#074020] uppercase tracking-wide">
          Communal Admin
        </h1>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-4 py-6">
        {navigationItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[#074020] text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100 hover:text-[#074020]"
              )}
            >
              <item.icon
                className={cn(
                  "mr-3 h-5 w-5 transition-colors",
                  isActive ? "text-white" : "text-gray-400 group-hover:text-[#074020]"
                )}
              />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="border-t p-4 space-y-1">
        <button
          onClick={logout}
          className="group flex w-full items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-all duration-200 hover:bg-red-50 hover:text-red-600"
        >
          <LogOut className="mr-3 h-5 w-5 text-gray-400 group-hover:text-red-600" />
          Déconnexion
        </button>
      </div>
    </div>
  );
}