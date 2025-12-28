# Task Management Application

A simple task management application with authentication, built with React frontend and Node.js/Express backend.

## Tech Stack

- **Frontend**: React, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Containerization**: Docker

## Features

- User registration and login
- JWT-based authentication
- Create, read, update, and delete tasks
- Task status management (pending, in_progress, done)
- Pagination for task list
- Protected frontend routes
- Docker setup for easy deployment

## Setup Instructions

### Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (if running without Docker)
- Docker and Docker Compose (optional, for containerized setup)

### Option 1: Docker Setup (Recommended)

1. Clone the repository and navigate to the project directory.

2. Create a `.env` file in the `backend` directory (you can copy from `backend/env.example.txt`):
   ```
   PORT=5000
   DB_HOST=postgres
   DB_PORT=5432
   DB_NAME=taskmanagement
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=production
   ```

3. Build and start all services:
   ```bash
   docker-compose up --build
   ```

4. The application will be available at:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Option 2: Local Development Setup

#### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (you can copy from `backend/env.example.txt` and modify):
   ```
   PORT=5000
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=taskmanagement
   DB_USER=postgres
   DB_PASSWORD=postgres
   JWT_SECRET=your-secret-key-change-in-production
   NODE_ENV=development
   ```

4. Make sure PostgreSQL is running and create a database:
   ```sql
   CREATE DATABASE taskmanagement;
   ```

5. Start the backend server:
   ```bash
   npm run dev
   ```

   The backend will run on http://localhost:5000

#### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

   The frontend will run on http://localhost:3000

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
  - Body: `{ "name": "string", "email": "string", "password": "string" }`
  - Returns: `{ "token": "string", "user": {...} }`

- `POST /api/auth/login` - Login user
  - Body: `{ "email": "string", "password": "string" }`
  - Returns: `{ "token": "string", "user": {...} }`

### Tasks (Protected - requires JWT token)

All task endpoints require an `Authorization` header: `Bearer <token>`

- `GET /api/tasks?page=1&limit=10` - Get user's tasks with pagination
  - Query params: `page` (default: 1), `limit` (default: 10)
  - Returns: `{ "tasks": [...], "total": number, "page": number, "limit": number, "totalPages": number }`

- `POST /api/tasks` - Create a new task
  - Body: `{ "title": "string", "description": "string" (optional) }`
  - Returns: Task object

- `GET /api/tasks/:id` - Get a specific task
  - Returns: Task object

- `PUT /api/tasks/:id` - Update a task
  - Body: `{ "title": "string" (optional), "description": "string" (optional), "status": "pending|in_progress|done" (optional) }`
  - Returns: Updated task object

- `DELETE /api/tasks/:id` - Delete a task
  - Returns: `{ "message": "Task deleted successfully" }`

### Task Status Values

- `pending` - Task is pending
- `in_progress` - Task is in progress
- `done` - Task is completed

## Running Tests

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```