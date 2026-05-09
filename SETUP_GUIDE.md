# Smart Task & Productivity Management System
## Step-by-Step Setup & Run Guide

---

## Prerequisites

Ensure the following are installed on your machine:

| Tool | Version | Download |
|---|---|---|
| Java JDK | 17+ | https://adoptium.net |
| Apache Maven | 3.8+ | https://maven.apache.org |
| Node.js | 18+ | https://nodejs.org |
| npm | 9+ | Comes with Node.js |
| PostgreSQL | 14+ | https://postgresql.org |
| Git | Latest | https://git-scm.com |

**Verify installations:**
```bash
java -version          # Should show 17+
mvn -version           # Should show 3.8+
node -version          # Should show 18+
npm -version           # Should show 9+
psql --version         # Should show 14+
```

---

## Step 1: Database Setup (PostgreSQL)

### Option A — Using psql command line:
```bash
# Start PostgreSQL service
# Windows: Start via Services or pgAdmin
# macOS:   brew services start postgresql
# Linux:   sudo systemctl start postgresql

# Open PostgreSQL shell
psql -U postgres

# Create the database
CREATE DATABASE task_management_db;

# Verify
\l

# Exit
\q
```

### Option B — Using pgAdmin GUI:
1. Open pgAdmin 4
2. Right-click "Databases" → Create → Database
3. Name: `task_management_db`
4. Click Save

> **Note:** The application uses `spring.jpa.hibernate.ddl-auto=update` so tables are **auto-created** on first startup.

---

## Step 2: Backend Setup (Spring Boot)

### Navigate to backend directory:
```bash
cd "task-management-backend"
```

### Configure database credentials (if different from defaults):
Edit `src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/task_management_db
spring.datasource.username=postgres        # Change if your username differs
spring.datasource.password=postgres        # Change to your PostgreSQL password
```

### Build the project:
```bash
mvn clean install -DskipTests
```

### Run the backend:
```bash
mvn spring-boot:run
```

**OR** using the JAR directly:
```bash
java -jar target/task-management-backend-1.0.0.jar
```

### Verify backend is running:
Open browser: **http://localhost:8080/swagger-ui.html**

You should see the Swagger API documentation page.

**Console output on successful start:**
```
✅ Sample data loaded successfully!
Demo Credentials:
  Manager  → manager@taskmanager.com / manager123
  Employee → priya@employee.com / employee123
  Employee → rahul@employee.com / employee123
  Employee → sneha@employee.com / employee123

Started TaskManagementApplication in X.XXX seconds
```

---

## Step 3: Frontend Setup (React + Vite)

### Open a NEW terminal window and navigate to frontend:
```bash
cd "task-management-frontend"
```

### Install dependencies:
```bash
npm install
```

> This installs React, Vite, Tailwind CSS, Axios, Chart.js, and all other dependencies.

### Start the development server:
```bash
npm run dev
```

> **Windows note:** If `npm run dev` fails due to the `&` character in the parent folder path, run Vite directly:
> ```bash
> node node_modules/vite/bin/vite.js
> ```

**Expected output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Open the application:
Visit **http://localhost:5173** in your browser.

---

## Step 4: Running the Full Application

Both services must run simultaneously:

| Service | Command | URL |
|---|---|---|
| Backend API | `mvn spring-boot:run` | http://localhost:8080 |
| Frontend App | `npm run dev` | http://localhost:5173 |
| Swagger Docs | — | http://localhost:8080/swagger-ui.html |

---

## Step 5: Demo Walkthrough

### Login as Manager:
1. Go to http://localhost:5173
2. Click **"Demo Manager"** button (auto-fills credentials)
3. Click **Sign In**
4. You'll land on the **Manager Panel**

### Manager Workflow:
1. **Create a task** → Click "Assign Task" → Fill in details → Assign to an employee → Submit
2. **View analytics** → Go to Dashboard → See charts and productivity score
3. **Manage team** → Go to Admin Panel → Team tab → See employee statistics
4. **Add categories** → Admin Panel → Categories tab → Add new

### Login as Employee:
1. Sign out → Login with `priya@employee.com / employee123`
2. View assigned tasks in **My Tasks**
3. Click Edit on a task → Change status to "IN_PROGRESS" → Save
4. View your **Dashboard** for personal productivity
5. Check **AI Insights** widget for recommendations

---

## Step 6: Build for Production

### Backend (create runnable JAR):
```bash
cd task-management-backend
mvn clean package -DskipTests
# Output: target/task-management-backend-1.0.0.jar
java -jar target/task-management-backend-1.0.0.jar
```

### Frontend (create production build):
```bash
cd task-management-frontend
npm run build
# Output: dist/ folder (deploy to Nginx, Netlify, Vercel, etc.)

# Preview production build locally
npm run preview
```

---

## Troubleshooting

### Issue: Backend fails to start — DB connection error
```
Solution: Ensure PostgreSQL is running and credentials in application.properties match.
Check: pg_ctl status (Linux/Mac) or Services (Windows)
```

### Issue: Frontend shows "Network Error" or API calls fail
```
Solution: Make sure backend is running on port 8080.
Check the Vite proxy in vite.config.js points to http://localhost:8080
```

### Issue: "Port 8080 already in use"
```
# Kill process on port 8080
Windows: netstat -ano | findstr :8080  → taskkill /PID <pid> /F
Mac/Linux: lsof -ti:8080 | xargs kill -9

# Or change port in application.properties:
server.port=8081
```

### Issue: npm install fails
```bash
npm cache clean --force
npm install
```

### Issue: Maven build fails
```bash
mvn clean
mvn install -DskipTests
```

### Issue: Tables not created in DB
```
Ensure spring.jpa.hibernate.ddl-auto=update in application.properties
This auto-creates/updates tables on startup.
```

---

## Environment Variables (Optional — Production)

For production deployment, set these as environment variables:

### Backend:
```bash
export SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/task_management_db
export SPRING_DATASOURCE_USERNAME=postgres
export SPRING_DATASOURCE_PASSWORD=your_secure_password
export JWT_SECRET=your_256_bit_secret_key
```

### Frontend:
Create `.env.production` in `task-management-frontend/`:
```
VITE_API_URL=https://your-backend-domain.com
```

---

## Quick Reference — Key URLs

| URL | Description |
|---|---|
| http://localhost:5173 | Frontend application |
| http://localhost:5173/login | Login page |
| http://localhost:5173/register | Registration page |
| http://localhost:5173/dashboard | Analytics dashboard |
| http://localhost:5173/tasks | Task management |
| http://localhost:5173/admin | Manager panel |
| http://localhost:8080/swagger-ui.html | API documentation |
| http://localhost:8080/api-docs | OpenAPI JSON spec |

---

## Project Summary for Evaluators

This project demonstrates:

✅ **Full-Stack Development** — Spring Boot REST API + React SPA  
✅ **JWT Authentication** — Stateless authentication with role-based access  
✅ **Role-Based Access Control** — Manager vs Employee workflows  
✅ **CRUD Operations** — Complete create/read/update/delete for Tasks, Categories, Users  
✅ **Dashboard Analytics** — Real-time metrics with Chart.js visualizations  
✅ **AI Productivity Insights** — Backend logic analyzing task patterns  
✅ **Modern UI/UX** — Tailwind CSS + dark mode + responsive design  
✅ **Clean Architecture** — Layered backend (Controller→Service→Repository) + modular frontend  
✅ **Swagger Documentation** — Auto-generated API docs  
✅ **Sample Data** — Pre-loaded realistic d