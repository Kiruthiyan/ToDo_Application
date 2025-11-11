// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, Squares2X2Icon, Bars3Icon, ArchiveBoxIcon, ListBulletIcon, BookmarkIcon } from "@heroicons/react/24/outline";
import { motion, AnimatePresence } from "framer-motion";
import dayjs from "dayjs";
import api from "@/lib/api"; // Ensure this path is correct for your project

interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

interface Todo {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority?: "low" | "medium" | "high";
  dueDate?: string;
  subtasks?: Subtask[];
  status?: "todo" | "inprogress" | "completed";
}

// Custom Checkbox Component for better styling
const CustomCheckbox = ({ checked, onChange }: { checked: boolean; onChange: () => void }) => (
  <div
    className={`w-5 h-5 flex items-center justify-center rounded-md border-2 cursor-pointer transition-all duration-200
      ${checked ? "bg-indigo-600 border-indigo-600" : "bg-gray-300 border-gray-300 hover:border-indigo-400"}`}
    onClick={onChange}
  >
    {checked && <CheckIcon className="h-4 w-4 text-white" />}
  </div>
);

// Priority Tag Component
const PriorityTag = ({ priority }: { priority: "low" | "medium" | "high" }) => {
  const colors = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-green-500",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-white text-xs font-semibold ${colors[priority]} flex-shrink-0`}>
      {priority.toUpperCase()}
    </span>
  );
};

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null);

  // Task Form State
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [status, setStatus] = useState<"todo" | "inprogress" | "completed">("todo");

  // Delete Modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDeleteId, setTodoToDeleteId] = useState<string | null>(null);

  // View toggle
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Filter
  const [filter, setFilter] = useState<"all" | "todo" | "inprogress" | "completed">("all");

  // Fetch Todos
  const fetchTodos = async () => {
    try {
      const res = await api.get("/todos");
      const fetchedTodos: Todo[] = res.data.map((todo: any) => ({
        id: todo.id.toString(),
        title: todo.title,
        description: todo.description || "",
        completed: todo.completed,
        priority: todo.priority || "medium",
        dueDate: todo.dueDate || dayjs().format("YYYY-MM-DD"),
        subtasks: todo.subtasks || [],
        status: todo.status || "todo",
      }));
      setTodos(fetchedTodos);
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks. Try again.");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  // Modal
  const openCreateModal = () => {
    setModalMode("create");
    setCurrentTodo(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(dayjs().format("YYYY-MM-DD"));
    setSubtasks([]);
    setStatus("todo");
    setIsModalOpen(true);
  };

  const openEditModal = (todo: Todo) => {
    setModalMode("edit");
    setCurrentTodo(todo);
    setTitle(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority || "medium");
    setDueDate(todo.dueDate || dayjs().format("YYYY-MM-DD"));
    setSubtasks(todo.subtasks || []);
    setStatus(todo.status || "todo");
    setIsModalOpen(true);
  };

  // Subtask handlers
  const addSubtask = () => setSubtasks([...subtasks, { id: Date.now().toString(), title: "", completed: false }]);
  const updateSubtask = (id: string, title: string) => setSubtasks(subtasks.map(s => s.id === id ? { ...s, title } : s));
  const toggleSubtaskComplete = (id: string) => setSubtasks(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  const deleteSubtask = (id: string) => setSubtasks(subtasks.filter(s => s.id !== id));

  // Save Task
  const handleSaveTask = async () => {
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      if (modalMode === "create") {
        await api.post("/todos", { title, description, completed: false, priority, dueDate, subtasks, status });
      } else if (modalMode === "edit" && currentTodo) {
        await api.put(`/todos/${currentTodo.id}`, { title, description, priority, dueDate, subtasks, status });
      }
      setIsModalOpen(false);
      fetchTodos();
      setError(null); // Clear error on successful save
    } catch (err) {
      console.error(err);
      setError("Failed to save task.");
    }
  };

  // Delete Task
  const handleDeleteTask = async (id: string) => {
    try {
      await api.delete(`/todos/${id}`);
      setIsDeleteModalOpen(false);
      setTodoToDeleteId(null);
      fetchTodos();
      setError(null); // Clear error on successful delete
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  // Toggle Complete & Status Update
  const handleToggleComplete = async (todo: Todo) => {
    try {
      const newCompleted = !todo.completed;
      const newStatus = newCompleted ? "completed" : "todo";
      await api.put(`/todos/${todo.id}`, { ...todo, completed: newCompleted, status: newStatus });
      fetchTodos();
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  const filteredTodos = todos.filter(todo => filter === "all" ? true : todo.status === filter);

  const getFilterIcon = (f: string) => {
    switch (f) {
      case "all": return <ListBulletIcon className="h-5 w-5" />;
      case "todo": return <BookmarkIcon className="h-5 w-5" />;
      case "inprogress": return <ArchiveBoxIcon className="h-5 w-5" />;
      case "completed": return <CheckIcon className="h-5 w-5" />;
      default: return <ListBulletIcon className="h-5 w-5" />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 text-gray-900 font-sans antialiased overflow-hidden">
      {/* Top Header Bar */}
      <header className="flex items-center justify-between p-6 bg-white border-b border-gray-100 shadow-sm z-20 shrink-0">
        <div className="flex items-center gap-6">
          <h1 className="text-3xl font-extrabold text-indigo-800 tracking-tight">Taskify.</h1>
          {/* Filter Buttons in Header */}
          <div className="flex gap-2 bg-gray-100 rounded-xl p-1">
            {["all", "todo", "inprogress", "completed"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
                  ${filter === f ? "bg-indigo-600 text-white shadow-md" : "text-gray-700 hover:bg-white"}`}
              >
                {getFilterIcon(f)}
                <span className="capitalize">{f === "inprogress" ? "In Progress" : f}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Right side of header */}
        <div className="flex gap-4 items-center">
          {/* View Mode Toggle */}
          <button onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
            className="p-3 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition-all duration-200 shadow-sm">
            {viewMode === "list" ? <Squares2X2Icon className="h-6 w-6" /> : <Bars3Icon className="h-6 w-6" />}
          </button>
          {/* Add New Task Button */}
          <button onClick={openCreateModal}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
            <PlusIcon className="h-6 w-6" /> Add Task
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto">
        {/* Error Display */}
        <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative mb-6"
            role="alert"
          >
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <XMarkIcon className="h-5 w-5 cursor-pointer" onClick={() => setError(null)} />
            </span>
          </motion.div>
        )}
        </AnimatePresence>

        {/* Task Grid/List */}
        <AnimatePresence>
          <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "flex flex-col gap-4"}`}>
            {filteredTodos.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-full text-center py-12 text-gray-500 text-xl"
              >
                No tasks found for this filter. Start by adding a new task!
              </motion.div>
            )}
            {filteredTodos.map(todo => {
              const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
              const totalSubtasks = todo.subtasks?.length || 0;
              const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

              return (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 20px rgba(0,0,0,0.08)" }}
                  transition={{ duration: 0.2 }}
                  className="relative bg-white rounded-xl p-6 shadow-md border border-gray-100 flex flex-col justify-between hover:border-indigo-200 transition-all duration-200"
                >
                  {/* Task Header */}
                  <div className="flex items-center justify-between mb-3">
                    <CustomCheckbox checked={todo.completed} onChange={() => handleToggleComplete(todo)} />
                    <PriorityTag priority={todo.priority || "medium"} />
                  </div>

                  {/* Task Info */}
                  <div className="flex-1 mb-4">
                    <h3 className={`text-xl font-bold ${todo.completed ? "line-through text-gray-400 opacity-80" : "text-gray-800"}`}>
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p className={`text-sm mt-2 ${todo.completed ? "text-gray-400" : "text-gray-600"} line-clamp-2`}>
                        {todo.description}
                      </p>
                    )}
                  </div>

                  {/* Subtask Progress */}
                  {totalSubtasks > 0 && (
                    <div className="mt-4 mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Subtasks</span>
                        <span>{completedSubtasks}/{totalSubtasks}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <motion.div
                          className="h-2 rounded-full bg-indigo-500"
                          animate={{ width: `${subtaskProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Footer: Due Date and Actions */}
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    {todo.dueDate && (
                      <span className="text-sm text-gray-500 flex items-center gap-1">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dayjs(todo.dueDate).format("DD MMM, YYYY")}
                      </span>
                    )}
                    <div className="flex gap-2">
                      <button onClick={() => openEditModal(todo)} className="p-2 hover:bg-gray-100 rounded-full transition" title="Edit">
                        <PencilIcon className="h-5 w-5 text-indigo-600" />
                      </button>
                      <button onClick={() => { setTodoToDeleteId(todo.id); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-red-100 rounded-full transition" title="Delete">
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </main>

      {/* Task Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <Modal title={modalMode === "create" ? "New Task" : "Edit Task"} onClose={() => setIsModalOpen(false)}>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded-lg relative mb-4 text-sm"
                role="alert"
              >
                {error}
              </motion.div>
            )}
            <input
              type="text"
              placeholder="Task Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 placeholder-gray-400 transition shadow-sm"
            />
            <textarea
              placeholder="Task Description (Optional)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-4 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y bg-white text-gray-800 placeholder-gray-400 transition shadow-sm"
              rows={3}
            />

            {/* Subtasks */}
            <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-3">
                <span className="text-gray-700 font-semibold text-lg">Subtasks</span>
                <button onClick={addSubtask} className="text-indigo-600 hover:text-indigo-800 text-sm flex items-center gap-1 transition">
                  <PlusIcon className="h-5 w-5" /> Add Subtask
                </button>
              </div>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {subtasks.length === 0 && <p className="text-gray-500 text-sm">No subtasks yet. Click "Add Subtask" to get started.</p>}
                {subtasks.map(sub => (
                  <div key={sub.id} className="flex items-center gap-3 bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                    <CustomCheckbox checked={sub.completed} onChange={() => toggleSubtaskComplete(sub.id)} />
                    <input
                      type="text"
                      value={sub.title}
                      onChange={(e) => updateSubtask(sub.id, e.target.value)}
                      placeholder="Subtask title"
                      className={`flex-1 p-2 border-0 focus:outline-none rounded-md bg-transparent ${sub.completed ? "line-through text-gray-500" : "text-gray-800"}`}
                    />
                    <button onClick={() => deleteSubtask(sub.id)} className="p-1 hover:bg-red-100 rounded-full transition">
                      <TrashIcon className="h-5 w-5 text-red-500" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4 mb-6">
              <div className="flex-1">
                <label className="text-gray-700 text-sm font-medium mb-1 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 shadow-sm transition"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div className="flex-1">
                <label className="text-gray-700 text-sm font-medium mb-1 block">Due Date</label>
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 shadow-sm transition"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleSaveTask}
                disabled={!title.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
              >
                {modalMode === "create" ? "Add Task" : "Update Task"}
              </button>
              <button
                onClick={() => setIsModalOpen(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>


      {/* Delete Modal */}
      <AnimatePresence>
        {isDeleteModalOpen && todoToDeleteId && (
          <Modal title="Confirm Deletion" onClose={() => setIsDeleteModalOpen(false)}>
            <p className="text-gray-700 mb-6 text-center text-lg">
              Are you sure you want to delete this task? This action cannot be undone.
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => handleDeleteTask(todoToDeleteId)}
                className="flex-1 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700 transition-colors duration-200 shadow-md"
              >
                Delete
              </button>
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Component (Enhanced with Framer Motion)
const Modal = ({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50 p-4">
    <motion.div
      initial={{ scale: 0.85, opacity: 0, y: 50 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.85, opacity: 0, y: 50 }}
      transition={{ type: "spring", damping: 20, stiffness: 300 }}
      className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg transition transform border border-gray-100"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-indigo-800">{title}</h2>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
          <XMarkIcon className="h-6 w-6 text-gray-500" />
        </button>
      </div>
      {children}
    </motion.div>
  </div>
);