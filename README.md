<div align="center">

<br/>

```
 _   _       _        _ _____               _      ____  ____   ___
| \ | |_   _| |_ _ __(_)_   _| __ __ _  ___| | __ |  _ \|  _ \ / _ \
|  \| | | | | __| '__| | | || '__/ _` |/ __| |/ / | |_) | |_) | | | |
| |\  | |_| | |_| |  | | | || | | (_| | (__|   <  |  __/|  _ <| |_| |
|_| \_|\__,_|\__|_|  |_| |_||_|  \__,_|\___|_|\_\ |_|   |_| \_\\___/
```

### 🥗 AI-Powered Nutrition Tracking — Full Stack

<p>
  <img src="https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Python-Backend-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/MongoDB-Database-47A248?style=for-the-badge&logo=mongodb&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Google_AI-Vision_API-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
</p>

<p>
  <img src="https://img.shields.io/badge/JavaScript-91.6%25-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"/>
  &nbsp;
  <img src="https://img.shields.io/badge/Python-5.8%25-3776AB?style=for-the-badge&logo=python&logoColor=white"/>
  &nbsp;
  <img src="https://img.shields.io/badge/CSS-2.4%25-1572B6?style=for-the-badge&logo=css3&logoColor=white"/>
</p>

<br/>

> *Snap a photo of your meal. Let AI do the nutritional heavy lifting.*

<br/>

---

</div>

## ✦ What is NutriTrack PRO?

**NutriTrack PRO** is a full-stack nutrition tracking application that harnesses the power of Google's AI Vision API to analyze food from images — no manual entry required. Upload a photo of your meal, and the app identifies the food, estimates calories, and logs it all to your personal dashboard.

Whether you're tracking macros, managing your diet, or just curious about what's on your plate, NutriTrack PRO puts intelligent nutrition data at your fingertips.

---

## ✦ Key Features

| Feature | Description |
|---|---|
| 📸 **AI Image Analysis** | Snap or upload a food photo — Google Vision AI identifies the meal and estimates its nutritional content |
| 📊 **Calorie Dashboard** | Visual calorie tracking across meals and days at a glance |
| 👤 **User Profiles** | Persistent user accounts with personal goals and history stored in MongoDB |
| 🔍 **Food Recognition** | Smart identification of ingredients and dishes from images |
| 🗃️ **Meal History** | Full log of past meals with nutritional breakdowns |

---

## ✦ Architecture

```
NutriTrack-PRO/
├── frontend/              # React SPA — UI, dashboard, image upload
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route-level views
│   │   └── ...
│   └── package.json
│
├── backend/               # Python API server
│   ├── routes/            # API endpoints
│   ├── models/            # MongoDB schemas
│   ├── services/          # Google AI integration
│   └── requirements.txt
│
├── .gitignore
└── README.md
```

---

## ✦ Tech Stack

### Frontend
| Technology | Role |
|---|---|
| React | Component-based UI framework |
| JavaScript (ES6+) | Primary language |
| CSS | Custom styling |
| Vite / CRA | Build tooling |

### Backend
| Technology | Role |
|---|---|
| Python | Server-side logic & API |
| MongoDB | User data & meal history persistence |
| Google Vision API | AI-based food image recognition |
| Google AI APIs | Nutritional analysis & calorie estimation |

---

## ✦ Getting Started

### Prerequisites

Ensure the following are installed and configured before running the project:

- [Node.js](https://nodejs.org/) `v18+`
- [Python](https://www.python.org/) `v3.9+`
- [MongoDB](https://www.mongodb.com/) (running locally on default port `27017`)
- A valid **Google API Key** with Vision / Gemini AI access enabled

---

### 1 · Clone the Repository

```bash
git clone https://github.com/Kris-Zar/NutriTrack-PRO.git
cd NutriTrack-PRO
```

---

### 2 · Backend Setup

```bash
# Navigate to the backend folder
cd backend

# Create a virtual environment (recommended)
python -m venv venv
source venv/bin/activate        # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Set up your environment variables
cp .env.example .env
```

Open `.env` and fill in your credentials:

```env
GOOGLE_API_KEY=your_google_api_key_here
MONGO_URI=mongodb://localhost:27017/nutritrack
```

```bash
# Start the backend server
python app.py
```

The API will be running at `http://localhost:5000` (or your configured port).

---

### 3 · Frontend Setup

```bash
# In a new terminal, navigate to the frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ✦ Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | ✅ Yes | Google Vision / AI API key for food analysis |
| `MONGO_URI` | ✅ Yes | MongoDB connection string |
| `PORT` | Optional | Backend server port (default: `5000`) |

> ⚠️ **Never commit your `.env` file.** It is listed in `.gitignore` by default.

---

## ✦ Known Limitations

- **Image analysis** requires a valid Google API key — requests will fail without it
- **Profile saving** requires a running MongoDB instance
- Currently designed for local development; cloud deployment requires additional configuration

---

## ✦ Roadmap

- [ ] Barcode scanning for packaged foods
- [ ] Weekly nutrition reports & charts
- [ ] Mobile-responsive PWA
- [ ] OAuth authentication (Google / GitHub)
- [ ] Dietary goal-setting & alerts
- [ ] Recipe calorie estimator

---

## ✦ License

This project is open source. Feel free to explore and learn from the code — attribution is appreciated if you build on it.

---

<div align="center">

<br/>

Built with 🧠 + 🥦 by **Parth Saxena**

<br/>

*Track smarter. Eat better.*

<br/>

⭐ *Found this useful? Leave a star!*

</div>
