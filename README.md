# 📝 To-Do Application

**Backend:** Spring Boot | **Frontend:** Next.js | **Database:** PostgreSQL

A modern full-stack **To-Do Management System** built with clean architecture, reusable components, and secure REST API communication.

---

## 📌 About the Project

This To-Do Application is a simple, fast, and secure task management system built using Spring Boot, Next.js, and PostgreSQL. It includes user authentication, a clean UI, and full CRUD operations for tasks — making it an ideal project for developers learning full-stack application development.

---
## 🚀 Features

### 🌐 Frontend (Next.js + Tailwind CSS)

* Responsive, professional UI with Header + Sidebar layout
* Create, Update, Delete tasks
* API service layer with Axios + JWT interceptor
* Notifications, modals, and user dropdowns
* Client-side validation & error handling

### 🛠 Backend (Spring Boot)

* REST API with Controller → Service → Repository layers
* DTO-based payloads for clean data transfer
* Exception handling & global error responses
* JWT-based authentication and authorization
* PostgreSQL + Spring Data JPA integration
* CORS configured for frontend access

### 🗄 Database (PostgreSQL)

* Optimized schema for tasks and users
* Auto-increment IDs for todos
* Supports easy migrations and seeding

---

## 🧱 Tech Stack

| Layer        | Technologies                                |
| ------------ | ------------------------------------------- |
| **Frontend** | Next.js 14, React, Tailwind CSS             |
| **Backend**  | Spring Boot 3, Spring Data JPA, Lombok, JWT |
| **Database** | PostgreSQL                                  |
| **Tools**    | Maven, npm, Postman                         |

---

## 🔌 API Endpoints

| Method | Endpoint             | Description                       |
| ------ | -------------------- | --------------------------------- |
| POST   | `/api/auth/register` | Register new user                 |
| POST   | `/api/auth/login`    | Login and receive JWT             |
| GET    | `/api/tasks`         | Fetch all tasks of logged-in user |
| POST   | `/api/tasks`         | Create a new task                 |
| GET    | `/api/tasks/{id}`    | Get task by ID                    |
| PUT    | `/api/tasks/{id}`    | Update task                       |
| DELETE | `/api/tasks/{id}`    | Delete task                       |

**Headers for protected routes:**

```
Authorization: Bearer <JWT_TOKEN>
```

---

## ⚙ Backend Setup (Spring Boot)

### 1️⃣ Clone the repository

```bash
git clone https://github.com/Kiruthiyan/ToDo_Application.git
cd ToDo_Application/backend
```

### 2️⃣ Create PostgreSQL database

```sql
CREATE DATABASE todo_db;

CREATE USER todo_user WITH ENCRYPTED PASSWORD 'StrongPassword123';
GRANT ALL PRIVILEGES ON DATABASE todo_db TO todo_user;
```

### 3️⃣ Configure `application.properties`

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/todo_db
spring.datasource.username=todo_user
spring.datasource.password=StrongPassword123

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

jwt.secret=YourVerySecretKeyHere
jwt.expiration=3600000
```

### 4️⃣ Run the backend

```bash
mvn clean install
mvn spring-boot:run
```

Backend available at: **[http://localhost:8080](http://localhost:8080)**

---

## 🖥 Frontend Setup (Next.js)

### 1️⃣ Open frontend folder

```bash
cd ../frontend
```

### 2️⃣ Install dependencies

```bash
npm install
```

### 3️⃣ Run frontend

```bash
npm run dev
```

Frontend available at: **[http://localhost:3000](http://localhost:3000)**

---

## 🔗 API Integration (Next.js → Spring Boot)

Create `/lib/api.ts`:

```ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
```

### 🧪 Sample API Request (Create Task)

```json
POST /api/tasks
{
  "title": "Learn Backend",
  "description": "Finish Spring Boot API",
  "status": "PENDING"
}
```

---

## 🔐 Security Notes

* **JWT Secret:** Store in environment variables, not in source code
* **Password Hashing:** Use `BCryptPasswordEncoder`
* **HTTPS:** Use HTTPS in production
* **DB Migrations:** Use Flyway/Liquibase instead of `ddl-auto=update` in production
* **Token Expiry:** Implement refresh tokens for long sessions
* **CORS:** Enable only for frontend domains

---

## 📦 Production Build

### Frontend

```bash
npm run build
npm run start
```

### Backend

```bash
mvn clean package
java -jar target/backend-0.0.1-SNAPSHOT.jar
```

---

## ✅ Quick Checklist for Developers

* [ ] PostgreSQL `todo_db` created
* [ ] Backend running at `http://localhost:8080`
* [ ] Frontend running at `http://localhost:3000`
* [ ] Register & Login → JWT stored in `localStorage`
* [ ] Create / Update / Delete tasks → check DB or API response
* [ ] Ensure CORS enabled for frontend

---

## 🧩 Useful Commands

```bash
# Backend
mvn clean install       # Build project
mvn spring-boot:run     # Run backend
mvn clean package       # Package for production

# Frontend
npm install             # Install dependencies
npm run dev             # Start development server
npm run build           # Build for production
npm run start           # Run production build

# PostgreSQL
psql -U todo_user -d todo_db   # Connect to DB
\dt                            # List tables
SELECT * FROM tasks;           # View tasks
```

---

