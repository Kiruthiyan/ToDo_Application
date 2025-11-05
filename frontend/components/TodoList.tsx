"use client";
import { useEffect, useState } from "react";
import axios from "axios";

interface Todo {
    id: number;
    title: string;
    description: string;
    completed: boolean;
    deadline: string; // keep deadline field
}

export default function TodoList() {
    const [todos, setTodos] = useState<Todo[]>([]);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [error, setError] = useState("");
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editDeadline, setEditDeadline] = useState("");

    const fetchTodos = () => {
        axios
            .get("http://localhost:8080/todos")
            .then((res) => setTodos(res.data))
            .catch(() => setError("Failed to fetch todos"));
    };

    useEffect(() => {
        fetchTodos();
    }, []);

    const handleCreate = () => {
        if (!title.trim() || !description.trim() || !deadline) return;
        axios
            .post("http://localhost:8080/todos", { title, description, completed: false, deadline })
            .then(() => {
                setTitle("");
                setDescription("");
                setDeadline("");
                setError("");
                fetchTodos();
            })
            .catch(() => setError("Failed to create todo"));
    };

    const handleDelete = (id: number) => {
        axios
            .delete(`http://localhost:8080/todos/${id}`)
            .then(() => fetchTodos())
            .catch(() => setError("Failed to delete todo"));
    };

    const handleToggle = (todo: Todo) => {
        axios
            .put(`http://localhost:8080/todos/${todo.id}`, {
                ...todo,
                completed: !todo.completed,
            })
            .then(() => fetchTodos())
            .catch(() => setError("Failed to update todo"));
    };

    const startEdit = (todo: Todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
        setEditDescription(todo.description);
        setEditDeadline(todo.deadline);
    };

    const handleUpdate = (id: number) => {
        if (!editTitle.trim() || !editDescription.trim() || !editDeadline) return;
        axios
            .put(`http://localhost:8080/todos/${id}`, {
                title: editTitle,
                description: editDescription,
                completed: todos.find((t) => t.id === id)?.completed,
                deadline: editDeadline,
            })
            .then(() => {
                setEditingId(null);
                setError("");
                fetchTodos();
            })
            .catch(() => setError("Failed to update todo"));
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-100 via-white to-green-100 flex flex-col items-center p-6">
            <h1 className="text-4xl font-extrabold text-blue-700 mb-8 animate-bounce">📋 My Stylish To-Do List</h1>

            {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}

            {/* Create Todo Form */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 mb-8">
                <input
                    type="text"
                    placeholder="Title"
                    className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Description"
                    className="w-full mb-3 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="date"
                    className="w-full mb-2 p-2 border rounded"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                />

                <button
                    className={`w-full py-3 rounded-lg text-white font-bold ${
                        title.trim() && description.trim() && deadline
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleCreate}
                    disabled={!title.trim() || !description.trim() || !deadline}
                >
                    ➕ Add Todo
                </button>
            </div>

            {/* Todo List */}
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6">
                {todos.length === 0 ? (
                    <p className="text-gray-500 text-center text-lg">No todos found.</p>
                ) : (
                    todos.map((todo) => (
                        <div
                            key={todo.id}
                            className="flex flex-col gap-2 border-b py-3 last:border-b-0 hover:bg-gray-50 transition-all duration-300 rounded-lg px-2"
                        >
                            {editingId === todo.id ? (
                                <>
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                    />
                                    <input
                                        type="date"
                                        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
                                        value={editDeadline}
                                        onChange={(e) => setEditDeadline(e.target.value)}
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                            onClick={() => handleUpdate(todo.id)}
                                        >
                                            💾 Save
                                        </button>
                                        <button
                                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                                            onClick={() => setEditingId(null)}
                                        >
                                            ❌ Cancel
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h2
                                            className={`font-semibold text-lg ${
                                                todo.completed ? "line-through text-gray-400" : ""
                                            }`}
                                        >
                                            {todo.title}
                                        </h2>
                                        <p
                                            className={`text-gray-600 ${
                                                todo.completed ? "line-through" : ""
                                            }`}
                                        >
                                            {todo.description}
                                        </p>
                                        <p className="text-sm text-gray-500 mt-1">
                                            🗓️ Deadline: {new Date(todo.deadline).toLocaleDateString("en-US")}
                                        </p>

                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span
                                            className={`px-3 py-1 text-sm rounded-full cursor-pointer font-semibold animate-pulse ${
                                                todo.completed
                                                    ? "bg-green-200 text-green-700"
                                                    : "bg-yellow-200 text-yellow-700"
                                            }`}
                                            onClick={() => handleToggle(todo)}
                                        >
                                            {todo.completed ? "Done" : "Pending"}
                                        </span>
                                        <button
                                            className="bg-yellow-600 text-white px-3 py-1 rounded hover:bg-yellow-700 "
                                            onClick={() => startEdit(todo)}
                                        >
                                            ✏️ Edit
                                        </button>
                                        <button
                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                            onClick={() => handleDelete(todo.id)}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}





