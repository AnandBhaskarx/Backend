# 🔐 Credential Saver – Full Stack Web Application

## 📌 Project Overview

This project is a secure and scalable full-stack web application designed to **store and manage website credentials**. Built using modern technologies like **Node.js**, **Express.js**, **MongoDB**, and **React**, it offers a seamless user experience with real-time feedback and responsive design.

The application allows users to:
- Save website credentials (URL, username, password)
- Retrieve and manage saved credentials
- Experience smooth navigation and feedback using React Toastify
- Enjoy a clean and responsive UI powered by Tailwind CSS

---

## 🛠️ Tech Stack

| Layer        | Technologies Used                                                                 |
|--------------|------------------------------------------------------------------------------------|
| **Frontend** | React, Tailwind CSS, React Toastify, Axios, React Router                          |
| **Backend**  | Node.js, Express.js, MongoDB, Mongoose, dotenv, CORS                              |
| **Deployment** | GitHub, Vercel (Frontend), Render or Railway (Backend)                          |
| **Utilities** | LocalStorage, Environment Variables, Git for version control                     |

---

## 🧩 Features

- 🔐 **Credential Storage**: Save website login details securely
- 📦 **MongoDB Integration**: Persistent storage with Mongoose schemas
- 🚀 **RESTful APIs**: Modular and scalable backend routes
- 🧭 **SPA Navigation**: React Router for smooth client-side routing
- 🎨 **Responsive UI**: Tailwind CSS for mobile-first design
- 🔄 **Real-Time Feedback**: Toast notifications for user actions
- 🧪 **Error Handling**: Robust backend validation and frontend alerts
- 🔧 **Environment Config**: Secure API keys and DB credentials via `.env`

---

## 🧠 Learning Outcomes

This project helped solidify concepts in:
- Full-stack architecture and modular design
- API creation and integration with frontend
- State management and localStorage usage
- Deployment workflows and environment setup
- Debugging CORS, routing, and database connectivity

---

## 🚀 Deployment Instructions

1. **Clone the repo**  
   `git clone https://github.com/your-username/credential-saver`

2. **Install dependencies**  
   ```bash
   cd backend
   npm install

   cd frontend
   npm install
   ```

3. **Set up environment variables**  
   Create a `.env` file in the backend folder with:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. **Run the application**  
   ```bash
   cd backend
   npm start

   cd frontend
   npm run dev
   ```

---
