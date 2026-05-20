<h1 align="center">✨ Full-Stack Chat App with Auth & Emails ✨</h1>

<img width="3839" height="1927" alt="image" src="https://github.com/user-attachments/assets/212d5eea-3a0a-48db-8d18-dc0a85e33bb7" />


Highlights:

- 🔐 Custom JWT Authentication (no 3rd-party auth)
- ⚡ Real-time Messaging via Socket.io
- 🟢 Online/Offline Presence Indicators
- 🔔 Notification & Typing Sounds (with toggle)
- 📨 Welcome Emails on Signup (Resend)
- 🗂️ Image Uploads (Cloudinary)
- 🧰 REST API with Node.js & Express
- 🧱 MongoDB for Data Persistence
- 🚦 API Rate-Limiting powered by Arcjet
- 🎨 Beautiful UI with React, Tailwind CSS & DaisyUI
- 🧠 Zustand for State Management
- 🧑‍💻 Git & GitHub Workflow (branches, PRs, merges)
- 🚀 Easy Deployment (free-tier friendly with Sevalla)

---

## 🧪 .env Setup

### Backend (`/backend`)

```bash
PORT=3000
MONGO_URI=your_mongo_uri_here

NODE_ENV=development

JWT_SECRET=your_jwt_secret

RESEND_API_KEY=your_resend_api_key
EMAIL_FROM=your_email_from_address
EMAIL_FROM_NAME=your_email_from_name

CLIENT_URL=http://localhost:5173

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

ARCJET_KEY=your_arcjet_key
ARCJET_ENV=development
```

---

## 🔧 Run the Backend

```bash
cd backend
npm install
npm run dev
```

## 💻 Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🐳 Docker Deployment

The app is fully dockerized with a multi-stage build that serves both the frontend and backend from a single container.

### 1. Build the Docker Image
From the root of the project, run:
```bash
docker build -t chat-karo .
```

### 2. Run the Docker Container
Make sure to provide your `.env` file variables to the container:
```bash
docker run -p 5000:5000 --env-file backend/.env chat-karo
```
*Note: Make sure `NODE_ENV=production` is set in your environment if you want the backend to serve the compiled frontend.*
