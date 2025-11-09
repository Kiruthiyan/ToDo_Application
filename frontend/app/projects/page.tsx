"use client";

import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { CalendarIcon, ClockIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Project {
  title: string;
  progress: number;
  description: string;
  priority: "High" | "Medium" | "Low";
  deadline: string;
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // New project state
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState<"High" | "Medium" | "Low">("Medium");
  const [newDeadline, setNewDeadline] = useState("");
  const [newProgress, setNewProgress] = useState(0);

  const addProject = () => {
    if (!newTitle || !newDeadline) return;
    const newProject: Project = {
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      deadline: newDeadline,
      progress: newProgress,
    };
    setProjects([...projects, newProject]);
    setNewTitle("");
    setNewDescription("");
    setNewPriority("Medium");
    setNewDeadline("");
    setNewProgress(0);
    setIsAddOpen(false);
  };

  const progressColor = (progress: number, deadline: string) => {
    const today = new Date();
    const projectDate = new Date(deadline);
    if (projectDate < today) return "bg-red-500"; // overdue
    if (progress >= 75) return "bg-sky-600";
    if (progress >= 50) return "bg-sky-500";
    return "bg-sky-400";
  };

  const priorityColor = (priority: string) => {
    switch (priority) {
      case "High": return "bg-red-500";
      case "Medium": return "bg-yellow-400";
      case "Low": return "bg-green-400";
      default: return "bg-gray-400";
    }
  };

  const badgeStatus = (deadline: string) => {
    const today = new Date();
    const projectDate = new Date(deadline);
    return projectDate < today ? "Overdue" : "Upcoming";
  };

  const badgeColor = (deadline: string) => (badgeStatus(deadline) === "Overdue" ? "bg-red-500" : "bg-sky-500");

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-sky-600 flex items-center gap-2">📁 Projects Dashboard</h1>
              <button
                onClick={() => setIsAddOpen(true)}
                className="flex items-center gap-2 bg-sky-400 text-white px-4 py-1.5 rounded-2xl shadow hover:bg-sky-500 transition font-medium"
              >
                <PlusIcon className="h-4 w-4" /> Add Project
              </button>
            </div>

            {projects.length === 0 ? (
              <p className="text-gray-500 text-center mt-20">No projects yet. Click "Add Project" to start.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((project, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition transform hover:-translate-y-1 cursor-pointer"
                    onClick={() => setSelectedProject(project)}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="font-semibold text-xl text-gray-900">{project.title}</h2>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${priorityColor(project.priority)}`}>
                        {project.priority}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{project.description}</p>

                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2 text-gray-500 text-xs">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{project.deadline}</span>
                      </div>
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full text-white ${badgeColor(project.deadline)}`}>
                        {badgeStatus(project.deadline)}
                      </span>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`${progressColor(project.progress, project.deadline)} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-gray-700 text-xs mt-1">Progress: {project.progress}%</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal for Project Details */}
          {selectedProject && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 backdrop-blur-sm">
              <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg border border-gray-200 relative">
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <XMarkIcon className="h-5 w-5 text-gray-700" />
                </button>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.title}</h2>
                <span className={`text-sm font-bold px-2 py-1 rounded-full text-white ${priorityColor(selectedProject.priority)}`}>
                  {selectedProject.priority}
                </span>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full text-white ml-2 ${badgeColor(selectedProject.deadline)}`}>
                  {badgeStatus(selectedProject.deadline)}
                </span>
                <p className="text-gray-700 mt-3">{selectedProject.description}</p>
                <div className="flex items-center gap-3 mt-4 text-gray-500 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  <span>Deadline: {selectedProject.deadline}</span>
                  <ClockIcon className="h-4 w-4" />
                  <span>Progress: {selectedProject.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                  <div
                    className={`${progressColor(selectedProject.progress, selectedProject.deadline)} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${selectedProject.progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {/* Add Project Modal */}
          {isAddOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-20 backdrop-blur-md">
              <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-lg border border-gray-200 relative">
                <button
                  onClick={() => setIsAddOpen(false)}
                  className="absolute top-3 right-3 p-1 hover:bg-gray-100 rounded-full transition"
                >
                  <XMarkIcon className="h-4 w-4 text-gray-700" />
                </button>
                <h2 className="text-lg font-bold text-gray-900 mb-3">New Project</h2>
                <input
                  type="text"
                  placeholder="Project Title"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 placeholder-gray-500 transition"
                />
                <input
                  type="text"
                  placeholder="Description"
                  value={newDescription}
                  onChange={e => setNewDescription(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 placeholder-gray-500 transition"
                />
                <input
                  type="date"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 transition"
                />
                <input
                  type="number"
                  placeholder="Progress (%)"
                  value={newProgress}
                  min={0}
                  max={100}
                  onChange={e => setNewProgress(Number(e.target.value))}
                  className="w-full mb-2 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 transition"
                />
                <select
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value as "Low" | "Medium" | "High")}
                  className="w-full mb-3 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-gray-50 text-gray-900 transition"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <button
                  onClick={addProject}
                  className="w-full py-2 bg-sky-400 text-white font-medium rounded-lg hover:bg-sky-500 transition"
                >
                  Add Project
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
