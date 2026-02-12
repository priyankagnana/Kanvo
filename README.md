# Kanvo

A focused Kanban project management tool for makers, founders, and small teams who value simplicity.

**Live:** https://kanvo-nu.vercel.app

---

## What it does

Kanvo is a full-stack Kanban app. Create boards, organize tasks into sections, drag them between columns, and track progress — without the enterprise bloat.

- Drag-and-drop Kanban boards with sections and tasks
- Task priorities (high/medium/low), due dates, subtasks, tags
- Rich text descriptions with inline editor
- Search, filter, and sort across tasks
- Board favorites with custom ordering
- Real-time analytics dashboard
- Dark and light mode with persistent preference
- Responsive — works on desktop and mobile

## Tech stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Material-UI 6, Redux Toolkit, @hello-pangea/dnd, Framer Motion |
| Backend | Node.js, Express 4, Mongoose 8 |
| Database | MongoDB Atlas |
| Auth | JWT + bcryptjs |
| Deployment | Vercel (frontend), Render (backend) |

## Architecture

```
[React SPA] → [Express REST API] → [MongoDB Atlas]
     ↑               ↓
  Redux          JWT auth
  React Router   Rate limiting
  Code splitting Gzip compression
  Lazy loading   Connection pooling
```

## Performance

The server and client have been optimized for production:

**Server:**
- MongoDB indexes on all queried fields
- N+1 query elimination (batch fetches instead of loops)
- `bulkWrite()` for batch position updates
- Gzip response compression
- Rate limiting (50/15min auth, 200/15min API)
- Connection pooling (maxPoolSize: 50)

**Client:**
- Route-based code splitting with `React.lazy`
- `React.memo` on frequently rendered components (TaskCard, Kanban, FavouriteList)
- `useCallback` / `useMemo` to prevent unnecessary re-renders
- Search debouncing (300ms) to reduce API calls
- Lazy-loaded heavy dependencies (ReactQuill, TaskModal)
- Shimmer skeleton loading states

## Getting started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Setup

```bash
git clone https://github.com/priyankagnana/Kanvo.git
cd Kanvo
```

**Server:**

```bash
cd server
npm install
cp .env.example .env   # Edit with your MongoDB URL and secrets
npm start              # Runs on http://localhost:5001
```

**Client:**

```bash
cd client
npm install
npm start              # Runs on http://localhost:3000
```

### Environment variables

**server/.env:**

```
MONGODB_URL=mongodb+srv://user:pass@cluster.mongodb.net/kanvo
TOKEN_SECRET_KEY=your_token_secret
PASSWORD_SECRET_KEY=your_password_secret
FRONTEND_URL=http://localhost:3000
PORT=5001
```

**client/.env:**

```
REACT_APP_API_URL=http://localhost:5001/api/v1/
```

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/signup` | Register |
| POST | `/api/v1/auth/login` | Login, returns JWT |
| POST | `/api/v1/auth/verify-token` | Verify token |
| GET | `/api/v1/boards` | List boards (search/filter/sort/pagination) |
| POST | `/api/v1/boards` | Create board |
| GET | `/api/v1/boards/:id` | Get board with sections and tasks |
| PUT | `/api/v1/boards/:id` | Update board |
| DELETE | `/api/v1/boards/:id` | Delete board + cascade |
| PUT | `/api/v1/boards` | Update board positions |
| GET | `/api/v1/boards/favourites` | Get favourite boards |
| PUT | `/api/v1/boards/favourites` | Update favourite positions |
| POST | `/api/v1/boards/:boardId/sections` | Create section |
| PUT | `/api/v1/boards/:boardId/sections/:sectionId` | Update section |
| DELETE | `/api/v1/boards/:boardId/sections/:sectionId` | Delete section + tasks |
| POST | `/api/v1/boards/:boardId/tasks` | Create task |
| PUT | `/api/v1/boards/:boardId/tasks/:taskId` | Update task |
| DELETE | `/api/v1/boards/:boardId/tasks/:taskId` | Delete task |
| PUT | `/api/v1/boards/:boardId/tasks/update-position` | Reorder tasks (drag-drop) |
| GET | `/api/v1/boards/:boardId/tasks/search` | Search/filter/sort tasks |
| GET | `/api/v1/user/profile` | Get profile |
| PUT | `/api/v1/user/profile` | Update username |
| GET | `/api/v1/user/analytics` | Dashboard analytics |
| GET | `/health` | Health check |

## Project structure

```
Kanvo/
├── client/
│   └── src/
│       ├── api/            # API client layer
│       ├── components/
│       │   ├── common/     # Kanban, TaskModal, Sidebar, ToastProvider,
│       │   │               # ConfirmDialog, EmptyState, ErrorBoundary, Skeletons
│       │   └── layout/     # AppLayout, AuthLayout
│       ├── pages/          # Landing, Login, Signup, Home, Board, Profile, NotFound
│       ├── redux/          # Store + slices (user, board, favourites)
│       ├── utils/          # Auth helpers
│       └── App.jsx         # Routes, theme, providers
├── server/
│   ├── bin/www             # Entry point, MongoDB connection
│   ├── app.js              # Express middleware, compression, rate limiting, CORS
│   └── src/v1/
│       ├── controllers/    # Board, task, section, user logic
│       ├── models/         # Mongoose schemas with indexes
│       ├── routes/         # Express routes
│       └── handlers/       # JWT verification, validation
├── IMPLEMENTATION_PLAN.md  # Performance + UX improvement roadmap
├── UI_UX_AUDIT.md          # Page-by-page audit + feature proposals
└── README.md
```

## Deployment

**Frontend (Vercel):**
- Set `REACT_APP_API_URL` to your Render backend URL (include trailing `/api/v1/`)
- Auto-deploys from git

**Backend (Render):**
- Start command: `node bin/www`
- Don't set `PORT` — Render provides it via `process.env.PORT`
- Set all env vars from `.env.example`
- Uses `bcryptjs` (not `bcrypt`) to avoid native build issues

## License

MIT
