# U.S. District Lookup — Static Citation Search

A government-styled citation lookup web application built as a **100% static React
single-page app**. No backend, no database, no server runtime — deploy the `build/`
folder to any static host (GitHub Pages, Hostinger, Netlify, Vercel, S3, etc.).

## Tech Stack
- **React 18** + **react-router-dom** (HashRouter — works on any static host, no URL
  rewrites required)
- **Tailwind CSS** + **lucide-react** icons
- **Create React App** build pipeline (`react-scripts`)
- **sessionStorage** for simulated user registration / login / profile
- **Hardcoded JS** for the citation database

> There is **no backend** in this repo. Anything that previously looked like an API
> call is now a pure JS function against in-memory / sessionStorage data.

## Project Structure
```
/app
├── frontend/
│   ├── public/index.html
│   ├── src/
│   │   ├── App.js                 # HashRouter + routes
│   │   ├── index.js / index.css
│   │   ├── components/
│   │   │   ├── Layout.js          # GovHeader + GovFooter (Logout button)
│   │   │   └── ProtectedRoute.js  # Redirects unauthenticated users to /
│   │   ├── pages/                 # Login, Register, Profile, Search, Loading,
│   │   │                          # Results, CoursesOfAction, SelfSurrender,
│   │   │                          # PaymentMethods, PaymentForm, FederalKiosk
│   │   └── utils/
│   │       ├── auth.js            # register / login / logout / saveProfile
│   │       └── citations.js       # 3 hardcoded citations
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── memory/                        # PRD, test credentials (internal)
└── README.md
```

## Valid Citations
These three citation numbers are the **only** lookups that return data. Any other input
returns *"No record found"*:

| Citation | Fine total |
|----------|------------|
| `87911938C` | $12,350.50 |
| `85379536F` | $2,500.00  |
| `41052012F` | $3,000.00  |

## Local Development
```bash
cd frontend
yarn install
yarn start              # runs http://localhost:3000
```

## Production Build
```bash
cd frontend
yarn build              # outputs a fully static `build/` folder
```

## Deploy the `build/` folder
Any static host works. Examples:

- **GitHub Pages** – push `build/` to the `gh-pages` branch (or publish `build/` as the
  Pages source). The `"homepage": "."` in `package.json` already uses relative asset
  paths so it runs from any sub-path.
- **Hostinger / any shared hosting** – upload the contents of `build/` to `public_html/`.
- **Netlify / Vercel / Cloudflare Pages** – point the deploy at `frontend/` with
  `build command: yarn build` and `publish directory: build`.

Because the app uses **HashRouter** (URLs like `https://your.site/#/profile`), you do
**not** need any server-side URL rewrite rules.

## Test Account
The app starts with zero users. Register a new account on `/#/register` and the user
will be stored in `sessionStorage` for the current browser tab. Example credentials
used for automated tests live in `/app/memory/test_credentials.md`.

## License
Internal demo project.
