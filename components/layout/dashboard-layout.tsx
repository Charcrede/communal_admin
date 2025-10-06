"use client";

import { Sidebar } from "./sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-hidden ml-0 md:ml-64 transition-all duration-300">
        <div className="h-full px-4 py-6 md:px-8">
          {children}
        </div>
      </main>
    </div>
  );
}
