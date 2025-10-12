# PC Builder Service

A comprehensive PC component management service built with Go, Gin, GORM, and PostgreSQL. This backend service provides APIs for managing PC components and will serve as the foundation for a complete PC building application.

## 🏗️ Architecture

- **Backend**: Go with Gin web framework
- **Database**: PostgreSQL with GORM ORM
- **Containerization**: Docker & Docker Compose
- **Frontend**: _Coming Soon_

## 🚀 Features

### Current Features

- ✅ Component CRUD operations
- ✅ RESTful API endpoints
- ✅ PostgreSQL database integration
- ✅ Docker containerization
- ✅ Health check endpoint
- ✅ Structured logging
- ✅ Database auto-migration

## 🛠️ Installation & Setup

### Using Docker

1. **Clone the repository**

   ```bash
   git clone https://github.com/lekhoi2709/pc-builder.git
   cd pc-builder
   ```

2. **Create environment file**

   ```bash
   cp .env.example .env
   ```

   Configure your `.env` file:

   ```env
   # Database Configuration
   DB_HOST=db
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   DB_NAME=pc_builder
   DB_SSLMODE=disable

   # Application Configuration
   PORT=8080
   JWT_SECRET=your_jwt_secret
   ENVIRONMENT=production
   ```

3. **Start the application**

   ```bash
   docker-compose up --build
   ```

4. **Verify the installation**

   ```bash
   curl http://localhost:8080/health
   # Expected: {"status":"ok"}
   ```

## 🐳 Docker Configuration

### Services

- **backend**: Go application (Port: 8080)
- **db**: PostgreSQL database (Port: 5432)

### Volumes

- `postgres_data`: Persistent PostgreSQL data storage

### Networks

- `pc_builder_network`: Bridge network for service communication

## 🔧 Development

### Project Structure

```text
apps/backend/
├── api/
│   ├── controllers/        # Request handlers
│   │   ├── admin_controller.go
│   │   ├── auth_controller.go
│   │   ├── components_controller.go
│   │   └── filters_controller.go
│   ├── middlewares/        # Authentication, CORS, security
│   │   ├── check_role.go
│   │   ├── jwt_middleware.go
│   │   └── security.go
│   ├── models/             # Database models
│   │   ├── components.go
│   │   └── user.go
│   ├── repositories/       # Database queries
│   │   ├── components_repository.go
│   │   └── filters_repository.go
│   └── routes/             # Route definitions
│       └── router.go
├── config/                 # Configuration loader
│   └── load_env.go
├── db/                     # Database initialization
│   └── db.go
├── utils/                  # Helper functions
│   ├── error.go
│   ├── generate_jwt.go
│   ├── hash_password.go
│   └── response.go
├── main.go                 # Application entry point
├── Dockerfile              # Docker build instructions
├── docker-compose.yml      # Docker services configuration
├── .env.example            # Environment variables template
├── .env                    # Your environment variables
├── go.mod                  # Go dependencies
└── README.md               # This file
```

### Environment Variables

| Variable          | Description       | Default                 |
| ----------------- | ----------------- | ----------------------- |
| `DB_HOST`         | Database host     | `db`                    |
| `DB_PORT`         | Database port     | `5432`                  |
| `DB_USER`         | Database user     | `postgres`              |
| `DB_PASSWORD`     | Database password | _required_              |
| `DB_NAME`         | Database name     | `pc_builder`            |
| `DB_SSLMODE`      | SSL mode          | `disable`               |
| `PORT`            | Application port  | `8080`                  |
| `JWT_SECRET`      | JWT secret key    | _required_              |
| `ENVIRONMENT`     | Environment       | `development`           |
| `ALLOWED_ORIGINS` | Allowed Origins   | `http://localhost:5173` |

## 📋 Roadmap

### Phase 1: Backend Foundation ✅

- [x] Basic CRUD operations
- [x] Database setup
- [x] Docker configuration
- [x] API endpoints

### Phase 2: Enhanced Backend (In Progress)

- [x] User authentication
- [x] Component relationships
- [x] Advanced search & filtering
- [x] Data validation & error handling
- [ ] API documentation

### Phase 3: Advanced Features

- [ ] Component compatibility checker
- [ ] Price tracking & alerts
- [ ] User reviews & ratings
- [ ] Build sharing & community features

### Phase 4: Production Ready

- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Monitoring & logging
- [ ] CI/CD pipeline

## 👥 Authors

- **GitHub:** [@lekhoi2709](https://github.com/lekhoi2709) - Le Dinh Khoi

## 🙏 Acknowledgments

- Gin Web Framework
- GORM ORM
- PostgreSQL
- Docker Community
