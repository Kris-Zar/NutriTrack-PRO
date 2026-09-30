<div align="center">

# 🥗 NutriTrack PRO

**Your Complete Nutrition & Fitness Companion**

A fullstack app to log meals, track macros, and hit your daily nutrition goals — with optional AI-powered food image analysis.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-Visit_App-84cc16?style=for-the-badge)](https://nutritrack-frontend-behf.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Kris--Zar%2FNutriTrack--PRO-181717?style=for-the-badge&logo=github)](https://github.com/Kris-Zar/NutriTrack-PRO)
[![Python](https://img.shields.io/badge/Backend-Python%20%2F%20FastAPI-3776AB?style=for-the-badge&logo=python)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)

</div>

---

## 🌐 Live Demo

> **[https://nutritrack-frontend-behf.onrender.com](https://nutritrack-frontend-behf.onrender.com)**

> ⚠️ Hosted on Render's free tier — the backend may take **30–60 seconds to wake up** on first load. The demo runs in `DEMO_MODE` (in-memory storage, no database required). For full persistent storage, clone the repo and run locally with MongoDB.

---

## 📖 About

NutriTrack PRO is a fullstack nutrition tracking web application. The frontend is a **React 18** SPA with **Tailwind CSS** and **shadcn/ui** components. The backend is a **FastAPI** (Python) REST API that supports two modes:

- **Demo mode** — all data stored in-memory, zero setup required
- **Production mode** — persists data in MongoDB, with optional AI food image analysis via Google Gemini

Users are identified by a UUID stored in `localStorage`, so no account creation is needed to try the app.

---

## ✨ Features

| Tab | Status | Description |
|-----|--------|-------------|
| 🏠 Dashboard | ✅ Live | Daily calorie ring, macro progress bars (protein / carbs / fats), meals logged count |
| 👤 Profile | ✅ Live | Set name, age, weight, height, gender, activity level, fitness goal — calorie targets auto-calculated |
| 🍎 Foods | ✅ Live | View and delete logged food entries filtered by date |
| 🍽️ Log Meals | ✅ Live | Manual entry OR AI image analysis (upload a food photo → Gemini estimates macros) |
| 📅 Planner | 🚧 Coming soon | Meal planning |
| 📖 Recipes | 🚧 Coming soon | Recipe library |
| 📊 Progress | 🚧 Coming soon | Historical charts |
| ⏰ Fasting | 🚧 Coming soon | Intermittent fasting tracker |

---

## 🛠️ Tech Stack

### Frontend
| Technology | Version | Role |
|------------|---------|------|
| React | 18.2 | UI framework |
| React Router DOM | 7.5 | Client-side routing |
| Tailwind CSS | 3.4 | Utility-first styling |
| shadcn/ui + Radix UI | latest | Accessible component primitives |
| Axios | 1.8 | HTTP client |
| React Hook Form + Zod | latest | Form handling & validation |
| Lucide React | 0.507 | Icon set |
| CRACO | 7.1 | Create React App config override (path aliases) |

### Backend
| Technology | Version | Role |
|------------|---------|------|
| Python | 3.10+ | Runtime |
| FastAPI | ≥0.110 | REST API framework |
| Uvicorn | ≥0.25 | ASGI server |
| Motor | ≥3.3 | Async MongoDB driver |
| Pydantic | v2 | Data validation & models |
| python-dotenv | ≥1.0 | Environment config |
| python-multipart | ≥0.0.9 | File upload support |
| google-genai | ≥1.0 | Gemini AI (optional, for image analysis) |

### Deployment
| Service | Usage |
|---------|-------|
| Render (free tier) | Frontend (static) + Backend (Python web service) |
| MongoDB Atlas | Production database (optional) |

---

## 📁 Project Structure

```
NutriTrack-PRO/
│
├── backend/                        # FastAPI Python backend
│   ├── server.py                   # Main app — all routes, models, DB logic
│   ├── requirement.txt             # Python dependencies
│   └── .env.example                # Backend environment variable template
│
├── frontend/                       # React frontend (canonical source)
│   ├── public/
│   │   └── index.html              # HTML shell
│   ├── src/
│   │   ├── App.js                  # Root component, tab routing, user ID management
│   │   ├── App.css                 # Global styles
│   │   ├── index.js                # React entry point
│   │   ├── index.css               # Tailwind base imports
│   │   ├── components/
│   │   │   ├── Dashboard.js        # Calorie ring + macro progress bars
│   │   │   ├── Foods.js            # Food log viewer with date filter + delete
│   │   │   ├── LogMeals.js         # Manual entry + AI image analysis form
│   │   │   ├── Profile.js          # User profile form + auto calorie calc
│   │   │   └── ui/                 # shadcn/ui component library (40+ primitives)
│   │   │       ├── accordion.jsx
│   │   │       ├── alert.jsx
│   │   │       ├── avatar.jsx
│   │   │       ├── badge.jsx
│   │   │       ├── button.jsx
│   │   │       ├── calendar.jsx
│   │   │       ├── card.jsx
│   │   │       ├── dialog.jsx
│   │   │       ├── dropdown-menu.jsx
│   │   │       ├── form.jsx
│   │   │       ├── input.jsx
│   │   │       ├── label.jsx
│   │   │       ├── progress.jsx
│   │   │       ├── select.jsx
│   │   │       ├── tabs.jsx
│   │   │       ├── toast.jsx / toaster.jsx
│   │   │       └── ... (30+ more)
│   │   ├── hooks/
│   │   │   └── use-toast.js        # Toast notification hook
│   │   └── lib/
│   │       └── utils.js            # cn() class merge utility
│   ├── package.json                # Dependencies + scripts (start/build/test via craco)
│   ├── craco.config.js             # Webpack overrides, @ path alias
│   ├── tailwind.config.js          # Tailwind theme + shadcn/ui tokens
│   ├── postcss.config.js           # PostCSS config
│   ├── jsconfig.json               # JS path resolution
│   └── .env.example                # Frontend environment variable template
│
├── src/                            # Mirror of frontend/src (root-level copy)
├── render.yaml                     # Render deployment config (both services)
├── .env.example                    # Root-level env template
├── .gitignore
└── README.md
```

> **Note:** The root-level `src/`, `public/`, `package.json`, `craco.config.js`, and `tailwind.config.js` are a mirror of the `frontend/` directory. The canonical source is `frontend/`. The `render.yaml` deploys `backend/` as a Python web service and `frontend/` as a static site.

---

## 🚀 Local Setup

### Prerequisites

- **Node.js** v18+ and **npm** (or Yarn)
- **Python** 3.10+
- **pip**
- *(Optional)* MongoDB instance — local or [MongoDB Atlas](https://www.mongodb.com/atlas)
- **Google Gemini API key** — for AI food image analysis

---

### 1. Clone the repository

```bash
git clone https://github.com/Kris-Zar/NutriTrack-PRO.git
cd NutriTrack-PRO
```

---

### 2. Set up the Backend

```bash
cd backend
pip install -r requirement.txt
```

Create a `.env` file inside `backend/` (copy from the example):

```bash
cp .env.example .env
```

Open `backend/.env` and configure:

```env
# Set to true to use in-memory storage (no MongoDB needed).
# Set to false (or remove) when MONGO_URL is provided.
DEMO_MODE=true

# Allowed CORS origins. Use * for development.
CORS_ORIGINS=*

# --- Optional: Production integrations (do not commit real values) ---

# MongoDB connection string
# MONGO_URL=mongodb://localhost:27017/nutritrack
# DB_NAME=nutritrack

# Google Gemini API key (enables AI food image analysis in Log Meals)
# GOOGLE_API_KEY=your_google_api_key_here
# GEMINI_MODEL=gemini-2.5-flash
```

Start the backend server:

```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --reload
```

The API will be running at **`http://localhost:8000`**.
Health check: `http://localhost:8000/api/health`

---

### 3. Set up the Frontend

Open a new terminal:

```bash
cd frontend
npm install
```

Create a `.env` file inside `frontend/` (copy from the example):

```bash
cp .env.example .env
```

Open `frontend/.env` and configure:

```env
# Point this at your running backend
REACT_APP_BACKEND_URL=http://localhost:8000
```

Start the frontend:

```bash
npm start
```

The app will be running at **`http://localhost:3000`**.

---

### 4. Run both at once (optional)

You can use two terminals, or a tool like [`concurrently`](https://www.npmjs.com/package/concurrently):

```bash
# Terminal 1 — backend
cd backend && uvicorn server:app --reload --port 8000

# Terminal 2 — frontend
cd frontend && npm start
```

---

## 🔌 API Endpoints

All routes are prefixed with `/api`.

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/` | API status + mode (demo / production) |
| `GET` | `/api/health` | Health check — DB mode, Gemini status |
| `POST` | `/api/profile` | Create a user profile |
| `GET` | `/api/profile/{user_id}` | Get a user profile |
| `PUT` | `/api/profile/{user_id}` | Update a user profile |
| `POST` | `/api/food` | Log a food item |
| `GET` | `/api/food/{user_id}` | Get food logs (optional `?date_filter=YYYY-MM-DD`) |
| `DELETE` | `/api/food/{food_id}` | Delete a food entry |
| `POST` | `/api/analyze-food-image` | Upload an image → returns estimated macros via Gemini |
| `GET` | `/api/stats/{user_id}` | Daily totals + targets (optional `?date_filter=YYYY-MM-DD`) |

---

## ☁️ Deploying to Render

The repo includes a `render.yaml` that configures both services automatically.

1. Push the repo to GitHub.
2. In [Render](https://render.com), click **New → Blueprint** and connect your repo.
3. Render will detect `render.yaml` and create:
   - `nutritrack-api` — Python web service running FastAPI
   - `nutritrack-frontend` — Static site serving the React build
4. Set environment variables in the Render dashboard (see `backend/.env.example`).
5. `REACT_APP_BACKEND_URL` is auto-wired from the API service's `RENDER_EXTERNAL_HOSTNAME`.

```yaml
# render.yaml (summary)
services:
  - name: nutritrack-api       # Python / FastAPI
    runtime: python
    rootDir: backend
    buildCommand: pip install -r requirement.txt
    startCommand: uvicorn server:app --host 0.0.0.0 --port $PORT

  - name: nutritrack-frontend  # React static site
    runtime: static
    rootDir: frontend
    buildCommand: npm ci && npm run build
    staticPublishPath: build
```

---

## 🤝 Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'feat: add your feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Created by <strong>Gyanendra</strong> · Developed by <strong>Parth</strong><br/>
  <sub>App is actively in development — more features coming soon.</sub>
</div>
