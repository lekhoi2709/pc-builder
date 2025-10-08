# 🖥️ PC Builder

A full-stack application for browsing and filtering PC components. Built with Go, React, PostgreSQL, and Docker.

## 📋 Quick Overview

PC Builder helps users search, filter, and select computer components with an intuitive interface.

**Frontend**: React + TypeScript + TailwindCSS
**Backend**: Go + Gin + PostgreSQL
**Deployment**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Docker Desktop (for backend only)
- Node.js v18+ (for frontend)
- Git

### 1. Start Backend (Docker)

```bash
cd apps/backend
cp .env.example .env
# Edit .env with your passwords
docker-compose up -d
```

### 2. Start Frontend (Local)

```bash
cd apps/frontend
npm install
echo "VITE_API_URL=http://localhost:8080/api/" > .env
npm run dev
```

### 3. Access

- Frontend: <http://localhost:5173>
- Backend API: <http://localhost:8080/api/v1>
- Health check: <http://localhost:8080/health>

## ✨ Features

- 🔍 Advanced filtering (category, brand, price, specs)
- 💰 Multi-currency support (VND, USD)
- 🌍 Multi-language (Vietnamese, English)
- 🎨 Dark/Light theme
- 🔐 JWT authentication & role-based access
- 📱 Fully responsive design
- ⚡ Optimized performance with caching

## 📁 Project Structure

```text
pc-builder/
├── apps/
│   ├── backend/     # Go + Gin API
│   └── frontend/    # React + TypeScript
└── README.md
```

## 🛠️ Tech Stack

| Layer        | Technologies                                         |
| ------------ | ---------------------------------------------------- |
| **Frontend** | React 19, TypeScript, TailwindCSS, Vite, React Query |
| **Backend**  | Go 1.24, Gin, GORM, PostgreSQL                       |
| **DevOps**   | Docker, Docker Compose                               |

## 📖 Development

### Backend (Docker)

```bash
cd apps/backend
docker-compose up -d
docker-compose logs -f backend
```

### Frontend (Local)

```bash
cd apps/frontend
npm run dev
```

### Code Quality

```bash
# Frontend
npm run lint
npm run format
```

## 🚢 Environment Variables

### Backend (.env)

```env
PORT=8080
ENVIRONMENT=development
DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=pc_builder
DB_SSLMODE=disable
JWT_SECRET=your_secret
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:8080/api/
```

## 📈 Roadmap

- [x] Basic CRUD operations
- [x] Advanced filtering
- [x] Authentication
- [ ] Component comparison tool
- [ ] User reviews & ratings
- [ ] Price tracking
- [ ] Mobile app

## 👤 Author

- **GitHub:** [@lekhoi2709](https://github.com/lekhoi2709) - Le Dinh Khoi

## 📄 License

MIT License - see LICENSE file for details

---

**For detailed documentation, see [Backend README](apps/backend/README.md) and [Frontend README](apps/frontend/README.md)**
