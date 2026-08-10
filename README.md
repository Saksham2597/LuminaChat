# 🌟 LuminaChat

LuminaChat is a fast, responsive, and beautiful real-time chat application. It features a stunning **Soft Neumorphic** user interface with physics-based animations, allowing users to securely log in, view available spaces, and communicate in real-time.

## ✨ Features

- **Soft Neumorphism Design**: A premium, highly tactile UI featuring physical depth, dual-shadow extruded elements, and inset inputs.
- **Fluid Animations**: Page transitions, micro-interactions, and message entrance physics powered by Framer Motion.
- **Real-time Messaging**: Instant message delivery and live presence indicators using WebSockets.
- **Authentication**: Secure JWT-based login, registration, and encrypted passwords.
- **Space Management**: Create new chat rooms instantly, or click on "Available Spaces" from the dashboard to seamlessly join an existing conversation.

## 🚀 Tech Stack

### Frontend (Deployed on Vercel)
- **Framework**: [React](https://reactjs.org/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State & Routing**: React Router
- **Real-Time Client**: Socket.io-client
- **HTTP Client**: Axios

### Backend (Deployed on Render)
- **Server**: [Node.js](https://nodejs.org/) + [Express](https://expressjs.com/)
- **Real-Time Engine**: [Socket.io](https://socket.io/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Authentication**: JWT (JSON Web Tokens) & bcryptjs

## 📦 Project Structure

This repository is structured as a monorepo containing both the frontend and backend applications.

- `/frontend` - The Vite React frontend application.
- `/backend` - The Node.js Express & Socket.io server.

## 🛠️ Getting Started Locally

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
3. Set up frontend environment variables (Optional if backend is not on port 5000):
   Create a `.env` file in the `frontend/` directory:
   ```env
   VITE_API_URL="http://localhost:5000"
   ```
4. Start the Vite development server:
   ```bash
   npm run dev
   ```
5. Open your browser to the local URL provided by Vite (usually `http://localhost:5173`).

## 📄 License

This project is open-source and available under the ISC License.
