"use client";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { useState } from "react";
import { motion } from "framer-motion";
import { CheckCircleIcon, XCircleIcon, PuzzlePieceIcon } from "@heroicons/react/24/solid";
import { Toaster, toast } from "sonner"; // for modern toast notifications

export default function IntegrationsPage() {
  const [connected, setConnected] = useState({
    google: false,
    slack: false,
    github: true,
    notion: false,
  });

  const integrations = [
    {
      name: "Google Calendar",
      description: "Sync your tasks and deadlines seamlessly with Google Calendar.",
      key: "google",
    },
    {
      name: "Slack",
      description: "Get real-time task alerts and updates directly in your Slack workspace.",
      key: "slack",
    },
    {
      name: "GitHub",
      description: "Link GitHub issues to your tasks and track project progress.",
      key: "github",
    },
    {
      name: "Notion",
      description: "Embed and sync your Notion pages directly with your workspace.",
      key: "notion",
    },
  ];

  const handleToggle = (key: string, name: string) => {
    setConnected((prev) => {
      const newStatus = !prev[key as keyof typeof prev];
      if (newStatus) {
        toast.success(`✅ ${name} connected successfully!`);
      } else {
        toast.error(`🔌 ${name} disconnected.`);
      }
      return { ...prev, [key]: newStatus };
    });
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 to-white text-gray-900">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-auto">
        <Header />
        <Toaster position="top-right" richColors />
        <motion.div
          className="p-8"
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-semibold text-sky-600 flex items-center gap-2">
              <PuzzlePieceIcon className="h-7 w-7 text-sky-500" />
              Integrations
            </h1>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {integrations.map((integration) => (
              <motion.div
                key={integration.name}
                whileHover={{ scale: 1.03 }}
                className="p-6 rounded-2xl shadow-md hover:shadow-lg transition bg-white border border-gray-100"
              >
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {integration.name}
                  </h2>
                  {connected[integration.key as keyof typeof connected] ? (
                    <CheckCircleIcon className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-6 w-6 text-gray-400" />
                  )}
                </div>
                <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
                <button
                  onClick={() => handleToggle(integration.key, integration.name)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${
                    connected[integration.key as keyof typeof connected]
                      ? "bg-red-100 text-red-600 hover:bg-red-200"
                      : "bg-sky-100 text-sky-700 hover:bg-sky-200"
                  } transition`}
                >
                  {connected[integration.key as keyof typeof connected]
                    ? "Disconnect"
                    : "Connect"}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
