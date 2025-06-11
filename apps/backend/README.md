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

### Planned Features

- 🔄 User authentication & authorization
- 🔄 PC build configurations
- 🔄 Component compatibility checking
- 🔄 Price tracking & alerts
- 🔄 Component reviews & ratings
- 🔄 Advanced search & filtering
- 🔄 Frontend web application
- 🔄 Mobile application support

## 📋 Prerequisites

- Docker & Docker Compose
- Go 1.24+ (for local development)
- PostgreSQL (handled by Docker)

## 🛠️ Installation & Setup

### Using Docker (Recommended)

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
   GIN_MODE=release
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

### Local Development Setup

1. **Install dependencies**

   ```bash
   go mod download
   ```

2. **Setup local PostgreSQL**

   ```bash
   # Using Docker for database only
   docker run --name pc-builder-db \
     -e POSTGRES_PASSWORD=your_password \
     -e POSTGRES_DB=pc_builder \
     -p 5432:5432 \
     -d postgres:16
   ```

3. **Update .env for local development**

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=pc_builder
   DB_SSLMODE=disable
   PORT=8080
   ```

4. **Run the application**
   ```bash
   go run main.go
   ```

## 📚 API Documentation

### Base URL

```
http://localhost:8080
```

### Endpoints

#### Health Check

```http
GET /health
```

**Response:**

```json
{
  "status": "ok"
}
```

#### Get All Components

```http
GET /api/components
```

**Response:**

```json
{
  "status": 200,
  "components": [
    {
      "id": 1,
      "name": "RTX 4090",
      "category": "GPU",
      "brand": "NVIDIA",
      "models": "GeForce RTX 4090",
      "specs": "24GB GDDR6X",
      "price": 1599.99,
      "image_url": "https://example.com/rtx4090.jpg",
      "created_at": "2025-06-11T10:30:00Z",
      "updated_at": "2025-06-11T10:30:00Z"
    }
  ]
}
```

#### Create Component

```http
POST /api/components
Content-Type: application/json

{
  "name": "RTX 4090",
  "category": "GPU",
  "brand": "NVIDIA",
  "model": "GeForce RTX 4090",
  "specs": "24GB GDDR6X",
  "price": 1599.99,
  "image_url": "https://example.com/rtx4090.jpg"
}
```

**Response:**

```json
{
  "status": 201,
  "message": "Component created successfully",
  "component": {
    "id": 1,
    "name": "RTX 4090",
    "category": "GPU",
    "brand": "NVIDIA",
    "models": "GeForce RTX 4090",
    "specs": "24GB GDDR6X",
    "price": 1599.99,
    "image_url": "https://example.com/rtx4090.jpg",
    "created_at": "2025-06-11T10:30:00Z",
    "updated_at": "2025-06-11T10:30:00Z"
  }
}
```

## 🗄️ Database Schema

### Components Table

```sql
CREATE TABLE components (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    brand VARCHAR(100) NOT NULL,
    models VARCHAR(255) NOT NULL,
    specs TEXT,
    price DECIMAL(10,2),
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deleted_at TIMESTAMP NULL
);
```

### Component Categories

- **CPU** (Processors)
- **GPU** (Graphics Cards)
- **RAM** (Memory)
- **Storage** (SSD/HDD)
- **Motherboard**
- **PSU** (Power Supply)
- **Case** (PC Cases)
- **Cooling** (CPU Coolers, Case Fans)

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

```
pc-builder/
├── backend/
│   ├── config/         # Configuration management
│   ├── controller/     # API controllers
│   ├── db/            # Database initialization
│   ├── models/        # Data models
│   ├── routes/        # Route definitions
│   ├── main.go        # Application entry point
│   ├── docker-compose.yml
│   ├── Dockerfile
│   ├── go.mod
│   ├── go.sum
│   ├── .env.example
│   └── README.md
└── frontend/
```

### Adding New Features

1. **Add new model**: Create struct in `models/`
2. **Add migration**: Update `db.go` AutoMigrate section
3. **Create controller**: Add handlers in `controller/`
4. **Register routes**: Update `routes/router.go`
5. **Test endpoints**: Use curl or Postman

### Environment Variables

| Variable      | Description       | Default      |
| ------------- | ----------------- | ------------ |
| `DB_HOST`     | Database host     | `db`         |
| `DB_PORT`     | Database port     | `5432`       |
| `DB_USER`     | Database user     | `postgres`   |
| `DB_PASSWORD` | Database password | _required_   |
| `DB_NAME`     | Database name     | `pc_builder` |
| `DB_SSLMODE`  | SSL mode          | `disable`    |
| `PORT`        | Application port  | `8080`       |
| `GIN_MODE`    | Gin mode          | `debug`      |

## 🚀 Deployment

### Production Considerations

- Set `GIN_MODE=release`
- Use strong database passwords
- Implement proper logging
- Add rate limiting
- Setup SSL/TLS certificates
- Configure reverse proxy (nginx)
- Setup monitoring and health checks

### Future Deployment Options

- **Cloud**: AWS ECS, Google Cloud Run, Azure Container Instances
- **Kubernetes**: For scalable deployments
- **Traditional VPS**: With Docker Compose

## 📋 Roadmap

### Phase 1: Backend Foundation ✅

- [x] Basic CRUD operations
- [x] Database setup
- [x] Docker configuration
- [x] API endpoints

### Phase 2: Enhanced Backend (In Progress)

- [ ] User authentication
- [ ] Component relationships
- [ ] Advanced search & filtering
- [ ] Data validation & error handling
- [ ] API documentation (Swagger)

### Phase 3: Frontend Development

- [ ] React.js web application
- [ ] Component browsing interface
- [ ] PC build configurator
- [ ] User dashboard
- [ ] Responsive design

### Phase 4: Advanced Features

- [ ] Component compatibility checker
- [ ] Price tracking & alerts
- [ ] User reviews & ratings
- [ ] Build sharing & community features
- [ ] Mobile application

### Phase 5: Production Ready

- [ ] Comprehensive testing suite
- [ ] Performance optimization
- [ ] Security hardening
- [ ] Monitoring & logging
- [ ] CI/CD pipeline

## 👥 Authors

- Le Dinh Khoi - Initial work

## 🙏 Acknowledgments

- Gin Web Framework
- GORM ORM
- PostgreSQL
- Docker Community
