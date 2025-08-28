#  Task Manager

A minimal fullstack web application built with:

- **Frontend**: React + Vite + TypeScript
- **Backend**: Java Spring Boot 
- **Database**: PostgreSQL
- **Proxy**: Nginx 
- **DevOps**: Docker Compose 

The app allows multiple users to manage their own task lists (create, update, delete, change status).  
Each request specifies the acting user with a header `X-User-Id`, simulating authentication.

## Features

- User management (create/list users)
- Task CRUD (title, description, status, due date)
- Frontend UI for task list with **inline edit**, **status select**, and **delete**
- Multi-user isolation (user can only access their own tasks)
- Pre-seeded demo data (Alice, Bob with sample tasks) in non-test environments
- GitHub Actions CI: build + test + Docker workflow

## Setup Instructions

### Prerequisites
- Docker Desktop (with WSL2 enabled on Windows)
- Git (to clone and push to repository)

### Clone and Run
```bash
git clone https://github.com/xiocaa/TaskManager.git
cd TaskManager

# build and start all services
docker compose up -d --build

``` 
## Visit
- Frontend: http://localhost:8080
- Health Check: http://localhost:8080/api/health
