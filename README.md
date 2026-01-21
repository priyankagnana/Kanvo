# Kanvo – Smart Kanban Project Management App 🎯

Kanvo is a full-stack Kanban platform to organize projects, sections, and tasks with drag-and-drop, advanced search, sorting, filtering, pagination, favorites, and theming.

## 📌 Table of Contents
- [Live Demo](#-live-demo)
- [Problem Statement](#-problem-statement)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [API Overview](#-api-overview)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [Deployment Notes](#-deployment-notes)
- [License & Links](#-license--links)

## 🚀 Live Demo
- Frontend (Vercel): https://capstone-ap.vercel.app/
- Backend (Render): https://capstoneap.onrender.com

## 🔍 Problem Statement
Managing many projects and tasks across tools is messy. Kanvo unifies Kanban boards, search/sort/filter/pagination, and favorites so teams can find and organize work quickly and consistently.

## 🏗 System Architecture
- Frontend: React + Material UI + Redux + drag-and-drop (@hello-pangea/dnd)
- Backend: Node.js + Express REST API
- Database: MongoDB Atlas
- Auth: JWT + bcryptjs
- Hosting: Frontend → Vercel, Backend → Render, DB → MongoDB Atlas

Text diagram:
```
[React Frontend] → [Express REST API] → [MongoDB Atlas]
      ↑                  ↓
   Redux state     JWT auth, CRUD, search/sort/filter/pagination
```

## ✨ Key Features
- Auth & Security: Signup/Login with JWT; password hashing (bcryptjs).
- Boards Management: Create/edit/delete boards; drag-and-drop sections and tasks.
- Sections & Tasks: Notes, due dates, priority, status.
- Search / Sort / Filter / Pagination: By title/tag, status, priority; sort by date/name; paginated results.
- Favorites: Mark boards for quick access.
- UI & Personalization: Dark/Light mode, responsive Material UI.
- State Management: Redux for real-time UI updates.
- Data: MongoDB persistence.

## 🛠 Tech Stack
- Frontend: React, Redux, Material-UI, @hello-pangea/dnd
- Backend: Node.js, Express.js
- Database: MongoDB (indexed for search/sort/pagination)
- Auth: JWT, bcryptjs
- Hosting: Vercel (frontend), Render (backend), MongoDB Atlas (DB)

## 📡 API Overview (selected)
| Endpoint | Method | Description | Access |
| --- | --- | --- | --- |
| /api/auth/signup | POST | Register a new user | Public |
| /api/auth/login | POST | Authenticate user, return JWT | Public |
| /api/boards | GET | List boards (search/filter/sort/pagination) | Auth |
| /api/boards | POST | Create board | Auth |
| /api/boards/:id | PUT | Update board | Auth |
| /api/boards/:id | DELETE | Delete board | Auth |
| /api/sections | POST | Add section | Auth |
| /api/tasks | POST | Add task | Auth |
| /api/tasks/:id | PUT | Update task | Auth |
| /api/tasks/search | GET | Search/sort/filter tasks | Auth |
| /api/favorites | GET | Fetch favorite boards | Auth |

Example advanced query:
```
GET /api/tasks?search=design&filter=completed&sort=createdAt&page=2&limit=10
```

## 💻 Local Setup
Prereqs: Node.js, MongoDB, npm/yarn

Clone:
```bash
git clone https://github.com/Champion1102/Kanvo.git
cd Kanvo
```

Frontend:
```bash
cd client
npm install
npm start
```

Backend:
```bash
cd ../server
npm install
npm start
```

Open: http://localhost:3000

## 🔐 Environment Variables
Create `server/.env`:
```
MONGODB_URL=<your_mongodb_connection_string>
JWT_SECRET=<your_jwt_secret>
PASSWORD_SECRET_KEY=<your_password_key>
TOKEN_SECRET_KEY=<your_token_key>
# PORT optional locally (e.g., 5001). On Render, leave unset so process.env.PORT is used.
```

Create `client/.env`:
```
REACT_APP_API_URL=<your_backend_base>/api/v1/
```

## 🗂 Project Structure
```
Kanvo/
├── client/        # React frontend
├── server/        # Node/Express backend
│   ├── bin/www    # Server entrypoint (port binding, Mongo connect)
│   ├── src/v1/    # Controllers, routes, models, handlers
│   └── app.js     # Express app/middleware
└── README.md
```

## 🚢 Deployment Notes
- Frontend: Vercel (set `REACT_APP_API_URL` to the Render backend, include trailing `/api/v1/`).
- Backend: Render
  - Start command: `node bin/www` (not nodemon)
  - Do not set `PORT`; Render provides `process.env.PORT`.
  - Ensure env vars above (use Atlas URL for Mongo).
  - Using bcryptjs avoids native build issues on Node/Render.

## 📄 License & Links
- GitHub: https://github.com/Champion1102/Kanvo
- Live App: https://capstone-ap.vercel.app/
- Backend (Render): https://capstoneap.onrender.com
- License: MIT
