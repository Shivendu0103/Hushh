text
# 🌐 Hushh - Social networking platform
<div align="center">
  
[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://try-hushh.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue)](https://hushh-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Connect. Vibe. Glow. - A modern real-time messaging platform built with the MERN stack*

[Live Demo](https://try-hushh.vercel.app) · [Report Bug](https://github.com/Shivendu0103/Hushh/issues) · [Request Feature](https://github.com/Shivendu0103/Hushh/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Usage](#usage)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🚀 About

**Hushh** is a full-stack, real-time chat application that enables seamless communication between users. Built with the MERN stack (MongoDB, Express.js, React.js, Node.js) and powered by Socket.io for real-time bidirectional event-based communication, Hushh provides a modern, secure, and scalable messaging experience. We are adding more features soon.

### Why Hushh?

- ⚡ **Real-time messaging** with instant delivery
- 🔐 **Secure authentication** using JWT
- 📱 **Responsive design** optimized for all devices
- 💾 **Persistent chat history** stored in MongoDB
- 🟢 **User presence indicators** (online/offline status)
- 🎨 **Modern UI/UX** with Tailwind CSS

---

## ✨ Features

### Core Features
- ✅ User authentication (register, login, logout)
- ✅ Real-time one-on-one messaging
- ✅ Message status tracking (sent, delivered, read)
- ✅ Typing indicators
- ✅ Online/offline user status
- ✅ Last seen timestamps
- ✅ Message history persistence
- ✅ User profile management
- ✅ Responsive mobile-first design

### Technical Features
- 🔄 Real-time updates using Socket.io
- 🔒 JWT-based authentication
- 🗄️ MongoDB for data persistence
- 🌐 RESTful API architecture
- 🎯 CORS-enabled secure communication
- ⚙️ Error handling and validation
- 📊 Health check endpoints
- 🚀 Cloud deployment ready

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for building user interfaces
- **Vite** - Fast build tool and development server
- **Tailwind CSS** - Utility-first CSS framework
- **Socket.io Client** - Real-time communication
- **Axios** - HTTP client for API requests
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime environment
- **Express.js** - Web application framework
- **Socket.io** - Real-time bidirectional event-based communication
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub** - Version control and CI/CD

---

## 🏗️ Architecture

┌─────────────────┐ ┌──────────────────┐ ┌─────────────────┐
│ Frontend │ │ Backend │ │ Database │
│ (Vercel) │◄───────►│ (Render) │◄───────►│ MongoDB Atlas │
│ │ HTTPS │ │ Mongo │ │
│ - React.js │ │ - Node.js │ URI │ - Users │
│ - Socket.io │◄───────►│ - Express.js │ │ - Messages │
│ - Tailwind CSS │WebSocket│ - Socket.io │ │ - Posts │
└─────────────────┘ └──────────────────┘ └─────────────────┘

text

---

## 🚦 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Git**

### Installation

1. **Clone the repository**
git clone https://github.com/Shivendu0103/Hushh.git
cd Hushh

text

2. **Install Backend Dependencies**
cd backend
npm install

text

3. **Install Frontend Dependencies**
cd ../frontend
npm install

text

### Environment Variables

#### Backend `.env`
Create a `.env` file in the `backend` directory:

NODE_ENV=development
PORT=5000

MongoDB
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/hushh?retryWrites=true&w=majority

JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=30d

Frontend URL
FRONTEND_URL=http://localhost:3000

text

#### Frontend `.env`
Create a `.env` file in the `frontend` directory:

VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
VITE_APP_NAME=Hushh

text

---

## 💻 Usage

### Development Mode

1. **Start Backend Server**
cd backend
npm start

Server runs on http://localhost:5000
text

2. **Start Frontend Development Server**
cd frontend
npm run dev

App runs on http://localhost:5173
text

3. **Access the application**
- Open your browser and navigate to `http://localhost:5173`
- Register a new account or login
- Start chatting in real-time!

### Production Build

**Frontend:**
cd frontend
npm run build

text

**Backend:**
cd backend
npm start

text

---

## 🚀 Deployment

### Frontend Deployment (Vercel)

1. **Login to Vercel**
npm install -g vercel
vercel login

text

2. **Deploy**
cd frontend
vercel

text

3. **Set Environment Variables in Vercel Dashboard**
- Go to Project Settings → Environment Variables
- Add all `VITE_*` variables

### Backend Deployment (Render)

1. **Create a new Web Service on Render**
2. **Connect your GitHub repository**
3. **Configure:**
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
4. **Add Environment Variables** in Render Dashboard

### Database Setup (MongoDB Atlas)

1. **Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Add database user and whitelist IP addresses**
3. **Get connection string and add to backend `.env`**

---

## 📚 API Documentation

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current user |

### User Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get user by ID |
| PUT | `/api/users/:id` | Update user profile |
| GET | `/api/users/search?q=` | Search users |

### Message Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/messages/:userId` | Get conversation with user |
| POST | `/api/messages` | Send new message |
| PUT | `/api/messages/:id/read` | Mark message as read |
| DELETE | `/api/messages/:id` | Delete message |

### Health Check

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health status |

---

## 🌐 Socket.io Events

### Client to Server

| Event | Payload | Description |
|-------|---------|-------------|
| `user_join` | `{ userId }` | User connects and joins |
| `send_message` | `{ recipientId, senderId, content }` | Send message |
| `typing_start` | `{ recipientId, senderId }` | Start typing indicator |
| `typing_stop` | `{ recipientId, senderId }` | Stop typing indicator |
| `mark_message_read` | `{ messageId, userId }` | Mark message as read |

### Server to Client

| Event | Payload | Description |
|-------|---------|-------------|
| `new_message` | `{ message }` | Receive new message |
| `message_sent` | `{ messageId, status }` | Message sent confirmation |
| `user_online` | `{ userId }` | User came online |
| `user_offline` | `{ userId }` | User went offline |
| `user_typing` | `{ userId }` | User is typing |
| `message_read` | `{ messageId, readBy }` | Message read receipt |

---

## 📸 Screenshots

<!-- Add your screenshots here -->
Coming soon...

text

---

## 🗂️ Project Structure

Hushh/
├── backend/
│ ├── src/
│ │ ├── config/
│ │ │ └── db.js
│ │ ├── models/
│ │ │ ├── User.js
│ │ │ ├── Message.js
│ │ │ └── Post.js
│ │ ├── routes/
│ │ │ ├── auth.js
│ │ │ ├── users.js
│ │ │ ├── messages.js
│ │ │ └── posts.js
│ │ ├── middleware/
│ │ │ └── auth.js
│ │ └── controllers/
│ ├── server.js
│ ├── package.json
│ └── .env
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── pages/
│ │ ├── context/
│ │ ├── utils/
│ │ ├── App.jsx
│ │ └── main.jsx
│ ├── public/
│ ├── package.json
│ ├── vite.config.js
│ └── .env
└── README.md

text

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 🐛 Known Issues

- Message icon visibility on some mobile devices
- First connection delay on Render free tier (cold start)

See the [open issues](https://github.com/Shivendu0103/Hushh/issues) for a full list of known issues.

---

## 🔮 Future Enhancements

- [ ] Group chat functionality
- [ ] File and image sharing
- [ ] Voice and video calling
- [ ] Message encryption
- [ ] Push notifications
- [ ] Message search
- [ ] Emoji reactions
- [ ] Dark mode
- [ ] Read receipts
- [ ] Message forwarding
- [ ] User blocking

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 👨‍💻 Author

**Shivendu Sinha**

- GitHub: [@Shivendu0103](https://github.com/Shivendu0103)
- LinkedIn: [Shivendu Sinha](https://www.linkedin.com/in/shivendu0103/)
- Email: shivendu0103@gmail.com

---

## 🙏 Acknowledgments

- [Socket.io Documentation](https://socket.io/docs/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [React Documentation](https://react.dev/)
- [Express.js Documentation](https://expressjs.com/)
- [Tailwind CSS](https://tailwindcss.com/)

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Shivendu0103/Hushh?style=social)
![GitHub forks](https://img.shields.io/github/forks/Shivendu0103/Hushh?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Shivendu0103/Hushh?style=social)

---

<div align="center">

Made with ❤️ by [Shivendu Sinha](https://github.com/Shivendu0103)

**[⬆ back to top](#-hushh---real-time-chat-platform)**

</div>
