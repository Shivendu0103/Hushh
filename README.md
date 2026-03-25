# 🌐 Hushh - The Ultimate Vibe-Driven Social Ecosystem

<div align="center">

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen)](https://try-hushh.vercel.app)
[![Backend API](https://img.shields.io/badge/Backend-API-blue)](https://hushh-backend.onrender.com)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Firebase](https://img.shields.io/badge/Auth-Firebase-orange)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-blue)](https://cloudinary.com/)

*Vibe. Connect. Glow. - A high-energy, chaos-powered social platform built for the next generation.*

[Live Demo](https://try-hushh.vercel.app) · [Report Bug](https://github.com/Shivendu0103/Hushh/issues) · [Request Feature](https://github.com/Shivendu0103/Hushh/issues)

</div>

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Deployment](#deployment)
- [API Documentation](#api-documentation)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## 🚀 About

**Hushh** is a next-generation social ecosystem that prioritizes energy, vibes, and real-time connection. Moving beyond traditional messaging, Hushh introduces **Chaos Mode**—a global UI transformation that turns your feed into a high-octane visual experience. Powered by Firebase for multi-provider authentication and Cloudinary for seamless media sharing, Hushh is where your digital aura comes to life.

### Why Hushh?

- 🌀 **Chaos Mode**: Transform your entire UI with neon gradients and physics-based interactions.
- 🎵 **Personalized Theme Songs**: Express your identity with profile-specific theme music.
- 🔐 **Multi-Auth Sync**: Seamless login via Google, GitHub, or Email (Firebase + JWT).
- 🏆 **Matrix Gamification**: Level up your profile, earn XP, and unlock unique achievements.
- 📸 **Storytelling 2.0**: Share 24h temporary stories and rich multimedia posts.
- 🫧 **Interactive WebGL**: Fluid liquid backgrounds, meteor showers, and particle dynamics.
- ⚡ **Real-time Reality**: Instant messaging and presence tracking via Socket.io.

---

## ✨ Features

### Social & Interactive
- ✅ **Stories**: Share temporary 24h updates with image/video support.
- ✅ **Vibe Status**: Custom status ("Vibing", "Grinding") with colors and emojis.
- ✅ **Theme Songs**: Personalized profile music for better self-expression.
- ✅ **Chaos Mode**: Global toggle for a high-energy UI transformation.
- ✅ **Connection System**: Connect with "Vibers" instead of just "Followers".
- ✅ **Mood-based Posts**: Post with specific vibes and contextual emojis.
- ✅ **Gamification**: XP tracking, Leveling systems, and Achievement showcases.

### Messaging & Connectivity
- ✅ **Real-time Chat**: One-on-one messaging with Socket.io.
- ✅ **Media Sharing**: Multi-media posts (up to 5 files) and messaging support.
- ✅ **Presence Tracking**: Online/offline indicators and last seen timestamps.
- ✅ **Smart Notifications**: Instant alerts for likes, comments, and connections.
- ✅ **Typing Indicators**: Real-time feedback during conversations.

### Technical & Security
- 🔒 **Firebase Integration**: Secure social login (Google/GitHub) and Auth state sync.
- ☁️ **Cloudinary**: Optimized media management and CDN-based delivery.
- 🌪️ **WebGL Visuals**: Interactive Ballpit physics, Meteor effects, and Liquid backgrounds.
- 🔄 **State Sync**: Multi-provider authentication synchronized with custom JWT backend.
- 🌐 **RESTful Architecture**: Clean, scalable API endpoints for all core features.

---

## 🛠️ Tech Stack

### Frontend
- **React.js** - UI library for modular interfaces.
- **Three.js & OGL** - High-performance WebGL and physics-based visuals.
- **Framer Motion** - Premium animations and transitions.
- **React Query** - Powerful state management and data fetching.
- **Tailwind CSS** - Utility-first styling for modern UI.
- **Firebase SDK** - Social authentication and real-time auth state.
- **Socket.io Client** - Bi-directional real-time communication.
- **Lucide React** - Modern, consistent iconography.

### Backend
- **Node.js & Express** - Scalable backend architecture.
- **Firebase Admin SDK** - Token verification and auth synchronization.
- **Cloudinary SDK** - Media processing and storage.
- **Socket.io** - Real-time event handling.
- **MongoDB & Mongoose** - Robust NoSQL data modeling.
- **JWT** - Secure session management.
- **bcrypt** - Industry-standard password hashing.
- **Express Validator** - Robust input sanitization.

### DevOps & Deployment
- **Vercel** - Frontend hosting
- **Render** - Backend hosting
- **MongoDB Atlas** - Cloud database
- **GitHub** - Version control and CI/CD

---

## 🏗️ Architecture

```
┌─────────────────┐      ┌──────────────────┐      ┌─────────────────┐
│    Frontend     │      │     Backend      │      │    Database     │
│    (Vercel)     │◄────►│     (Render)     │◄────►│  MongoDB Atlas  │
│                 │ HTTPS│                  │ Mongo│                 │
│ - React.js      │      │ - Node.js        │ URI  │ - Users         │
│ - Socket.io     │◄────►│ - Express.js     │      │ - Messages      │
│ - Tailwind CSS  │WS    │ - Socket.io      │      │ - Posts         │
└─────────────────┘      └──────────────────┘      └─────────────────┘
```

---

## 🚦 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas account)
- **Firebase Project** (for authentication)
- **Cloudinary Account** (for media uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Shivendu0103/Hushh.git
   cd Hushh
   ```

2. **Install Backend Dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install Frontend Dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### Environment Variables

#### Backend `.env`
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173
FIREBASE_SERVICE_ACCOUNT_JSON=your_service_account_path
```

#### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=your_key
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset
```

---

## 💻 Usage

### Development Mode

1. **Start Backend Server**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm run dev
   ```

---

## 📚 API Documentation

### Authentication Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new local user |
| POST | `/api/auth/login` | Login local user |
| POST | `/api/auth/firebase` | Register/Login via Firebase token (Sync) |
| POST | `/api/auth/logout` | Logout user |
| GET | `/api/auth/me` | Get current authenticated user |

### User & Connection Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | Get all users |
| GET | `/api/users/:id` | Get comprehensive user profile |
| GET | `/api/users/:id/stats` | Get user activity stats |
| PATCH | `/api/users/profile` | Update user profile/vibe/theme-song |
| POST | `/api/users/connect/:id` | Send connection request |
| GET | `/api/users/search?q=` | High-performance user search |

### Story Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/stories` | Get active stories (24h) |
| POST | `/api/stories` | Create new story |
| POST | `/api/stories/:id/view` | Mark story as viewed |
| DELETE | `/api/stories/:id` | Delete specific story |

### Media & Post Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/upload/post` | Upload multi-media for posts |
| POST | `/api/upload/story` | Upload media for stories |
| POST | `/api/upload/avatar` | Upload user profile avatar |
| GET | `/api/posts` | Get global post feed (Paginated) |
| POST | `/api/posts` | Create post with vibe & media |
| POST | `/api/posts/:id/like` | Like/Unlike post (XP Awarded) |

---

## 🌐 Socket.io Events

### Unified Real-time Engine

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `new_post` | S → C | `{ post }` | Broadcast new post to ecosystem |
| `post_updated` | S → C | `{ postId, type, likes... }` | Real-time like/comment updates |
| `new_notification` | S → C | `{ notification }` | Direct alert for user activity |
| `send_message` | C → S | `{ recipientId, content }` | Send encrypted message |
| `typing_start` | C → S | `{ recipientId }` | Trigger typing state |
| `user_online` | S → C | `{ userId }` | Presence tracking |

---

## 🗂️ Project Structure

```
Hushh/
├── backend/
│   ├── src/
│   │   ├── config/             # DB, Cloudinary, Firebase Admin
│   │   ├── controllers/        # Vibe, Post, Story, Auth Logic
│   │   ├── models/             # User (XP/Vibe), Post, Story, Message
│   │   ├── routes/             # Stories, Uploads, Connections
│   │   └── middleware/         # JWT & Firebase Verification
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/           # Firebase Social Logins
│   │   │   ├── stories/        # Story Bar & Viewer
│   │   │   ├── ui/             # Ballpit, Meteors, Liquid UI
│   │   │   ├── gamification/   # Achievement Showcase
│   │   │   └── profile/        # Header with Theme Song
│   │   ├── context/            # Auth (Firebase Sync), Socket
│   │   ├── pages/              # Landing (Glass), Profile (XP)
│   │   └── assets/             # Global Animations
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

---

## 🔮 Future Enhancements

- [x] Social login (Firebase)
- [x] Multi-media support (Cloudinary)
- [x] Gamification system (XP/Levels)
- [x] Real-time storytelling (Stories)
- [ ] Group chat functionality
- [ ] Message end-to-end encryption
- [ ] Push notifications (PWA)
- [ ] Voice and video calling (WebRTC)
- [ ] Global "Vibe" map

---

## 👨‍💻 Author

**Shivendu Sinha**

- GitHub: [@Shivendu0103](https://github.com/Shivendu0103)
- LinkedIn: [Shivendu Sinha](https://www.linkedin.com/in/shivendu0103/)
- Email: shivendu0103@gmail.com

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Shivendu0103/Hushh?style=social)
![GitHub forks](https://img.shields.io/github/forks/Shivendu0103/Hushh?style=social)

---

<div align="center">

Made with ❤️ by [Shivendu Sinha](https://github.com/Shivendu0103)

**[⬆ back to top](#-hushh---the-ultimate-vibe-driven-social-ecosystem)**

</div>
