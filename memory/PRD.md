# Legal Citation Lookup Site (Shotta) - PRD

## Original Problem Statement
Build website from GitHub repository - Legal citation lookup site styled like a US government website for educational purposes.

## Source
Repository: Shotta-main.zip (uploaded by user)

## Architecture
- **Frontend**: React 19 with Shadcn UI components, React Router, Axios
- **Backend**: FastAPI with Motor (async MongoDB)
- **Database**: MongoDB
- **Styling**: Tailwind CSS, Swiss/Government design system

## Core Features (Implemented)
- [x] User registration with bcrypt password hashing
- [x] User login authentication
- [x] User profile management (name, address, DOB, phone, email)
- [x] Citation search by name, citation number, zip code
- [x] 5-second loading animation with progress bar
- [x] Results display with citation table
- [x] "Citations not found" state for invalid citations
- [x] Courses of Action (Criminal/Civil paths)
- [x] Self-surrender confirmation dialog
- [x] Payment methods page
- [x] Federal Bonding Kiosk information page
- [x] Payment form
- [x] Admin dashboard with user submissions

## User Flow
1. **Login/Create Account** - Email & Password authentication
2. **User Profile** - Complete profile with personal information
3. **Citation Search** - Search by name, citation number, zip code
4. **Loading Screen** - 5-second progress animation
5. **Results** - Display citations or "not found" message
6. **Courses of Action** - Choose Criminal or Civil path
7. **Payment/Surrender** - Complete selected action

## Test Credentials
- **Admin**: email=`admin`, password=`Money2026$`
- **Test Citation**: `87911938c` (returns 4 mock citations)

## Tech Stack
- React 19, React Router 7, Axios
- FastAPI, Motor (async MongoDB), bcrypt
- Tailwind CSS, Shadcn UI components
- lucide-react icons

## Date Implemented
April 2026

## Testing Results
- Backend: 100% (11/11 tests passed)
- Frontend: 95% (1 minor UI issue with date picker - LOW priority)

## Backlog / Future Enhancements
- P2: Fix date picker calendar interaction
- P2: Add email verification
- P3: Add password reset functionality
- P3: Add real payment processing integration
