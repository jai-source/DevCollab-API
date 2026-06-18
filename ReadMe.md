# DevCollab API

A scalable backend API for collaborative project and task management built with TypeScript, Express, Prisma, PostgreSQL, Redis, and Docker.

## Tech Stack

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* Prisma ORM
* Redis
* Docker & Docker Compose
* Zod
* JWT Authentication (Upcoming)
* BullMQ (Upcoming)

---

## Features


* TypeScript Project Setup
* Express Server Configuration
* Environment Variable Validation
* Dockerized PostgreSQL & Redis
* Middleware Pipeline
  * Helmet
  * CORS
  * Request Logger
  * JSON Parser
  * Error Handler
* Prisma ORM Integration
* Database Migrations
* Database Seeding
* Connection Pooling Configuration
* User Registration
* User Login
* Refresh Token Rotation
* Role-Based Access Control (RBAC)
* Workspace Management
* Project Management
* Task Management
* Comments System
* Redis Caching
* BullMQ Notifications

---

## Project Structure

```text
src
├── config
│   ├── env.ts
│   └── prisma.ts
│
├── controllers
├── middleware
├── routes
├── services
├── utils
├── jobs
│
├── app.ts
└── server.ts

prisma
├── schema.prisma
└── seed.ts
```

---

## Environment Variables

Create a `.env` file in the root directory.

```env
PORT=3000

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devcollab?connection_limit=5"

REDIS_URL="redis://localhost:6379"

JWT_ACCESS_SECRET=your_access_secret

JWT_REFRESH_SECRET=your_refresh_secret

NODE_ENV=development
```

---

## Connection Pooling

Prisma connection pooling is configured using the `connection_limit` parameter.

Example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/devcollab?connection_limit=5"
```

Recommended formula:

```text
pool_size = (num_cores * 2) + 1
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/jai-source/DevCollab-API.git
cd DevCollab-API
```

### Install Dependencies

```bash
npm install
```

### Configure Environment

```bash
cp .env.example .env
```

Update the values accordingly.

---

## Running Docker Services

Start PostgreSQL and Redis:

```bash
docker compose up -d
```

Verify:

```bash
docker ps
```

---

## Database Setup

Generate Prisma Client:

```bash
npx prisma generate
```

Run Migrations:

```bash
npx prisma migrate dev --name init
```

Seed Database:

```bash
npx prisma db seed
```

Open Prisma Studio:

```bash
npx prisma studio
```

---

## Running the Application

Development Mode:

```bash
npm run dev
```

Production Build:

```bash
npm run build
npm start
```

---

## Database Schema

### Models

* User
* RefreshToken
* Workspace
* WorkspaceMember
* Project
* Task
* Comment

### Enums

#### Role

```text
USER
ADMIN
```

#### WorkspaceRole

```text
OWNER
ADMIN
MEMBER
```

#### TaskStatus

```text
TODO
IN_PROGRESS
DONE
```

#### Priority

```text
LOW
MEDIUM
HIGH
```

---

## Seed Data

The seed script creates:

* 1 Admin User
* 1 Workspace
* 1 Workspace Owner Membership
* 1 Project
* 5 Sample Tasks

---

## API Health Check

```http
GET /api/v1/health
```

Response:

```json
{
  "success": true,
  "message": "API running"
}
```

---

## Author

Jai Ratna

Built as part of the DevCollab backend engineering project.
