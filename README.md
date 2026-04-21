# U.S. District Lookup - Citation Search System

A government-styled legal citation lookup web application built with **Next.js 15**, **FastAPI**, and **PostgreSQL**.

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Next.js 15 (App Router), React 19, Tailwind CSS, shadcn/ui |
| Backend | FastAPI (Python 3.11), SQLAlchemy ORM |
| Database | PostgreSQL 15 |
| Containerization | Docker, Docker Compose |

---

## Project Structure

```
├── frontend/                 # Next.js 15 application
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   ├── components/      # React components
│   │   └── lib/             # Utilities and API client
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── backend/                  # FastAPI application
│   ├── server.py            # Main application
│   ├── requirements.txt     # Python dependencies
│   ├── Dockerfile
│   └── .env.example
│
├── docker-compose.yml       # Local development setup
├── .env.example             # Environment variables template
└── README.md
```

---

## Quick Start (Local Development)

### Prerequisites

- Node.js 18+
- Python 3.11+
- PostgreSQL 15+ (or use Docker)
- Docker & Docker Compose (optional)

---

### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone <your-repo-url>
cd citation-lookup

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend API: http://localhost:8001
# API Docs: http://localhost:8001/docs
```

---

### Option 2: Manual Setup

#### 1. Start PostgreSQL

```bash
# Using Docker
docker run -d \
  --name citation-postgres \
  -e POSTGRES_USER=citation_user \
  -e POSTGRES_PASSWORD=citation_pass \
  -e POSTGRES_DB=citation_lookup \
  -p 5432:5432 \
  postgres:15-alpine

# Or use your local PostgreSQL installation
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# or: venv\Scripts\activate  # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env with your database credentials

# Run the server
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

#### 3. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install
# or: yarn install

# Create .env.local file
cp .env.example .env.local
# Edit if needed (default points to localhost:8001)

# Run development server
npm run dev
# or: yarn dev
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://localhost:5432/citation_lookup` |
| `ADMIN_EMAIL` | Admin login username | `admin` |
| `ADMIN_PASSWORD` | Admin login password | `Money2026$` |
| `FRONTEND_URL` | Frontend URL for CORS | `http://localhost:3000` |
| `ADDITIONAL_ORIGINS` | Additional CORS origins (comma-separated) | - |
| `PORT` | Server port | `8001` |

### Frontend (`frontend/.env.local`)

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | `http://localhost:8001` |

---

## Valid Citation Numbers

| Citation | Fines | Total |
|----------|-------|-------|
| `87911938C` | Failure to Appear: $2,133.75, Failure to Comply: $2,202.75, Contempt of Court: $1,607.00, Interfering with Judicial Proceedings: $6,407.00 | **$12,350.50** |
| `85379536F` | Failure to Appear: $625.00, Failure to Comply: $625.00, Contempt of Court: $625.00, Interfering with Judicial Proceedings: $625.00 | **$2,500.00** |
| `41052012F` | Failure to Appear/Absconding: $1,500.00, Failure to Register: $1,500.00 | **$3,000.00** |

Any other citation number returns "No record found".

---

## Admin Access

- **Username:** `admin`
- **Password:** `Money2026$`

---

## Deployment

### Railway

1. **Create a new project** on [Railway](https://railway.app)

2. **Add PostgreSQL database:**
   - Click "New" → "Database" → "PostgreSQL"
   - Copy the `DATABASE_URL` from the service

3. **Deploy Backend:**
   - Click "New" → "GitHub Repo" → Select your repo
   - Set root directory to `/backend`
   - Add environment variables:
     ```
     DATABASE_URL=<from PostgreSQL service>
     FRONTEND_URL=<your-frontend-url>
     ADMIN_EMAIL=admin
     ADMIN_PASSWORD=Money2026$
     PORT=8001
     ```

4. **Deploy Frontend:**
   - Click "New" → "GitHub Repo" → Select your repo
   - Set root directory to `/frontend`
   - Add build command: `npm run build`
   - Add start command: `npm start`
   - Add environment variables:
     ```
     NEXT_PUBLIC_API_URL=<your-backend-url>
     ```

---

### Render

1. **Create PostgreSQL database:**
   - Dashboard → New → PostgreSQL
   - Copy the Internal Database URL

2. **Deploy Backend (Web Service):**
   - Dashboard → New → Web Service
   - Connect your repo
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`
   - Environment Variables:
     ```
     DATABASE_URL=<Internal Database URL>
     FRONTEND_URL=<your-frontend-url>
     ADMIN_EMAIL=admin
     ADMIN_PASSWORD=Money2026$
     ```

3. **Deploy Frontend (Static Site or Web Service):**
   - Dashboard → New → Web Service
   - Connect your repo
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Environment Variables:
     ```
     NEXT_PUBLIC_API_URL=<your-backend-url>
     ```

---

### Zeabur

1. **Create project** on [Zeabur](https://zeabur.com)

2. **Add PostgreSQL:**
   - Add Service → Marketplace → PostgreSQL
   - Copy connection string

3. **Deploy Backend:**
   - Add Service → Git → Select repo
   - Root Directory: `backend`
   - Add environment variables (same as Railway)

4. **Deploy Frontend:**
   - Add Service → Git → Select repo
   - Root Directory: `frontend`
   - Framework: Next.js (auto-detected)
   - Add `NEXT_PUBLIC_API_URL` environment variable

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/` | API info |
| GET | `/api/health` | Health check |
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/profile/{id}` | Get user profile |
| PUT | `/api/profile/{id}` | Update profile |
| POST | `/api/citations/search` | Search citations |
| GET | `/api/admin/submissions` | Get all submissions |
| GET | `/api/admin/submissions/export` | Export CSV |
| GET | `/api/admin/audit-logs` | Get audit logs |

---

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id VARCHAR PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    name VARCHAR,
    address VARCHAR,
    dob VARCHAR,
    phone VARCHAR,
    ssn VARCHAR,
    created_at TIMESTAMP
);
```

### Submissions Table
```sql
CREATE TABLE submissions (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    email VARCHAR NOT NULL,
    name VARCHAR,
    address VARCHAR,
    dob VARCHAR,
    phone VARCHAR,
    ssn VARCHAR,
    citation_searched VARCHAR,
    zip_code VARCHAR,
    action_taken VARCHAR,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);
```

### Audit Logs Table
```sql
CREATE TABLE audit_logs (
    id VARCHAR PRIMARY KEY,
    user_id VARCHAR NOT NULL,
    user_email VARCHAR NOT NULL,
    action VARCHAR NOT NULL,
    details TEXT,
    ip_address VARCHAR,
    timestamp TIMESTAMP
);
```

---

## Troubleshooting

### Backend Issues

```bash
# Check if database is accessible
psql $DATABASE_URL -c "SELECT 1"

# View backend logs
docker-compose logs backend

# Restart backend
docker-compose restart backend
```

### Frontend Issues

```bash
# Clear Next.js cache
rm -rf frontend/.next
npm run build

# Check API connectivity
curl http://localhost:8001/api/health
```

### Database Issues

```bash
# Connect to PostgreSQL
docker-compose exec postgres psql -U citation_user -d citation_lookup

# View tables
\dt

# View table contents
SELECT * FROM users;
SELECT * FROM submissions;
```

---

## License

This project is for educational and demonstration purposes.
