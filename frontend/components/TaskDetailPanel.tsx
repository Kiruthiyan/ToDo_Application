"use client";

import { Todo } from "@/app/todos/page";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

interface TaskDetailPanelProps {
  task: Todo;
  onClose: () => void;
}

export default function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const priorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-gradient-to-r from-red-500 to-pink-500";
      case "medium":
        return "bg-gradient-to-r from-yellow-400 to-orange-400";
      case "low":
        return "bg-gradient-to-r from-green-400 to-teal-400";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <motion.div
      className="fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 p-6 overflow-y-auto flex flex-col"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      exit={{ x: "100%" }}
    >
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 line-clamp-2">{task.title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition">
          <XMarkIcon className="h-6 w-6 text-gray-600" />
        </button>
      </div>

      {/* Priority */}
      {task.priority && (
        <span
          className={`inline-block text-white px-4 py-1 rounded-full text-sm font-bold mb-4 ${priorityColor(
            task.priority
          )}`}
        >
          {task.priority.toUpperCase()}
        </span>
      )}

      {/* Description */}
      {task.description && (
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{task.description}</p>
      )}

      {/* Due Date */}
      {task.dueDate && (
        <p className="text-gray-400 text-xs mb-4">Due: {task.dueDate}</p>
      )}

      {/* Subtasks */}
      {task.subtasks && task.subtasks.length > 0 && (
        <div className="mt-2">
          <h3 className="text-gray-700 font-semibold mb-2">Subtasks</h3>
          <div className="space-y-2">
            {task.subtasks.map((sub) => (
              <motion.div
                key={sub.id}
                className="flex items-center gap-3 text-gray-600 text-sm p-2 rounded-lg hover:bg-sky-50 transition"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <input
                  type="checkbox"
                  checked={sub.completed}
                  readOnly
                  className="w-5 h-5 text-sky-600 rounded focus:ring-sky-400"
                />
                <span className={sub.completed ? "line-through text-gray-400" : ""}>
                  {sub.title}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
}
