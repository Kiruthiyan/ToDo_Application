"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  LightBulbIcon,
  CalendarIcon,
  BriefcaseIcon,
  CogIcon,
  RectangleGroupIcon,
  MoonIcon,
  SunIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  // Load saved theme
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  // Apply dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode]);

  const navItems = [
    { name: "Tasks", href: "/todos", icon: LightBulbIcon },
    { name: "Calendar", href: "/calendar", icon: CalendarIcon },
    { name: "Projects", href: "/projects", icon: BriefcaseIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
    { name: "Integrations", href: "/integrations", icon: RectangleGroupIcon },
  ];

  return (
    <aside
      className={`${
        collapsed ? "w-20" : "w-64"
      } h-screen flex flex-col p-4 border-r shadow-md transition-all duration-300 ease-in-out
        ${
          isDarkMode
            ? "bg-gradient-to-b from-gray-900 to-gray-950 text-gray-100 border-gray-800"
            : "bg-gradient-to-b from-sky-50 to-white text-gray-900 border-sky-100"
        }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center justify-between mb-10 ${
          collapsed ? "flex-col space-y-3" : ""
        }`}
      >
        {!collapsed && (
          <div className="text-3xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-sky-600 via-sky-500 to-sky-400 bg-clip-text text-transparent drop-shadow-sm">
              Do<span className="text-sky-600">Track</span>
            </span>
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={`p-2 rounded-md transition-colors duration-200 ${
            isDarkMode
              ? "hover:bg-gray-800 text-gray-300"
              : "hover:bg-sky-100 text-sky-700"
          }`}
        >
          {collapsed ? (
            <ChevronRightIcon className="h-5 w-5" />
          ) : (
            <ChevronLeftIcon className="h-5 w-5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.name}>
                <Link
                  href={item.href}
                  className={`flex items-center ${
                    collapsed ? "justify-center" : ""
                  } p-3 rounded-lg font-medium transition-all duration-200 relative
                    ${
                      isDarkMode
                        ? isActive
                          ? "bg-gray-800 text-sky-400"
                          : "hover:bg-gray-800 text-gray-300"
                        : isActive
                        ? "bg-gradient-to-r from-sky-100 to-sky-50 text-sky-700 font-semibold"
                        : "hover:bg-sky-100 hover:text-sky-700 text-gray-900"
                    }`}
                >
                  {isActive && (
                    <span
                      className={`absolute left-0 top-0 h-full w-1 rounded-r-full ${
                        isDarkMode
                          ? "bg-sky-500"
                          : "bg-gradient-to-b from-sky-500 to-sky-400"
                      }`}
                    />
                  )}
                  <item.icon
                    className={`h-6 w-6 ${
                      isDarkMode ? "text-sky-400" : "text-sky-600"
                    } ${collapsed ? "" : "mr-3"}`}
                  />
                  {!collapsed && <span>{item.name}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Dark Mode Toggle */}
      <div
        className={`mt-auto pt-4 border-t flex items-center ${
          collapsed ? "justify-center" : "justify-between"
        } ${isDarkMode ? "border-gray-800" : "border-sky-100"}`}
      >
        {!collapsed && (
          <span className="font-medium text-sm text-gray-700 dark:text-gray-300">
            Dark Mode
          </span>
        )}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none ${
            isDarkMode ? "bg-sky-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md ring-0 transition duration-300 ${
              isDarkMode ? "translate-x-5" : "translate-x-1"
            }`}
          >
            {isDarkMode ? (
              <MoonIcon className="h-4 w-4 text-sky-700 m-auto" />
            ) : (
              <SunIcon className="h-4 w-4 text-yellow-500 m-auto" />
            )}
          </span>
        </button>
      </div>
    </aside>
  );
}
