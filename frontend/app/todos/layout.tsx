"use client";

import React, { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function TodosLayout({ children }: { children: React.ReactNode }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 ${
          isSidebarCollapsed ? "w-20" : "w-64"
        }`}
      >
        <Sidebar collapsed={isSidebarCollapsed} />
      </div>

      {/* Main content */}
      <div className="flex-1 transition-all duration-300 flex flex-col">
        {/* Header */}
        <Header
          onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          isSidebarCollapsed={isSidebarCollapsed}
        />

        {/* Main content area */}
        <main className="flex-1 p-6 overflow-y-auto transition-all duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
