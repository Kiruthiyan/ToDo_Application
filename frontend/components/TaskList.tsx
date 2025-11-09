"use client";

import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

interface NewTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (task: {
    title: string;
    description: string;
    priority: "low" | "medium" | "high";
    dueDate: string;
  }) => void;
}

export default function NewTaskModal({ isOpen, onClose, onAddTask }: NewTaskModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState(dayjs().format("YYYY-MM-DD"));

  const handleSubmit = () => {
    if (!title.trim()) return;
    onAddTask({ title, description, priority, dueDate });
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(dayjs().format("YYYY-MM-DD"));
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white rounded-3xl shadow-2xl p-6 w-full max-w-md relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-sky-800">New Task</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
            <XMarkIcon className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          {/* Title */}
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50 placeholder-gray-400 text-gray-900 transition"
          />

          {/* Description */}
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50 placeholder-gray-400 text-gray-900 resize-y transition"
            rows={4}
          />

          {/* Due Date & Priority */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-gray-600 text-sm mb-1">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50 text-gray-900"
              />
            </div>
            <div className="flex-1">
              <label className="block text-gray-600 text-sm mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-sky-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50 text-gray-900"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSubmit}
              className="flex-1 py-3 bg-gradient-to-r from-sky-700 to-sky-900 text-white font-semibold rounded-2xl hover:from-sky-800 hover:to-sky-950 transition shadow-lg"
            >
              Add Task
            </button>
            <button
              onClick={onClose}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
