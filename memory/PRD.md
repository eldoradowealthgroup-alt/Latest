# Citation Lookup System - PRD

## Original Problem Statement
Build a legal citation lookup website from a GitHub repository, then restructure with modern stack for maximum portability:
- Frontend: Next.js 15 (App Router) with React 19, Tailwind CSS, shadcn/ui
- Backend: FastAPI with SQLAlchemy ORM
- Database: PostgreSQL (SQLite for local dev)
- Docker support for Railway/Render/Zeabur deployment

## Architecture

### Tech Stack
| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15, React 19, Tailwind CSS |
| Backend | FastAPI, SQLAlchemy, Pydantic |
| Database | PostgreSQL (prod) / SQLite (dev) |
| Containerization | Docker, Docker Compose |

### Project Structure
```
/app
├── frontend/           # Next.js 15 App Router
│   ├── src/app/       # Pages (login, register, profile, search, etc.)
│   ├── src/components/ # UI components
│   └── src/lib/       # API client, utilities
├── backend/           # FastAPI
│   └── server.py      # Main application with SQLAlchemy models
├── docker-compose.yml # Local development
└── README.md          # Deployment guides
```

## Core Features (Implemented)

### User Features
- [x] User registration with email/password
- [x] User login authentication
- [x] Profile management (name, address, DOB, phone, email, SSN)
- [x] Citation search by name, citation number, zip code
- [x] Loading animation (5 seconds)
- [x] Results display with citation table
- [x] Courses of Action (Criminal/Civil)
- [x] Payment methods page with logout

### Admin Features
- [x] Admin dashboard with submissions table
- [x] Audit log tracking all user actions
- [x] CSV export functionality

## Valid Citation Numbers
| Citation | Total Fines |
|----------|-------------|
| 87911938c | $12,350.50 |
| 5998563f | $9,237.00 |
| 6339179c | $3,576.00 |

## Admin Credentials
- Username: `admin`
- Password: `Money2026$`

## Environment Variables

### Backend
- `DATABASE_URL` - PostgreSQL/SQLite connection string
- `ADMIN_EMAIL` - Admin username
- `ADMIN_PASSWORD` - Admin password
- `FRONTEND_URL` - Frontend URL for CORS

### Frontend
- `NEXT_PUBLIC_API_URL` - Backend API URL

## Deployment Ready
- Docker Compose for local development
- Dockerfiles for both frontend and backend
- README with Railway, Render, Zeabur deployment guides
- No Emergent-specific dependencies

## Testing Results (April 2026)
- Backend: 89% (16/18 tests - 2 minor API design issues)
- Frontend: 100%
- Integration: 100%

## Files Created/Modified
- `/app/frontend/` - Complete Next.js 15 rewrite
- `/app/backend/server.py` - SQLAlchemy with PostgreSQL support
- `/app/docker-compose.yml` - Local dev setup
- `/app/README.md` - Comprehensive documentation
- `/app/.env.example` - Environment template

## Next Steps
- P1: Add password reset functionality
- P2: Add email verification
- P3: Implement real payment processing
