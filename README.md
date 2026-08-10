# 🌟 LuminaChat

LuminaChat is a fast, responsive, and beautiful real-time chat application. It provides an intuitive interface for users to register, log in, create chat rooms, and communicate in real-time.

## 🚀 Tech Stack

### Frontend
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **State Management & Routing**: React Router
- **Real-Time Communication**: Socket.io-client
- **HTTP Client**: Axios

### Backend
- **Server**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Real-Time Communication**: [Socket.io](https://socket.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

## 📦 Project Structure

This repository is structured as a monorepo containing both the frontend and backend applications.

- `/frontend` - The Vite React frontend application.
- `/backend` - The Node.js Express & Socket.io server.

## 🛠️ Getting Started

### Prerequisites
- Node.js installed
- PostgreSQL database running locally or remotely

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables:
   Create a `.env` file in the `backend/` directory and add your connection strings:
   ```env
   DATABASE_URL="postgresql://username:password@localhost:5432/luminachat"
   JWT_SECRET="your_jwt_secret_key"
   PORT=5000
   ```
4. Run database migrations and generate Prisma client:
   ```bash
   npx prisma generate
   npx prisma db push
   ```
5. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).

## ✨ Features

- **Real-time Messaging**: Instant message delivery using WebSockets.
- **Authentication**: Secure JWT-based login and registration.
- **Room Management**: Create and join specific chat rooms.
- **Modern UI**: Clean and responsive design powered by Tailwind CSS.

## 📄 License

This project is open-source and available under the ISC License.
