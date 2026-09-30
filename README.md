<div align="center">

# 🥗 NutriTrack PRO

### A fullstack nutrition tracking web app — log meals, hit your macros, stay consistent.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-nutritrack--frontend--behf.onrender.com-4CAF50?style=for-the-badge)](https://nutritrack-frontend-behf.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Kris--Zar%2FNutriTrack--PRO-181717?style=for-the-badge&logo=github)](https://github.com/Kris-Zar/NutriTrack-PRO)

</div>

---

## 🌐 Demo

> **Try it live →** [https://nutritrack-frontend-behf.onrender.com](https://nutritrack-frontend-behf.onrender.com)

> ⚠️ Hosted on Render's free tier — the server may take 30–60 seconds to wake up on first load. Also this is a Demo Link only for full capability testing and usage clone the local setup.

---

## 📖 About

**NutriTrack PRO** is a full-stack nutrition tracking application that helps users monitor their daily calorie intake and macronutrients. Users can log meals, set personal nutrition goals, and review their intake history — all through a clean, responsive web interface.

---

## ✨ Features

- 🔐 **User Authentication** — Register and log in securely
- 🍽️ **Meal Logging** — Search and add foods with calorie and macro data
- 📊 **Daily Dashboard** — Visual overview of calories, protein, carbs, and fat
- 🎯 **Goal Setting** — Set and track personal nutrition targets
- 📅 **History View** — Review past meals and progress over time
- 📱 **Responsive Design** — Works on desktop and mobile

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React | UI framework |
| React Router | Client-side routing |
| Axios | HTTP requests |
| CSS / Tailwind | Styling |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| MongoDB + Mongoose | Database & ODM |
| JWT | Authentication |
| bcrypt | Password hashing |

### Deployment
| Service | Usage |
|---------|-------|
| Render | Frontend & Backend hosting |
| MongoDB Atlas | Cloud database |

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or yarn
- MongoDB instance (local or Atlas)

### 1. Clone the repository

```bash
git clone https://github.com/Kris-Zar/NutriTrack-PRO.git
cd NutriTrack-PRO
```

### 2. Set up the Backend

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the server:

```bash
npm run dev
```

### 3. Set up the Frontend

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend` folder:

```env
REACT_APP_API_URL=http://localhost:5000
```

Start the app:

```bash
npm start
```

The app will be running at `http://localhost:3000`.

---

## 📁 Project Structure

```
NutriTrack-PRO/
├── frontend/           # React app
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   └── App.js
│   └── package.json
│
├── backend/            # Express API
│   ├── routes/
│   ├── models/
│   ├── middleware/
│   └── server.js
│
└── README.md
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/Kris-Zar">Kris-Zar</a>
</div>
