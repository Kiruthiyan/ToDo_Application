// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  PlusIcon, PencilIcon, TrashIcon, CheckIcon, XMarkIcon,
  Squares2X2Icon, Bars3Icon, ArchiveBoxIcon, ListBulletIcon,
  BookmarkIcon, ChevronRightIcon, ChevronLeftIcon, CalendarIcon,
  ExclamationCircleIcon, TagIcon
} from "@heroicons/react/24/outline";
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
const CustomCheckbox = ({ checked, onChange, disabled = false }: { checked: boolean; onChange: () => void; disabled?: boolean }) => (
  <div
    className={`w-5 h-5 flex items-center justify-center rounded-md border-2 cursor-pointer transition-all duration-200
      ${checked ? "bg-indigo-600 border-indigo-600" : "bg-gray-300 border-gray-300 hover:border-indigo-400"}
      ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
    onClick={disabled ? undefined : onChange}
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

  // Modals/Panels State
  const [isTaskFormModalOpen, setIsTaskFormModalOpen] = useState(false); // For Create/Edit Task Modal
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null); // For TaskFormModal

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [todoToDeleteId, setTodoToDeleteId] = useState<string | null>(null);

  const [isTaskDetailPanelOpen, setIsTaskDetailPanelOpen] = useState(false); // For Task Detail Panel
  const [selectedTodoForDetail, setSelectedTodoForDetail] = useState<Todo | null>(null);

  // Task Form State (for both TaskFormModal and TaskDetailPanel)
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [dueDate, setDueDate] = useState(dayjs().format("YYYY-MM-DD"));
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [status, setStatus] = useState<"todo" | "inprogress" | "completed">("todo");

  // View toggle
  const [viewMode, setViewMode] = useState<"list" | "grid">("list");

  // Filter
  const [filter, setFilter] = useState<"all" | "todo" | "inprogress" | "completed">("all");

  // Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  // Task Form Modal handlers
  const openCreateModal = () => {
    setModalMode("create");
    setCurrentTodo(null);
    setTitle("");
    setDescription("");
    setPriority("medium");
    setDueDate(dayjs().format("YYYY-MM-DD"));
    setSubtasks([]);
    setStatus("todo");
    setIsTaskFormModalOpen(true);
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
    setIsTaskFormModalOpen(true);
  };

  const closeTaskFormModal = () => {
    setIsTaskFormModalOpen(false);
    setError(null);
  };

  // Task Detail Panel handlers
  const openTaskDetailPanel = (todo: Todo) => {
    setSelectedTodoForDetail(todo);
    // Populate form states for direct editing in panel
    setTitle(todo.title);
    setDescription(todo.description || "");
    setPriority(todo.priority || "medium");
    setDueDate(todo.dueDate || dayjs().format("YYYY-MM-DD"));
    setSubtasks(JSON.parse(JSON.stringify(todo.subtasks || []))); // Deep copy for mutable subtasks
    setStatus(todo.status || "todo");
    setIsTaskDetailPanelOpen(true);
  };

  const closeTaskDetailPanel = () => {
    setIsTaskDetailPanelOpen(false);
    setSelectedTodoForDetail(null);
    setError(null);
  };

  // Subtask handlers (used by both TaskFormModal and TaskDetailPanel)
  const addSubtask = () => setSubtasks([...subtasks, { id: Date.now().toString(), title: "", completed: false }]);
  const updateSubtask = (id: string, newTitle: string) => setSubtasks(subtasks.map(s => s.id === id ? { ...s, title: newTitle } : s));
  const toggleSubtaskComplete = (id: string) => setSubtasks(prev => prev.map(s => s.id === id ? { ...s, completed: !s.completed } : s));
  const deleteSubtask = (id: string) => setSubtasks(subtasks.filter(s => s.id !== id));

  // Save Task (used by both TaskFormModal and TaskDetailPanel)
  const handleSaveTask = async () => {
    if (!title.trim()) {
      setError("Task title cannot be empty.");
      return;
    }

    try {
      const taskData = { title, description, priority, dueDate, subtasks, status };
      if (modalMode === "create") {
        await api.post("/todos", { ...taskData, completed: false });
      } else if (modalMode === "edit" && currentTodo) {
        await api.put(`/todos/${currentTodo.id}`, { ...currentTodo, ...taskData, completed: status === "completed" });
      } else if (selectedTodoForDetail) { // Save from detail panel
        await api.put(`/todos/${selectedTodoForDetail.id}`, { ...selectedTodoForDetail, ...taskData, completed: status === "completed" });
      }
      closeTaskFormModal();
      closeTaskDetailPanel();
      fetchTodos();
      setError(null);
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
      closeTaskDetailPanel(); // Close panel if deleting current task
      fetchTodos();
      setError(null);
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
      // If the task being completed is in the detail panel, update its state
      if (selectedTodoForDetail && selectedTodoForDetail.id === todo.id) {
        setSelectedTodoForDetail(prev => prev ? { ...prev, completed: newCompleted, status: newStatus } : null);
        setStatus(newStatus); // Also update the local status state for the panel
      }
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
    <div className="flex h-screen w-full bg-gray-50 text-gray-900 font-sans antialiased overflow-hidden">
      {/* Sidebar - Dynamically sized */}
      <motion.aside
        initial={{ width: '16rem' }} // w-64
        animate={{ width: isSidebarOpen ? '16rem' : '4rem' }} // w-64 vs w-16
        transition={{ duration: 0.2, ease: "easeInOut" }}
        className="bg-white border-r border-gray-100 flex flex-col p-6 shadow-xl z-10 shrink-0 overflow-hidden"
      >
        <div className="flex items-center justify-between mb-8">
          {isSidebarOpen && <h1 className="text-3xl font-extrabold text-indigo-800 tracking-tight">Taskify.</h1>}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition"
            title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
          >
            {isSidebarOpen ? <ChevronLeftIcon className="h-6 w-6" /> : <ChevronRightIcon className="h-6 w-6" />}
          </button>
        </div>

        {isSidebarOpen && (
          <div className="flex flex-col gap-3">
            {/* You could add more sidebar items here if needed,
                but for now, filters are in the header as per request */}
            <p className="text-gray-500 text-sm">Navigation items could go here.</p>
          </div>
        )}
      </motion.aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col p-8 overflow-y-auto relative">
        {/* Top Header Bar */}
        <header className="flex items-center justify-between pb-6 mb-8 bg-gray-50 sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center gap-6">
            <h2 className="text-4xl font-extrabold text-indigo-900 tracking-tight">Today's Tasks</h2>
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
                  onClick={() => openTaskDetailPanel(todo)} // Open detail panel on click
                >
                  {/* Task Header */}
                  <div className="flex items-center justify-between mb-3">
                    <CustomCheckbox checked={todo.completed} onChange={(e) => { e.stopPropagation(); handleToggleComplete(todo); }} />
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
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                        {dayjs(todo.dueDate).format("DD MMM, YYYY")}
                      </span>
                    )}
                    <div className="flex gap-2">
                      {/*
                        Removed direct edit/delete buttons from card to encourage using the detail panel.
                        Could be re-added if quick actions are preferred.
                      <button onClick={(e) => { e.stopPropagation(); openEditModal(todo); }} className="p-2 hover:bg-gray-100 rounded-full transition" title="Edit">
                        <PencilIcon className="h-5 w-5 text-indigo-600" />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); setTodoToDeleteId(todo.id); setIsDeleteModalOpen(true); }} className="p-2 hover:bg-red-100 rounded-full transition" title="Delete">
                        <TrashIcon className="h-5 w-5 text-red-500" />
                      </button>
                      */}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>
      </main>

      {/* Task Form Modal (for Add/Edit Task actions) */}
      <AnimatePresence>
        {isTaskFormModalOpen && (
          <Modal title={modalMode === "create" ? "New Task" : "Edit Task"} onClose={closeTaskFormModal}>
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
            <TaskForm
              title={title} setTitle={setTitle}
              description={description} setDescription={setDescription}
              priority={priority} setPriority={setPriority}
              dueDate={dueDate} setDueDate={setDueDate}
              subtasks={subtasks}
              addSubtask={addSubtask}
              updateSubtask={updateSubtask}
              toggleSubtaskComplete={toggleSubtaskComplete}
              deleteSubtask={deleteSubtask}
              status={status}
              setStatus={setStatus}
            />

            <div className="flex gap-4 mt-6">
              <button
                onClick={handleSaveTask}
                disabled={!title.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
              >
                {modalMode === "create" ? "Add Task" : "Update Task"}
              </button>
              <button
                onClick={closeTaskFormModal}
                className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-xl hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
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

      {/* Task Detail Side Panel */}
      <AnimatePresence>
        {isTaskDetailPanelOpen && selectedTodoForDetail && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed inset-y-0 right-0 w-full md:w-1/2 lg:w-2/5 xl:w-1/3 bg-white shadow-2xl z-40 flex flex-col p-8 border-l border-gray-100 overflow-y-auto"
          >
            {/* Panel Header */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
              <h2 className="text-3xl font-bold text-indigo-800">Task Details</h2>
              <button onClick={closeTaskDetailPanel} className="p-2 hover:bg-gray-100 rounded-full transition-all duration-200">
                <XMarkIcon className="h-6 w-6 text-gray-500" />
              </button>
            </div>

            {error && ( // Error message specific to the panel
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

            {/* Main Task Info & Editable Fields */}
            <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
              <div className="flex items-center mb-6">
                <CustomCheckbox
                  checked={status === "completed"}
                  onChange={() => handleToggleComplete(selectedTodoForDetail)}
                  disabled={!selectedTodoForDetail}
                />
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`flex-1 text-2xl font-bold ml-4 p-2 border-0 focus:ring-indigo-500 focus:border-indigo-500 rounded-lg bg-transparent
                    ${status === "completed" ? "line-through text-gray-400" : "text-gray-800"}`}
                  placeholder="Task Title"
                />
              </div>

              <div className="mb-6">
                <label className="block text-gray-600 text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-y bg-gray-50 text-gray-800 placeholder-gray-400 transition shadow-sm"
                  rows={6}
                  placeholder="Add a detailed description..."
                />
              </div>

              {/* Status, Priority, Due Date */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800 shadow-sm transition"
                  >
                    <option value="todo">To Do</option>
                    <option value="inprogress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-gray-600 text-sm font-medium mb-2">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800 shadow-sm transition"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-gray-600 text-sm font-medium mb-2">Due Date</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 text-gray-800 shadow-sm transition"
                  />
                </div>
              </div>

              {/* Subtasks Section */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
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
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-auto pt-6 border-t border-gray-100">
              <button
                onClick={handleSaveTask}
                disabled={!title.trim()}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-blue-500 text-white font-semibold rounded-xl hover:scale-105 transition-transform duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
              >
                Save Changes
              </button>
              <button
                onClick={() => {
                  setTodoToDeleteId(selectedTodoForDetail.id);
                  setIsDeleteModalOpen(true);
                  // Don't close panel yet, wait for delete confirmation
                }}
                className="py-3 px-6 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors duration-200 flex items-center gap-2"
              >
                <TrashIcon className="h-5 w-5" /> Delete
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Modal Component (for Create/Edit Task popup & Delete Confirmation)
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

// New TaskForm Component (Reusable for Modal and Detail Panel)
interface TaskFormProps {
  title: string; setTitle: (title: string) => void;
  description: string; setDescription: (desc: string) => void;
  priority: "low" | "medium" | "high"; setPriority: (p: "low" | "medium" | "high") => void;
  dueDate: string; setDueDate: (date: string) => void;
  subtasks: Subtask[];
  addSubtask: () => void;
  updateSubtask: (id: string, title: string) => void;
  toggleSubtaskComplete: (id: string) => void;
  deleteSubtask: (id: string) => void;
  status: "todo" | "inprogress" | "completed"; setStatus: (s: "todo" | "inprogress" | "completed") => void;
}

const TaskForm = ({
  title, setTitle,
  description, setDescription,
  priority, setPriority,
  dueDate, setDueDate,
  subtasks, addSubtask, updateSubtask, toggleSubtaskComplete, deleteSubtask,
  status, setStatus
}: TaskFormProps) => (
  <>
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

    <div className="flex gap-4 mb-4">
      <div className="flex-1">
        <label className="text-gray-700 text-sm font-medium mb-1 block">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 shadow-sm transition"
        >
          <option value="todo">To Do</option>
          <option value="inprogress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>
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
    </div>
    <div className="mb-4">
      <label className="text-gray-700 text-sm font-medium mb-1 block">Due Date</label>
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-800 shadow-sm transition"
      />
    </div>

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
  </>
);