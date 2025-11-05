'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // ✅ For token validation redirect

export default function Home() {
  const router = useRouter();

  // ---------- States ----------
  const [todos, setTodos] = useState<any[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newStatus, setNewStatus] = useState('Pending');
  const [activePage, setActivePage] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [userEmail, setUserEmail] = useState<string | null>(null); // ✅ store logged-in user's identity
  const [message, setMessage] = useState<string>(''); // ✅ for UI feedback messages

  // ---------- Token Validation ----------
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail'); // assume you stored this on login

    if (!token || !email) {
      console.log('⚠️ No valid login found. Redirecting...');
      router.push('/login'); // redirect to login page if no token
    } else {
      setUserEmail(email);
      console.log('✅ Logged in as:', email);
    }
  }, [router]);

  // ---------- Add new task ----------
  const addTodo = () => {
    if (newTitle.trim() === '') {
      setMessage('⚠️ Title cannot be empty!');
      return;
    }

    const newTodo = {
      id: Date.now(),
      title: newTitle,
      description: newDescription,
      status: newStatus,
      completed: newStatus === 'Completed',
      category: activePage,
      user: userEmail, // ✅ attach user ID/email for filtering
    };

    setTodos([...todos, newTodo]);
    setNewTitle('');
    setNewDescription('');
    setNewStatus('Pending');
    setMessage('✅ New task added successfully!');
  };

  // ---------- Filter tasks ----------
  const filteredTodos = todos.filter((todo) => {
    const categoryMatch = activePage === 'all' ? true : todo.category === activePage;
    const statusMatch = statusFilter === 'all' ? true : todo.status === statusFilter;
    const userMatch = todo.user === userEmail; // ✅ show only logged-in user's todos
    return categoryMatch && statusMatch && userMatch;
  });

  // ---------- Toggle Complete ----------
  const toggleComplete = (id: number) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
              status: todo.completed ? 'Pending' : 'Completed',
            }
          : todo
      )
    );
  };

  // ---------- Delete Task ----------
  const deleteTodo = (id: number) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    setMessage('🗑️ Task deleted successfully.');
  };

  // ---------- Logout ----------
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    alert('You have been logged out.');
    router.push('/login'); // ✅ redirect to login page
  };

  // ---------- UI ----------
  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#f9f9f9',
      }}
    >
      {/* ---------- Left Navigation ---------- */}
      <nav
        style={{
          width: '220px',
          backgroundColor: '#222',
          color: 'white',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
        }}
      >
        <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Task Menu</h2>

        {['my', 'important', 'planned', 'assigned', 'all'].map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            style={{
              backgroundColor: activePage === page ? '#444' : 'transparent',
              color: 'white',
              border: 'none',
              textAlign: 'left',
              padding: '10px 15px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px',
            }}
          >
            {page === 'my'
              ? 'My Tasks'
              : page === 'important'
              ? 'Important'
              : page === 'planned'
              ? 'Planned'
              : page === 'assigned'
              ? 'Assigned to Me'
              : 'All Tasks'}
          </button>
        ))}

        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#d9534f',
            color: 'white',
            padding: '10px',
            borderRadius: '5px',
            border: 'none',
            marginTop: 'auto',
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </nav>

      {/* ---------- Main Dashboard ---------- */}
      <main style={{ flex: 1, padding: '30px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>
          {activePage === 'my'
            ? 'My Tasks'
            : activePage === 'important'
            ? 'Important Tasks'
            : activePage === 'planned'
            ? 'Planned Tasks'
            : activePage === 'assigned'
            ? 'Assigned to Me'
            : 'All Tasks'}
        </h1>

        {/* ---------- Feedback Message ---------- */}
        {message && (
          <div
            style={{
              backgroundColor: '#eef',
              padding: '10px',
              borderRadius: '6px',
              marginBottom: '15px',
              border: '1px solid #aac',
              color: '#333',
            }}
          >
            {message}
          </div>
        )}

        {/* ---------- Add Task Form ---------- */}
        <div
          style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            marginBottom: '20px',
          }}
        >
          <h3>Add New Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
            }}
          />
          <textarea
            placeholder="Description"
            value={newDescription}
            onChange={(e) => setNewDescription(e.target.value)}
            style={{
              width: '100%',
              padding: '10px',
              marginBottom: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              minHeight: '60px',
            }}
          />
          <select
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
            style={{
              padding: '10px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              marginRight: '10px',
            }}
          >
            <option value="Pending">Pending</option>
            <option value="Completed">Completed</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <button
            onClick={addTodo}
            style={{
              padding: '10px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              marginLeft: '10px',
            }}
          >
            Add Task
          </button>
        </div>

        {/* ---------- Display Tasks ---------- */}
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredTodos.map((todo) => (
            <li
              key={todo.id}
              style={{
                backgroundColor: todo.completed ? '#e6e6e6' : 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '15px',
                marginBottom: '10px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              }}
            >
              <div
                onClick={() => toggleComplete(todo.id)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <h3
                  style={{
                    textDecoration: todo.completed ? 'line-through' : 'none',
                    color: todo.completed ? '#666' : '#000',
                  }}
                >
                  {todo.title}
                </h3>
                <span
                  style={{
                    backgroundColor:
                      todo.status === 'Completed' ? '#28a745' : '#ffc107',
                    color: 'white',
                    padding: '5px 10px',
                    borderRadius: '5px',
                    fontSize: '12px',
                  }}
                >
                  {todo.status}
                </span>
              </div>
              <p style={{ color: '#555', marginTop: '5px' }}>
                {todo.description || 'No description provided.'}
              </p>
              <button
                onClick={() => deleteTodo(todo.id)}
                style={{
                  marginTop: '10px',
                  backgroundColor: '#dc3545',
                  color: 'white',
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                }}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>

        {/* ---------- Empty State Message ---------- */}
        {filteredTodos.length === 0 && (
          <p style={{ textAlign: 'center', color: '#777', marginTop: '20px' }}>
            No todos yet for your account. Add some to get started!
          </p>
        )}
      </main>
    </div>
  );
}
