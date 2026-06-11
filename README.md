# SkillShare

> Tinder for Skill Sharing — Discover, Match, Chat & Collaborate

## Project Structure

```
skillshare app/
├── SkillShare-backend/     # Node.js + Express + MongoDB API
└── SkillShare-frontend/    # React + TypeScript + Tailwind UI
```

## Quick Start

### 1. Backend Setup

```bash
cd SkillShare-backend
npm install
cp .env.example .env
# Fill in your .env values (MongoDB URI, JWT secret, etc.)
npm run dev
```

### 2. Frontend Setup

```bash
cd SkillShare-frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
```

### 3. Open `http://localhost:5173`

---

## Environment Variables

### Backend `.env`
| Variable | Description |
|----------|-------------|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret key for JWT tokens |
| `GOOGLE_CLIENT_ID` | Google OAuth App Client ID |
| `GOOGLE_CLIENT_SECRET` | Google OAuth App Client Secret |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret |
| `CLIENT_URL` | Frontend URL (default: http://localhost:5173) |

### Frontend `.env`
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |
| `VITE_SOCKET_URL` | Socket.io server URL |

---

## Features

### Phase 1 (MVP) ✅
- Email & Google OAuth authentication
- User profiles (name, avatar, skills, bio, location, experience)
- Tinder-style swipe deck (left/right)
- Match system (mutual right swipes)
- Real-time chat with Socket.io
- Friend requests (accept/reject)
- Push notifications

### Phase 2 🚧
- Video & voice calls (WebRTC)
- Screen sharing
- Skill session booking
- Ratings & reviews
- AI skill recommendations

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/register` | Register with email/password |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/google` | Google OAuth |
| GET | `/api/auth/me` | Get current user |
| GET | `/api/users/discover` | Get users to swipe |
| PUT | `/api/users/profile` | Update profile |
| POST | `/api/users/avatar` | Upload avatar |
| POST | `/api/swipe` | Swipe left/right |
| GET | `/api/matches` | Get all matches |
| GET | `/api/messages/:matchId` | Get chat messages |
| POST | `/api/messages/:matchId` | Send message |
| GET | `/api/friends` | Get friends list |
| POST | `/api/friends/request` | Send friend request |
| PUT | `/api/friends/request/:id` | Accept/reject request |
| GET | `/api/notifications` | Get notifications |

---

## Tech Stack

**Backend:** Node.js · Express · MongoDB/Mongoose · Socket.io · JWT · Passport · Cloudinary

**Frontend:** React 18 · TypeScript · Tailwind CSS · Framer Motion · React Query · Zustand · Socket.io Client
