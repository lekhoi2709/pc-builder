# PC Builder

<div align="center">
  <p align="center">
    <a href="https://opensource.org/licenses/MIT"><img alt="MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
    <a href="https://golang.org"><img alt="Go" src="https://img.shields.io/badge/Go-1.24-00ADD8?logo=go" /></a>
    <a href="https://react.dev"><img alt="React" src="https://img.shields.io/badge/React-19-61DAFB?logo=react" /></a>
    <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql" /></a>
    <a href="https://www.docker.com"><img alt="Docker Compose" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker" /></a>
  </p>

<p>A full-stack application for browsing and filtering PC components with an intuitive, modern interface.</p>

<p align="center">
<a href="https://pc-builder-frontend-orcin.vercel.app">Live Demo</a>
•
<a href="#">Documentation</a>
•
<a href="#">Report Bug</a>
•
<a href="#">Request Feature</a>
</p>

</div>

---

## Overview

PC Builder is a comprehensive component browsing platform that allows users to search, filter, and select computer components efficiently. Built with modern technologies for performance, scalability, and excellent user experience.

---

## Quick Start

### Prerequisites

- **Docker Desktop** (for backend)
- **Node.js** v18+ (for frontend development)
- **Git**

### Installation

#### 1. Start Backend

```bash
cd apps/backend
cp .env.example .env
# Edit .env with your configuration
docker-compose up -d
```

#### 2. Start Frontend

```bash
cd apps/frontend
npm install
echo "VITE_API_URL=http://localhost:8080/api/" > .env
npm run dev
```

#### 3. Access Application

| Service      | URL                          |
| ------------ | ---------------------------- |
| Frontend     | http://localhost:5173        |
| Backend API  | http://localhost:8080/api/v1 |
| Health Check | http://localhost:8080/health |

---

## Features

| Feature                | Description                                          |
| ---------------------- | ---------------------------------------------------- |
| **Advanced Filtering** | Filter by category, brand, price, and specifications |
| **Dark/Light Theme**   | Adaptive theme switching                             |
| **Authentication**     | JWT-based auth with role-based access control        |
| **Responsive Design**  | Optimized for desktop, and mobile                    |

---

## Tech Stack

| Layer        | Technologies                                         |
| ------------ | ---------------------------------------------------- |
| **Frontend** | React 19, TypeScript, TailwindCSS, Vite, React Query |
| **Backend**  | Go 1.24, Gin, GORM, PostgreSQL                       |
| **DevOps**   | Docker, Docker Compose                               |

---

## Project Structure

```bash
pc-builder/
├── apps/
│   ├── backend/     # Go + Gin API
│   └── frontend/    # React + TypeScript
└── README.md
```

---

## Development Guide

### Frontend Development

```bash
cd apps/frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Code quality
npm run lint
npm run format
```

### Backend Development

```bash
cd apps/backend

# Start services with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f backend

# Stop services
docker-compose down
```

---

## Environment Variables

### Backend (.env)

```env
# Server Configuration
PORT=8080
ENVIRONMENT=development

# Database Configuration
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_secure_password
DB_NAME=pc_builder
DB_SSLMODE=disable

# Security
JWT_SECRET=your_jwt_secret_key
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080/api/
```

---

## Development Roadmap

- [x] Basic CRUD operations
- [x] Advanced filtering system
- [x] User authentication & authorization
- [ ] Component comparison tool
- [ ] User reviews & ratings system
- [ ] Price tracking & notifications
- [ ] Mobile application
- [ ] Real-time inventory updates
- [ ] AI-powered recommendations

---

## License

MIT License - see LICENSE file for details

---

<div align="center">

Made with ❤️ by [Le Dinh Khoi](https://github.com/lekhoi2709)
For detailed documentation, see **[Backend README](apps/backend/README.md)** and **[Frontend README](apps/frontend/README.md)**

</div>
