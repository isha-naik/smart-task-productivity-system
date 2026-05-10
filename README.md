# TaskFlow — Smart Task & Productivity Management System

> Full-stack web application | S2-25 SEZG503 — Full Stack Application Development

## Demo Video
[![TaskFlow Demo](https://drive.google.com/file/d/1G6-3NsRwxYpXGW-8Im63yLNgREIeq1N_/view?usp=drive_link)](https://drive.google.com/file/d/FILE_ID/view)

**TaskFlow** is a SaaS-style team productivity and task management platform designed for organisations where Managers assign and track tasks across their team, and Employees manage and update their own workload — all through a single, role-aware web application.

The system solves a common workplace problem: teams lack a centralised platform to assign tasks, monitor deadlines, track priorities, and measure productivity in real time. TaskFlow addresses this with a production-pattern architecture — a stateless Spring Boot REST API secured with JWT, a React SPA with live analytics dashboards, and an AI-powered insights engine that generates contextual productivity recommendations based on each user's task data.

Key capabilities: JWT-secured login, role-based views (Manager vs Employee), full task CRUD with priority and due dates, Chart.js analytics with a productivity score gauge, dark mode UI, and a notification bell for overdue/due-soon tasks.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Chart.js 4, React Router 6 |
| Backend | Spring Boot 3.3.5, Spring Security 6, Spring Data JPA, Java 23 |
| Auth | JWT (JJWT 0.11.5) — stateless, role-based |
| Database | PostgreSQL 15+ |
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
- **Dark Mode** — full dark/light theme toggle

---

## Demo Credentials

| Role | Email | Password |
|---|---|---|
| Manager | manager@taskmanager.com | manager123 |
| Employee | priya@employee.com | employee123 |
| Employee | rahul@employee.com | employee123 |
| Employee | sneha@employee.com | employee123 |

---

## Setup & Run

### Prerequisites
- Java 23, Maven 3.9+, Node.js 18+, PostgreSQL 15+

### 1. Database
```sql
CREATE DATABASE task_management_db;
```

### 2. Backend
```bash
cd task-management-backend
# Edit src/main/resources/application.properties with your DB password
mvn clean install -DskipTests
mvn spring-boot:run
```
Backend starts at **http://localhost:8081**  
Swagger UI: **http://localhost:8081/swagger-ui/index.html**

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
├── SETUP_GUIDE.md               ← Step-by-step setup instructions
├── AI_Usage_Log_and_Reflection.docx ← AI usage log and reflection report
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

Full API docs: `swagger.yaml` or run backend and visit `http://localhost:8081/swagger-ui/index.html`

---

## AI Assistance

Built using **Option A** — developed from scratch with AI assistance.  
AI tools used: **Claude (Anthropic)**, **GitHub Copilot**, **ChatGPT**  
See `AI_Usage_Log_and_Reflection.docx` for the full usage log, prompt examples, and reflection.
