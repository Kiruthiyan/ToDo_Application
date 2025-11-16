📌 To-Do Application
Backend: Spring Boot | Frontend: Next.js | Database: PostgreSQL

A full-stack To-Do management application built with Spring Boot REST API, Next.js frontend, and PostgreSQL as the database.
This app allows users to add, update, delete, and view tasks with a modern UI.

🚀 Features
✅ Frontend (Next.js)

Modern UI using Tailwind CSS

Sidebar + Header layout

Add / Edit / Delete tasks

API communication with Spring Boot backend

Dark & Light mode

Optimized file structure

Notification + Search UI buttons

🛠 Backend (Spring Boot)

REST API for task operations

Service + Repository layered architecture

DTO-based request/response handling

Validation for input data

CORS enabled for Next.js frontend

PostgreSQL database connection

🗄 Database (PostgreSQL)

Stores all To-Do tasks

Auto-increment task IDs

Supports CRUD operations

📁 Project Structure
Frontend (Next.js)
/app
 ├── layout.tsx
 ├── page.tsx
 └── todos/
      ├── layout.tsx
      ├── page.tsx
/components
 ├── Sidebar.tsx
 ├── Header.tsx
 └── TaskForm.tsx
/lib
 └── api.ts

Backend (Spring Boot)
src/main/java/com/todo
 ├── controller/
 ├── service/
 ├── repository/
 ├── dto/
 ├── entity/
 └── exception/

🧩 API Endpoints (Spring Boot)
Method	Endpoint	Description
GET	/api/tasks	Get all tasks
POST	/api/tasks	Create a new task
GET	/api/tasks/{id}	Get task by ID
PUT	/api/tasks/{id}	Update a task
DELETE	/api/tasks/{id}	Delete a task
🛠 Installation Guide
1️⃣ Backend Setup (Spring Boot)
✔ Prerequisites

Java 17+

Maven

PostgreSQL installed

✔ Database Setup
CREATE DATABASE todo_db;

✔ Update application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todo_db
spring.datasource.username=postgres
spring.datasource.password=your_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

✔ Run the backend
mvn clean install
mvn spring-boot:run


Backend runs on:
👉 http://localhost:8080

2️⃣ Frontend Setup (Next.js)
✔ Install dependencies
npm install

✔ Run the development server
npm run dev


Frontend runs on:
👉 http://localhost:3000

🔗 API Integration (Frontend → Backend)

lib/api.ts:

export const API_BASE_URL = "http://localhost:8080/api";

export async function getTasks() {
  const res = await fetch(`${API_BASE_URL}/tasks`);
  return res.json();
}

export async function addTask(data: any) {
  const res = await fetch(`${API_BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}

🧪 Testing the API

Use Postman / Thunder Client:

POST → /api/tasks

{
  "title": "Learn Next.js",
  "description": "Finish frontend integration",
  "status": "PENDING"
}

🎨 UI Preview (Features)

Responsive layout

Sidebar navigation

Task list view

Add new tasks (form)

Edit existing tasks

Delete tasks

📦 Technologies Used
⭐ Frontend

Next.js 14 App Router

Tailwind CSS

Heroicons

⭐ Backend

Spring Boot 3

Spring Web

Spring Data JPA

Lombok

⭐ Database

PostgreSQL

📜 License

This project is open-source and free to use.
