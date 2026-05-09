# TaskFlow — Smart Task & Productivity Management System

> Full-stack web application | SE ZG503 — Full Stack Application Development

A production-style task management platform built with **Spring Boot 3** (backend) and **React + Vite** (frontend), featuring JWT authentication, role-based access control, real-time analytics, and AI-generated productivity insights.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Chart.js 4, React Router 6 |
| Backend | Spring Boot 3.3.5, Spring Security 6, Spring Data JPA |
| Auth | JWT (JJWT 0.11.5) — stateless, role-based |
| Database | PostgreSQL 14+ |
| API Docs | OpenAPI 3.0 / Swagger UI |

---

## Features

- **JWT Authentication** — register, login, token-secured endpoints
- **Role-Based Access** — Manager vs Employee with separate views and permissions
- **Task Management** — create, assign, update, delete tasks with priority and due dates
- **Dashboard Analytics** — charts for task status distribution, priority breakdown, completion rate
- **Productivity Score** — 0–100 score calculated from task patterns
- **AI Insights** — backend-generated natural language productivity recommendations
- **Admin Panel** — Manager-only team overview and category management

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Manager | manager@taskmanager.com | manager123 |
| Employee | priya@employee.com | employee123 |
| Employee | rahul@employee.com | employee123 |

---

## Setup & Run

### Prerequisites
- Java 17+, Maven 3.8+, Node.js 18+, PostgreSQL 14+

### 1. Database
```sql
CREATE DATABASE task_management_db;
```

### 2. Backend
```bash
cd task-management-backend
# Edit src/main/resources/application.properties with your DB password
mvn spring-boot:run
```
Backend starts at **http://localhost:8080**  
Swagger UI: **http://localhost:8080/swagger-ui.html**

### 3. Frontend
```bash
cd task-management-frontend
npm install
npm run dev
# Windows (if & in path causes issues): node node_modules/vite/bin/vite.js
```
App runs at **http://localhost:5173**

> Tables are auto-created by Hibernate on first startup. Demo data is seeded automatically.

---

## Project Structure

```
Smart Task & Productivity Management System
├── task-management-backend/     ← Spring Boot REST API
│   └── src/main/java/com/taskmanager/
│       ├── controller/          ← REST endpoints
│       ├── service/             ← Business logic
│       ├── repository/          ← JPA repositories
│       ├── entity/              ← DB entities
│       ├── dto/                 ← Request/Response DTOs
│       ├── security/            ← JWT filter + config
│       └── exception/           ← Global error handler
├── task-management-frontend/    ← React + Vite SPA
│   └── src/
│       ├── pages/               ← Login, Register, Dashboard, Tasks, AdminPanel
│       ├── components/          ← Reusable UI components
│       ├── hooks/               ← useAuth, useTasks
│       ├── services/            ← Axios API client
│       └── utils/               ← Auth helpers, formatters
├── swagger.yaml                 ← OpenAPI 3.0 API specification
├── PROJECT_DOCUMENTATION.md    ← Full project documentation
├── AI_Usage_Log_and_Reflection.docx ← AI usage log and reflection
└── README.md                   ← This file
```

---

## API Endpoints

| Method | Endpoint | Access |
|---|---|---|
| POST | /api/auth/register | Public |
| POST | /api/auth/login | Public |
| GET/POST | /api/tasks | Authenticated |
| GET/PUT/DELETE | /api/tasks/{id} | Authenticated / Manager |
| GET/POST/DELETE | /api/categories | Authenticated |
| GET | /api/users, /api/users/employees | Manager only |
| GET | /api/analytics | Authenticated |
| GET | /api/insights | Authenticated |

Full API docs: `swagger.yaml` or run backend and visit `http://localhost:8081/swagger-ui/index.html#/`

---

## AI Assistance

Built using **Option A** — developed from scratch with Claude (Anthropic) assistance.  
See `AI_Usage_Log_and_Reflection.docx` for the full AI usage log and reflection report.
