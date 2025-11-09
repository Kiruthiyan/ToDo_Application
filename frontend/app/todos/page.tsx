"use client";

import { useState, useEffect } from "react";
import { PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon, Squares2X2Icon, Bars3Icon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import api from "@/lib/api";

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
    if (!title.trim()) return setError("Task title cannot be empty.");

    try {
      if (modalMode === "create") {
        await api.post("/todos", { title, description, completed: false, priority, dueDate, subtasks, status });
      } else if (modalMode === "edit" && currentTodo) {
        await api.put(`/todos/${currentTodo.id}`, { title, description, priority, dueDate, subtasks, status });
      }
      setIsModalOpen(false);
      fetchTodos();
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
    } catch (err) {
      console.error(err);
      setError("Failed to delete task.");
    }
  };

  // Toggle Complete
  const handleToggleComplete = async (todo: Todo) => {
    try {
      const newStatus = todo.completed ? "todo" : "completed";
      await api.put(`/todos/${todo.id}`, { ...todo, completed: !todo.completed, status: newStatus });
      fetchTodos();
    } catch (err) {
      console.error(err);
      setError("Failed to update task.");
    }
  };

  const priorityColor = (priority?: string) => {
    switch (priority) {
      case "high": return "bg-red-500";
      case "medium": return "bg-yellow-400";
      case "low": return "bg-green-400";
      default: return "bg-gray-400";
    }
  };

  const filteredTodos = todos.filter(todo => filter === "all" ? true : todo.status === filter);

  return (
    <div className="flex h-screen w-full bg-sky-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col gap-6 p-4 shrink-0">
        <h1 className="text-2xl font-bold text-sky-800">Tasks Panel</h1>
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`py-2 px-4 rounded-xl ${filter === "all" ? "bg-sky-600 text-white" : "bg-sky-100 text-gray-700"}`}
          >All</button>
          <button
            onClick={() => setFilter("todo")}
            className={`py-2 px-4 rounded-xl ${filter === "todo" ? "bg-sky-600 text-white" : "bg-sky-100 text-gray-700"}`}
          >Todo</button>
          <button
            onClick={() => setFilter("inprogress")}
            className={`py-2 px-4 rounded-xl ${filter === "inprogress" ? "bg-sky-600 text-white" : "bg-sky-100 text-gray-700"}`}
          >In Progress</button>
          <button
            onClick={() => setFilter("completed")}
            className={`py-2 px-4 rounded-xl ${filter === "completed" ? "bg-sky-600 text-white" : "bg-sky-100 text-gray-700"}`}
          >Completed</button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 flex flex-col p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-extrabold text-sky-900">My Todos</h2>
          <div className="flex gap-2 items-center">
            <button onClick={() => setViewMode(viewMode === "list" ? "grid" : "list")}
              className="p-2 rounded-lg bg-sky-100 hover:bg-sky-200 transition">
              {viewMode === "list" ? <Squares2X2Icon className="h-5 w-5 text-sky-700" /> : <Bars3Icon className="h-5 w-5 text-sky-700" />}
            </button>
            <button onClick={openCreateModal}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-sky-600 to-blue-500 text-white font-semibold shadow-lg hover:scale-105 transition-transform">
              <PlusIcon className="h-5 w-5" /> New Task
            </button>
          </div>
        </div>

        {/* Task Grid/List */}
        <div className={`${viewMode === "grid" ? "grid grid-cols-3 gap-4" : "flex flex-col gap-4"}`}>
          {filteredTodos.map(todo => {
            const completedSubtasks = todo.subtasks?.filter(s => s.completed).length || 0;
            const totalSubtasks = todo.subtasks?.length || 0;
            const subtaskProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

            return (
              <motion.div
                key={todo.id}
                layout
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="relative bg-white rounded-3xl p-5 shadow-md border border-sky-100 cursor-pointer flex justify-between"
              >
                {/* Left: Task Info */}
                <div className="flex-1 pr-4">
                  <h3 className={`text-lg font-semibold ${todo.completed ? "line-through text-gray-400 opacity-70" : "text-gray-800"}`}>{todo.title}</h3>
                  {todo.description && <p className={`text-sm mt-1 ${todo.completed ? "text-gray-300" : "text-gray-500"}`}>{todo.description}</p>}
                  {todo.subtasks && todo.subtasks.length > 0 && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Subtasks</span>
                        <span>{completedSubtasks}/{totalSubtasks}</span>
                      </div>
                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <motion.div
                          className="h-2 rounded-full bg-sky-500"
                          animate={{ width: `${subtaskProgress}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Right: Actions & Meta */}
                <div className="flex flex-col items-end gap-2">
                  <div className={`px-3 py-1 rounded-bl-3xl text-white text-xs font-bold ${priorityColor(todo.priority)}`}>
                    {todo.priority?.toUpperCase()}
                  </div>
                  {todo.dueDate && <span className="text-xs text-gray-400">{dayjs(todo.dueDate).format("DD MMM, YYYY")}</span>}
                  <button onClick={() => handleToggleComplete(todo)} className="p-1 hover:bg-sky-100 rounded-full transition" title="Complete">
                    <CheckIcon className="h-5 w-5 text-green-500" />
                  </button>
                  <button onClick={() => openEditModal(todo)} className="p-1 hover:bg-gray-100 rounded-full transition" title="Edit">
                    <PencilIcon className="h-5 w-5 text-sky-600" />
                  </button>
                  <button onClick={() => { setTodoToDeleteId(todo.id); setIsDeleteModalOpen(true); }} className="p-1 hover:bg-red-100 rounded-full transition" title="Delete">
                    <TrashIcon className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </main>

      {/* Task Modal */}
      {isModalOpen && (
        <Modal title={modalMode === "create" ? "New Task" : "Edit Task"} onClose={() => setIsModalOpen(false)}>
          <input
            type="text"
            placeholder="Task Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full mb-3 p-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50 text-gray-900 placeholder-gray-400 transition"
          />
          <textarea
            placeholder="Task Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full mb-3 p-3 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 resize-y bg-sky-50 text-gray-900 placeholder-gray-400 transition"
            rows={4}
          />

          {/* Subtasks */}
          <div className="mb-3">
            <div className="flex justify-between items-center mb-2">
              <span className="text-gray-600 font-semibold">Subtasks</span>
              <button onClick={addSubtask} className="text-sky-600 hover:underline text-sm flex items-center gap-1">
                <PlusIcon className="h-4 w-4" /> Add
              </button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {subtasks.map(sub => (
                <div key={sub.id} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={sub.completed}
                    onChange={() => toggleSubtaskComplete(sub.id)}
                    className="w-4 h-4 text-sky-600 rounded focus:ring-sky-400"
                  />
                  <input
                    type="text"
                    value={sub.title}
                    onChange={(e) => updateSubtask(sub.id, e.target.value)}
                    placeholder="Subtask title"
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400 bg-sky-50"
                  />
                  <button onClick={() => deleteSubtask(sub.id)} className="p-1 hover:bg-red-100 rounded-full transition">
                    <TrashIcon className="h-4 w-4 text-red-500" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mb-3">
            <div className="flex-1">
              <label className="text-gray-600 text-sm mb-1 block">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full p-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="text-gray-600 text-sm mb-1 block">Due Date</label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full p-2 border border-sky-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-sky-50"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleSaveTask}
              disabled={!title.trim()}
              className="flex-1 py-3 bg-gradient-to-r from-sky-600 to-blue-500 text-white font-semibold rounded-2xl hover:scale-105 transition-transform disabled:bg-gray-400"
            >
              {modalMode === "create" ? "Add Task" : "Update Task"}
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && todoToDeleteId && (
        <Modal title="Confirm Deletion" onClose={() => setIsDeleteModalOpen(false)}>
          <p className="text-gray-700 mb-6">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => handleDeleteTask(todoToDeleteId)}
              className="flex-1 py-3 bg-red-500 text-white font-semibold rounded-2xl hover:bg-red-600 transition"
            >
              Delete
            </button>
            <button
              onClick={() => setIsDeleteModalOpen(false)}
              className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-2xl hover:bg-gray-200 transition"
            >
              Cancel
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Modal Component
const Modal = ({ children, title, onClose }: { children: React.ReactNode; title: string; onClose: () => void }) => (
  <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex justify-center items-center z-50">
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white p-6 rounded-3xl shadow-2xl w-full max-w-md transition transform"
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-sky-800">{title}</h2>
        <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full transition">
          <XMarkIcon className="h-5 w-5 text-gray-600" />
        </button>
      </div>
      {children}
    </motion.div>
  </div>
);
