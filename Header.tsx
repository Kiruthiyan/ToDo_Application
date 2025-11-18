"use client";

import React, { useState, useEffect } from "react";
import {
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";

export default function Header() {
  const router = useRouter();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState({ name: "Guest", email: "guest@example.com" });

  // Load user info from localStorage
  useEffect(() => {
    const name = localStorage.getItem("userName") || "Guest";
    const email = localStorage.getItem("userEmail") || "guest@example.com";
    setUser({ name, email });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    localStorage.removeItem("userEmail");
    router.push("/"); // Redirect to login page
  };

  return (
    <header className="flex items-center justify-between px-6 py-4 bg-sky-50 border-b shadow-md">
      {/* Left side: App name and quote */}
      <div className="flex flex-col">
        <h1 className="text-2xl font-bold text-sky-800">DoTrack</h1>
        <p className="text-sm text-sky-600 mt-1">Don’t just dream — schedule it</p>
      </div>

      {/* Right side: Icons */}
      <div className="flex items-center gap-4 relative">
        {/* Notification Button */}
        <button
          onClick={() => {
            setShowNotifications(!showNotifications);
            setShowProfile(false);
          }}
          className="relative p-2 rounded-full hover:bg-sky-100 transition"
        >
          <BellIcon className="h-6 w-6 text-sky-700" />
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white text-xs font-semibold rounded-full px-1.5 shadow">
            3
          </span>
        </button>

        {/* Notification Dropdown */}
        {showNotifications && (
          <div className="absolute right-16 top-12 bg-white w-64 shadow-xl border rounded-xl p-4 z-50 animate-fadeIn scale-95 origin-top-right transition-transform duration-200">
            <h3 className="font-semibold text-sky-800 mb-3">Notifications</h3>
            <ul className="text-sm text-gray-600 space-y-2">
              <li>✅ Task “Project Setup” completed</li>
              <li>🕒 Reminder: Meeting at 2 PM</li>
              <li>📌 New task assigned: “API Integration”</li>
            </ul>
          </div>
        )}

        {/* User Profile Button */}
        <button
          onClick={() => {
            setShowProfile(!showProfile);
            setShowNotifications(false);
          }}
          className="flex items-center gap-2 bg-sky-100 hover:bg-sky-200 px-3 py-2 rounded-full transition"
        >
          <UserCircleIcon className="h-6 w-6 text-sky-700" />
          <ChevronDownIcon className="h-4 w-4 text-sky-600" />
        </button>

        {/* Profile Dropdown */}
        {showProfile && (
          <div className="absolute right-0 top-12 bg-white w-56 shadow-xl border rounded-xl z-50 animate-fadeIn scale-95 origin-top-right transition-transform duration-200">
            <div className="p-3 border-b">
              <p className="font-medium text-gray-800">{user.name}</p>
              <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full text-left px-4 py-3 text-gray-700 hover:bg-sky-100 transition rounded-b-xl"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
