# Legal Citation Lookup Site - PRD

## Original Problem Statement
Legal citation lookup site for educational purposes where an individual can type in a citation number and get results showing mock criminal citations.

## Architecture
- **Frontend**: React with Shadcn UI components, Swiss design system
- **Backend**: FastAPI with MongoDB
- **Design**: Swiss/High-Contrast style (pure white, pure blue #0000FF, no rounded corners)

## User Flow
1. **Create Account** → Email & Password registration
2. **User Profile** → Name, Address, DOB, Phone, Email fields
3. **Citation Search** → Name, Citation Number, Zip Code + Search button
4. **Loading Screen** → 5-second progress animation
5. **Results** → If citation "87911938c" shows 4 citations for Michael J. Thompson; otherwise "Citations not found"

## Core Features (Implemented)
- [x] User registration with bcrypt password hashing
- [x] User profile management
- [x] Citation search (hardcoded for 87911938c)
- [x] 5-second loading animation
- [x] Results display with citation table
- [x] Not found state for invalid citations

## Test Citation
- **Citation Number**: 87911938c
- **Name**: Michael J. Thompson
- **DOB**: 03/15/1985
- **4 Mock Citations**: Speeding, Failure to Signal, Expired Registration, Running Red Light

## Tech Stack
- React 19, React Router, Axios
- FastAPI, Motor (async MongoDB), bcrypt
- Tailwind CSS, Shadcn UI components

## Date Implemented
January 2026
