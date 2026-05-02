# MERN Social Media Platform

A full-stack, production-ready social media platform built with the MERN stack (MongoDB, Express, React, Node.js). This project features real-time chat, rich text post creation, image uploads, interactions (likes and comments), and a responsive user interface.

## 🚀 Features

- **Authentication**: Secure user registration and login using JWT and HttpOnly cookies.
- **Real-Time Chat**: Live messaging between users powered by Socket.io and Redis.
- **Post Management**: Create, edit, and view posts using a rich text editor (Tiptap).
- **Interactions**: Like and comment on user posts.
- **Media Uploads**: Image handling and storage using Cloudinary and Multer.
- **Responsive UI**: Beautiful, modern interface designed with Tailwind CSS and React components.
- **State Management**: Centralized application state using Redux Toolkit.
- **Containerization**: Fully Dockerized for seamless development and production deployments using Docker Compose and Nginx.

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **State Management**: Redux Toolkit
- **Rich Text Editor**: Tiptap
- **Real-Time**: Socket.io-client
- **HTTP Client**: Axios

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: MongoDB (Mongoose)
- **Caching & Pub/Sub**: Redis
- **Real-Time**: Socket.io
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **Media Storage**: Cloudinary

### DevOps
- **Containerization**: Docker & Docker Compose
- **Web Server / Reverse Proxy**: Nginx

## 📁 Project Structure

```text
.
├── backend/            # Express application, API routes, controllers, and models
│   ├── src/            # Application source code
│   ├── Dockerfile      # Backend Docker configuration
│   └── package.json    # Backend dependencies
├── frontend/           # React application
│   ├── src/            # UI components, pages, Redux slices, and API integrations
│   ├── Dockerfile      # Frontend Docker configuration
│   └── package.json    # Frontend dependencies
├── nginx/              # Nginx configuration for production reverse proxy
└── docker-compose.yml  # Multi-container orchestration (MongoDB, Redis, Backend, Nginx)
```

## ⚙️ Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- [Docker](https://www.docker.com/) & Docker Compose
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- [Redis](https://redis.io/)
- Cloudinary Account (for image uploads)

### Local Development Setup (Without Docker)

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd MERN-SocialMediaProject
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory based on `.env.sample`:
   ```env
   PORT=4000
   CORS_ORIGIN=http://localhost:5173
   DB_NAME=mernsocialmedia
   MONGO_URI=mongodb://localhost:27017
   ACCESS_TOKEN_SECRET=<your_secret>
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=<your_refresh_secret>
   REFRESH_TOKEN_EXPIRY=10d
   CLOUDINARY_CLOUD_NAME=<your_cloudinary_name>
   CLOUDINARY_API_KEY=<your_cloudinary_key>
   CLOUDINARY_API_SECRET=<your_cloudinary_secret>
   REDIS_URL=redis://localhost:6379
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   ```bash
   cd ../frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory:
   ```env
   VITE_BACKEND_URL=http://localhost:4000/api/v1
   VITE_SOCKET=http://localhost:4000
   ```
   Start the development server:
   ```bash
   npm run dev
   ```

### Running with Docker (Production/Dev mode)

The project includes a `docker-compose.yml` for easy setup.

1. Ensure your `.env` files are configured in both `backend` and `frontend` directories.
2. From the root directory, run:
   ```bash
   docker-compose up --build -d
   ```
3. This will spin up MongoDB, Redis, the Node.js backend, and Nginx. The application will be accessible based on your Nginx configuration (usually port 80).

## 📄 License

This project is licensed under the [ISC License](LICENSE).
