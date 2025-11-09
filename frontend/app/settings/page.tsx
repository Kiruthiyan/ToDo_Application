"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import {
  BellIcon,
  UserIcon,
  LockClosedIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("account");

  const tabs = [
    { id: "account", label: "Account", icon: <UserIcon className="w-5 h-5" /> },
    { id: "preferences", label: "Preferences", icon: <Cog6ToothIcon className="w-5 h-5" /> },
    { id: "notifications", label: "Notifications", icon: <BellIcon className="w-5 h-5" /> },
    { id: "security", label: "Security", icon: <LockClosedIcon className="w-5 h-5" /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900">
      <Sidebar />

      <div className="flex flex-col flex-1">
        {/* Sticky Header */}
        <div className="sticky top-0 z-30 bg-white shadow-sm">
          <Header />
        </div>

        <div className="flex flex-col p-8 overflow-y-auto">
          <h1 className="text-3xl font-semibold text-sky-600 mb-6">⚙️ Settings</h1>

          {/* Tabs */}
          <div className="flex space-x-4 border-b border-gray-200 mb-6 sticky top-[72px] bg-gray-50 z-20">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 font-medium rounded-t-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-sky-100 text-sky-700 border-b-2 border-sky-500"
                    : "text-gray-600 hover:text-sky-500"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Animated Tab Content */}
          <div className="bg-white p-6 rounded-xl shadow-md mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === "account" && <AccountSettings />}
                {activeTab === "preferences" && <PreferenceSettings />}
                {activeTab === "notifications" && <NotificationSettings />}
                {activeTab === "security" && <SecuritySettings />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

function AccountSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">👤 Account Information</h2>
      <div className="grid md:grid-cols-2 gap-4">
        <label className="flex flex-col">
          <span className="text-gray-700 mb-1">Full Name</span>
          <input
            type="text"
            className="border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="Enter your full name"
          />
        </label>
        <label className="flex flex-col">
          <span className="text-gray-700 mb-1">Email Address</span>
          <input
            type="email"
            className="border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
            placeholder="example@email.com"
          />
        </label>
      </div>
      <label className="flex flex-col">
        <span className="text-gray-700 mb-1">Profile Picture</span>
        <input
          type="file"
          className="border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none"
        />
      </label>
      <button className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition">
        Save Changes
      </button>
    </div>
  );
}

function PreferenceSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">🎨 Appearance & Preferences</h2>
      <div className="flex items-center justify-between">
        <span>Dark Mode</span>
        <input type="checkbox" className="w-5 h-5 accent-sky-600" />
      </div>
      <div className="flex items-center justify-between">
        <span>Language</span>
        <select className="border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none">
          <option>English</option>
          <option>Tamil</option>
          <option>French</option>
        </select>
      </div>
      <button className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition">
        Save Preferences
      </button>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">🔔 Notifications</h2>
      <div className="flex items-center justify-between">
        <span>Email Alerts</span>
        <input type="checkbox" className="w-5 h-5 accent-sky-600" />
      </div>
      <div className="flex items-center justify-between">
        <span>Push Notifications</span>
        <input type="checkbox" className="w-5 h-5 accent-sky-600" />
      </div>
      <div className="flex items-center justify-between">
        <span>Task Reminders</span>
        <input type="checkbox" className="w-5 h-5 accent-sky-600" />
      </div>
      <button className="mt-4 bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition">
        Update Notifications
      </button>
    </div>
  );
}

function SecuritySettings() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="space-y-4 relative">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">🔒 Security</h2>
      <label className="flex flex-col">
        <span className="text-gray-700 mb-1">Current Password</span>
        <input type="password" className="border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none" />
      </label>
      <label className="flex flex-col">
        <span className="text-gray-700 mb-1">New Password</span>
        <input type="password" className="border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none" />
      </label>
      <label className="flex flex-col">
        <span className="text-gray-700 mb-1">Confirm New Password</span>
        <input type="password" className="border rounded-lg p-2 focus:ring-2 focus:ring-sky-500 outline-none" />
      </label>

      <div className="flex items-center gap-4 mt-6">
        <button className="bg-sky-600 text-white px-4 py-2 rounded-lg hover:bg-sky-700 transition">
          Change Password
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="text-red-600 border border-red-400 px-4 py-2 rounded-lg hover:bg-red-50 transition"
        >
          Delete Account
        </button>
      </div>

      {/* Delete Account Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md text-center"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <ExclamationTriangleIcon className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Are you sure?</h3>
              <p className="text-gray-600 mb-6">
                This action cannot be undone. Your account and all associated data will be permanently deleted.
              </p>
              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => alert("Account deleted (demo only)")}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                >
                  Confirm Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
