# SB Stocks - Stock Trading Simulation Platform

![SB Stocks Demo](https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop)

SB Stocks is a full-stack web application designed for stock market enthusiasts who want to practice and improve their trading skills without any financial risk. It provides a realistic paper trading experience with a modern, dynamic, and premium user interface.

## 🚀 Features

- **Paper Trading:** Start with $100,000 in virtual funds and practice buying/selling stocks.
- **Dynamic Dashboard:** Track your portfolio's performance, available cash, and current stock holdings in real-time.
- **Interactive Stock Market:** Search for US stock symbols and view interactive historical price trend charts.
- **Secure Authentication:** User registration and login powered by JWT and bcrypt encryption.
- **Modern UI/UX:** Built with Tailwind CSS featuring glassmorphism, responsive design, and smooth micro-animations.

## 🛠️ Technology Stack

- **Frontend:** React.js, Redux Toolkit, React Router v6, Tailwind CSS v4, Chart.js, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Currently configured with `mongodb-memory-server` for instant local testing without installation)
- **Authentication:** JSON Web Tokens (JWT)

## 💻 Running Locally

To run this project on your local machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/yaswanthhari/sb-stocks.git
cd sb-stocks
```

### 2. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
*(The backend will automatically spin up an in-memory database and run on `http://localhost:5000`)*

### 3. Start the Frontend Client
Open a new terminal window and run:
```bash
cd client
npm install
npm run dev
```
*(The frontend will be available at `http://localhost:5173`)*

## 🤝 Team Members
- Divya Seeli
- Sri Hasini Koppula
- Navya Sri

---
*Disclaimer: This is a simulation platform for educational purposes. Real-time market data API integration can be added for live production use.*
