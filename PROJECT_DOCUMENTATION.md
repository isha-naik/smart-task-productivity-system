# Smart Task & Productivity Management System
## Project Documentation

---

## 1. Project Overview

The **Smart Task & Productivity Management System (TaskFlow)** is a full-stack SaaS-style web application designed for teams and organizations to manage tasks, monitor productivity, and leverage AI-based insights.

Built using **Spring Boot** (backend) and **React + Vite** (frontend), it demonstrates a production-level architecture with role-based authentication, real-time analytics, and AI-powered productivity insights.

---

## 2. Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 3.3.5 | Application framework (parent POM) |
| Java | 17 | Programming language |
| Spring Web | (managed by Boot 3.3.5) | REST API layer |
| Spring Data JPA | (managed by Boot 3.3.5) | Database ORM |
| Hibernate | (managed by Boot 3.3.5) | JPA implementation |
| Spring Security | (managed by Boot 3.3.5) | Authentication & Authorization |
| Spring Validation | (managed by Boot 3.3.5) | Request validation (@Valid) |
| JJWT (jjwt-api) | 0.11.5 | JWT token generation/validation |
| JJWT (jjwt-impl) | 0.11.5 | JWT runtime implementation |
| JJWT (jjwt-jackson) | 0.11.5 | JWT JSON serialization |
| Lombok | (managed by Boot 3.3.5) | Boilerplate reduction |
| SpringDoc OpenAPI | 2.3.0 | Swagger UI & OpenAPI 3.0 docs |
| PostgreSQL Driver | (managed by Boot 3.3.5) | JDBC driver for PostgreSQL |
| Maven | 3.8+ | Build & dependency management |

### Frontend — Production Dependencies
| Package | Version | Purpose |
|---|---|---|
| react | ^18.2.0 | Core UI framework |
| react-dom | ^18.2.0 | React DOM renderer |
| react-router-dom | ^6.21.0 | Client-side routing |
| axios | ^1.6.2 | HTTP client for API calls |
| chart.js | ^4.4.1 | Chart rendering engine |
| react-chartjs-2 | ^5.2.0 | React wrapper for Chart.js |
| lucide-react | ^0.303.0 | Icon library |
| react-hot-toast | ^2.4.1 | Toast notifications |
| @radix-ui/react-dialog | ^1.0.5 | Accessible modal dialogs |
| @radix-ui/react-dropdown-menu | ^2.0.6 | Dropdown menus |
| @radix-ui/react-select | ^2.0.0 | Select input component |
| @radix-ui/react-label | ^2.0.2 | Accessible form labels |
| @radix-ui/react-slot | ^1.0.2 | Component composition primitive |
| @radix-ui/react-separator | ^1.0.3 | Visual separator |
| @radix-ui/react-avatar | ^1.0.4 | Avatar component |
| @radix-ui/react-progress | ^1.0.3 | Progress bar |
| @radix-ui/react-alert-dialog | ^1.0.5 | Alert/confirm dialogs |
| class-variance-authority | ^0.7.0 | Variant-based class generation |
| clsx | ^2.0.0 | Conditional className utility |
| tailwind-merge | ^2.2.0 | Tailwind class conflict resolver |
| date-fns | ^3.0.6 | Date formatting utilities |

### Frontend — Dev Dependencies
| Package | Version | Purpose |
|---|---|---|
| vite | ^5.0.8 | Build tool & dev server |
| @vitejs/plugin-react | ^4.2.1 | Vite React plugin (Babel/HMR) |
| tailwindcss | ^3.4.0 | Utility-first CSS framework |
| autoprefixer | ^10.4.16 | CSS vendor prefix automation |
| postcss | ^8.4.32 | CSS transformation pipeline |
| eslint | ^8.55.0 | JavaScript/JSX linting |
| eslint-plugin-react | ^7.33.2 | React-specific lint rules |
| eslint-plugin-react-hooks | ^4.6.0 | Hooks usage lint rules |
| eslint-plugin-react-refresh | ^0.4.5 | Fast Refresh lint rules |
| @types/react | ^18.2.43 | TypeScript type definitions |
| @types/react-dom | ^18.2.17 | TypeScript type definitions |

### Database
| Technology | Version | Purpose |
|---|---|---|
| PostgreSQL | 14+ | Primary relational database |
| Hibernate DDL Auto | update | Schema auto-generation on startup |

### Build & Tooling
| Tool | Version | Purpose |
|---|---|---|
| Apache Maven | 3.8+ | Backend build & dependency management |
| Node.js | 18+ | Frontend runtime |
| npm | 9+ | Frontend package manager |

---

## 3. Project Structure

```
Smart Task & Productivity Management System/
│
├── task-management-backend/              ← Spring Boot Backend
│   ├── pom.xml                           ← Maven dependencies
│   └── src/
│       ├── main/
│       │   ├── java/com/taskmanager/
│       │   │   ├── TaskManagementApplication.java    ← Entry point
│       │   │   ├── config/
│       │   │   │   ├── SecurityConfig.java            ← Spring Security + JWT
│       │   │   │   ├── SwaggerConfig.java             ← OpenAPI/Swagger setup
│       │   │   │   ├── CorsConfig.java                ← CORS for frontend
│       │   │   │   └── DataLoader.java                ← Sample data seeder
│       │   │   ├── controller/
│       │   │   │   ├── AuthController.java            ← POST /api/auth/**
│       │   │   │   ├── TaskController.java            ← CRUD /api/tasks/**
│       │   │   │   ├── CategoryController.java        ← /api/categories/**
│       │   │   │   ├── AnalyticsController.java       ← GET /api/analytics
│       │   │   │   ├── InsightController.java         ← GET /api/insights
│       │   │   │   └── UserController.java            ← GET /api/users/**
│       │   │   ├── service/
│       │   │   │   ├── AuthService.java               ← Register + Login logic
│       │   │   │   ├── TaskService.java               ← Task CRUD + permissions
│       │   │   │   ├── CategoryService.java           ← Category management
│       │   │   │   ├── UserService.java               ← User queries
│       │   │   │   ├── AnalyticsService.java          ← Dashboard metrics
│       │   │   │   └── InsightService.java            ← AI insight generation
│       │   │   ├── repository/
│       │   │   │   ├── UserRepository.java
│       │   │   │   ├── TaskRepository.java
│       │   │   │   └── CategoryRepository.java
│       │   │   ├── entity/
│       │   │   │   ├── User.java                      ← Users table
│       │   │   │   ├── Task.java                      ← Tasks table
│       │   │   │   ├── Category.java                  ← Categories table
│       │   │   │   ├── Role.java                      ← MANAGER / EMPLOYEE
│       │   │   │   ├── TaskStatus.java                ← PENDING/IN_PROGRESS/COMPLETED/OVERDUE
│       │   │   │   └── TaskPriority.java              ← LOW / MEDIUM / HIGH
│       │   │   ├── dto/
│       │   │   │   ├── LoginRequest.java
│       │   │   │   ├── RegisterRequest.java
│       │   │   │   ├── AuthResponse.java
│       │   │   │   ├── TaskDTO.java
│       │   │   │   ├── CategoryDTO.java
│       │   │   │   ├── UserDTO.java
│       │   │   │   ├── AnalyticsDTO.java
│       │   │   │   ├── InsightDTO.java
│       │   │   │   └── ApiResponse.java               ← Generic response wrapper
│       │   │   ├── security/
│       │   │   │   ├── JwtUtil.java                   ← Token generation & validation
│       │   │   │   ├── JwtAuthFilter.java             ← JWT filter per request
│       │   │   │   └── UserDetailsServiceImpl.java    ← Load user from DB
│       │   │   └── exception/
│       │   │       ├── GlobalExceptionHandler.java    ← @RestControllerAdvice
│       │   │       ├── ResourceNotFoundException.java
│       │   │       ├── BadRequestException.java
│       │   │       └── UnauthorizedException.java
│       │   └── resources/
│       │       └── application.properties             ← DB, JWT, server config
│
├── task-management-frontend/             ← React + Vite Frontend
│   ├── package.json                      ← NPM dependencies
│   ├── vite.config.js                    ← Vite + API proxy config
│   ├── tailwind.config.js                ← Tailwind theme customization
│   ├── postcss.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx                      ← React app entry point
│       ├── App.jsx                       ← Router + protected routes
│       ├── index.css                     ← Tailwind + CSS variables
│       ├── components/
│       │   ├── Navbar.jsx                ← Sticky top navigation
│       │   ├── Sidebar.jsx               ← Responsive sidebar with role-based menu
│       │   ├── DashboardCards.jsx        ← Metric statistics cards
│       │   ├── AnalyticsChart.jsx        ← Pie + Bar charts + Productivity score
│       │   ├── InsightAlert.jsx          ← AI productivity insights widget
│       │   ├── TaskCard.jsx              ← Individual task card (card view)
│       │   ├── TaskForm.jsx              ← Create/Edit task modal form
│       │   ├── TaskTable.jsx             ← Sortable/filterable task table
│       │   ├── ConfirmDialog.jsx         ← Delete confirmation modal
│       │   └── Loader.jsx                ← Loading spinner component
│       ├── pages/
│       │   ├── Login.jsx                 ← Authentication login page
│       │   ├── Register.jsx              ← User registration page
│       │   ├── Dashboard.jsx             ← Analytics dashboard
│       │   ├── Tasks.jsx                 ← Task management (cards/table)
│       │   └── AdminPanel.jsx            ← Manager panel (tasks/team/categories)
│       ├── services/
│       │   └── api.js                    ← Axios instance + all API endpoints
│       ├── utils/
│       │   ├── auth.js                   ← JWT token management utils
│       │   └── helpers.js                ← Formatting, color, display helpers
│       └── hooks/
│           ├── useAuth.js                ← Auth context + custom hook
│           └── useTasks.js               ← Task CRUD state management hook
│
├── PROJECT_DOCUMENTATION.md             ← This file
└── SETUP_GUIDE.md                       ← Step-by-step setup instructions
```

---

## 4. Database Schema

### users
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PRIMARY KEY |
| name | VARCHAR | NOT NULL |
| email | VARCHAR | NOT NULL, UNIQUE |
| password | VARCHAR | NOT NULL (BCrypt hashed) |
| role | VARCHAR | NOT NULL ('MANAGER' or 'EMPLOYEE') |

### categories
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PRIMARY KEY |
| category_name | VARCHAR | NOT NULL, UNIQUE |

### tasks
| Column | Type | Constraints |
|---|---|---|
| id | BIGSERIAL | PRIMARY KEY |
| title | VARCHAR | NOT NULL |
| description | TEXT | NULLABLE |
| status | VARCHAR | NOT NULL (PENDING/IN_PROGRESS/COMPLETED/OVERDUE) |
| priority | VARCHAR | NOT NULL (LOW/MEDIUM/HIGH) |
| due_date | DATE | NULLABLE |
| created_at | TIMESTAMP | Auto-set on creation |
| assigned_to_id | BIGINT | FK → users(id) |
| created_by_id | BIGINT | FK → users(id) |
| category_id | BIGINT | FK → categories(id) |

### Entity Relationships
```
User (MANAGER) ─── creates many ──→ Task
User (EMPLOYEE) ←── assigned many ── Task
Category ←── belongs to ── Task
```

---

## 5. API Endpoints

### Authentication
| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | /api/auth/register | Public | Register new user |
| POST | /api/auth/login | Public | Login and get JWT |

### Tasks
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/tasks | Authenticated | Get tasks (role-filtered) |
| GET | /api/tasks/{id} | Authenticated | Get task by ID |
| POST | /api/tasks | Authenticated | Create new task |
| PUT | /api/tasks/{id} | Authenticated | Update task |
| DELETE | /api/tasks/{id} | Manager only | Delete task |

### Categories
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/categories | Authenticated | Get all categories |
| POST | /api/categories | Authenticated | Create category |
| DELETE | /api/categories/{id} | Authenticated | Delete category |

### Users
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/users | Manager only | Get all users |
| GET | /api/users/employees | Manager only | Get all employees |
| GET | /api/users/{id} | Authenticated | Get user by ID |

### Analytics & Insights
| Method | Endpoint | Access | Description |
|---|---|---|---|
| GET | /api/analytics | Authenticated | Dashboard analytics |
| GET | /api/insights | Authenticated | AI productivity insights |

---

## 6. Security Architecture

### JWT Authentication Flow
```
1. User POST /api/auth/login with credentials
2. Backend validates → generates JWT token (24h expiry)
3. Frontend stores JWT in localStorage
4. All subsequent API requests include: Authorization: Bearer <token>
5. JwtAuthFilter validates token per request
6. Spring Security sets Authentication context
7. Role-based access enforced via @PreAuthorize
```

### Role-Based Access Control
- **MANAGER**: Full access — create/assign/delete tasks, view all tasks, team managem