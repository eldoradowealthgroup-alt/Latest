# Citation Lookup System - PRD

## Original Problem Statement
Build a legal citation lookup website. The latest pivot (Feb 2026) is to convert the
project into a **fully static React frontend** that can be built with `npm run build`
and hosted on GitHub Pages / Hostinger. **No backend, no Python, no database.**

## Architecture
- **Frontend only**: React 18 + react-router-dom (HashRouter) + Tailwind CSS + lucide-react
- **Auth**: simulated via `sessionStorage` only
- **Citation data**: hardcoded in `/app/frontend/src/utils/citations.js`
- **Build**: `cd /app/frontend && yarn build` → outputs static `build/` folder
- **Hosting**: GitHub Pages, Hostinger, Netlify, Vercel, or any static host

## Project Structure
```
/app/frontend/
├── public/
│   └── index.html
├── src/
│   ├── App.js                    # HashRouter with all routes
│   ├── index.js / index.css
│   ├── components/
│   │   ├── Layout.js             # GovHeader + GovFooter (with Logout)
│   │   └── ProtectedRoute.js     # Redirects unauthenticated users to /
│   ├── pages/
│   │   ├── Login.js
│   │   ├── Register.js
│   │   ├── Profile.js            # Saves to sessionStorage
│   │   ├── Search.js
│   │   ├── Loading.js            # 5-second progress animation
│   │   ├── Results.js
│   │   ├── CoursesOfAction.js
│   │   ├── SelfSurrender.js
│   │   ├── PaymentMethods.js
│   │   ├── PaymentForm.js
│   │   └── FederalKiosk.js       # Public route
│   └── utils/
│       ├── auth.js               # registerUser / loginUser / logoutUser / saveProfile
│       └── citations.js          # 3 hardcoded valid citations
├── package.json
├── tailwind.config.js
└── postcss.config.js
```

## Hardcoded Citations (the only valid lookups)
| Citation | Total |
|----------|-------|
| 87911938C | $12,350.50 |
| 85379536F | $2,500.00  |
| 41052012F | $3,000.00  |

Any other citation number returns `{ found: false, message: 'No record found' }`.

## Auth Flow (sessionStorage)
1. **Register** (`/register`) → email + password → stored in `sessionStorage.citation_users`
   → auto-login → redirected to `/profile`.
2. **Login** (`/`) → looks up `sessionStorage.citation_users` and stores current user
   in `sessionStorage.citation_user`.
3. **Profile** (`/profile`) → captures Full Name / Address / DOB / Phone / Email
   → stored in `sessionStorage.citation_profile`.
4. **Logout** → clears `citation_user` and `citation_profile`.
5. Data is auto-cleared when the browser tab/window closes (sessionStorage scope).

## Routing (HashRouter)
| Path | Page | Auth |
|------|------|------|
| `/` | Login | Public |
| `/register` | Register | Public |
| `/federal-kiosk` | Federal Bonding Kiosk | Public |
| `/profile` | User Profile | Protected |
| `/search` | Citation Search | Protected |
| `/loading` | Search Loading (5s) | Protected |
| `/results` | Citation Results | Protected |
| `/courses-of-action` | Courses of Action | Protected |
| `/self-surrender` | Self-Surrender Notice | Protected |
| `/payment-methods` | Payment Methods | Protected |
| `/payment-form` | Online Payment Form | Protected |

## Implementation Status (Feb 2026)
- [x] Auth utilities (`utils/auth.js`)
- [x] Hardcoded citations (`utils/citations.js`)
- [x] HashRouter App shell + ProtectedRoute
- [x] All 11 pages built with same UI as original full-stack app
- [x] Logout button in header (visible on all protected routes)
- [x] DOB native date input (no shadcn calendar dependency)
- [x] `npm run build` succeeds → produces deployable `build/` folder
- [x] Backend completely removed (no `/app/backend`, no Docker, no FastAPI)

## Backlog
- P1: Persist registered users in `localStorage` (currently lost on tab close)
- P2: Brand the kiosk image gallery with self-hosted assets
- P2: Add "Forgot password" UX (still client-side mock)
