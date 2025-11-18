// components/Navbar.tsx
import React from "react";

const Navbar = () => {
  return (
    <header className="bg-sky-50 border-b border-sky-200 py-4 px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-3 md:gap-0 shadow-sm">
      {/* Left Section: App Name + Quote */}
      <div className="flex flex-col">
        <h1 className="text-2xl md:text-3xl font-extrabold text-sky-700">
          DoTrack
        </h1>
        <p className="text-sm md:text-base text-sky-500 mt-1">
          Don’t just dream — schedule it
        </p>
      </div>

      {/* Right Section: Search + Profile */}
      <nav>
        <ul className="flex items-center space-x-4">
          {/* Search Input */}
          <li>
            <input
              type="text"
              placeholder="Search tasks..."
              className="px-3 py-2 border border-sky-200 rounded-md bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-sky-400 transition w-full md:w-64"
            />
          </li>

          {/* User Profile */}
          <li>
            <button className="flex items-center space-x-2 p-2 rounded-full hover:bg-sky-100 transition">
              <span className="h-8 w-8 rounded-full bg-sky-300 flex items-center justify-center text-sm font-semibold text-sky-700">
                JD
              </span>
              <span className="text-gray-700 hidden md:inline">John Doe</span>
            </button>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
