<p align="center">
  <picture>
    <img src="/apps/frontend/public/logo/pc-builder-logo-transparent-2.png" width="500" alt="PC Builder">
  </picture>
</p>
<div align="center">
  <p align="center">
    <a href="https://opensource.org/licenses/MIT"><img alt="MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg"/></a>
    <a href="https://golang.org"><img alt="Go" src="https://img.shields.io/badge/Go-1.24-00ADD8?logo=go" /></a>
    <a href="https://www.postgresql.org"><img alt="PostgreSQL" src="https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql" /></a>
    <a href="https://www.docker.com"><img alt="Docker Compose" src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker" /></a>
  </p>

<p>A comprehensive PC component management service built with Go, Gin, GORM, and PostgreSQL. This backend service provides APIs for managing PC components and will serve as the foundation for a complete PC building application.</p>

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

## Architecture

### Tech Stack

| Component        | Technology | Version |
| ---------------- | ---------- | ------- |
| Language         | Go         | 1.24    |
| Web Framework    | Gin        | Latest  |
| ORM              | GORM       | Latest  |
| Database         | PostgreSQL | 16      |
| Authentication   | JWT        | Latest  |
| Password Hashing | bcrypt     | Latest  |
| Image Storage    | Cloudinary | v2      |
| Containerization | Docker     | Latest  |

### Project Structure

```bash
apps/backend/
├── api/
│   ├── controllers/           # Request handlers
│   │   ├── admin_controller.go       # Admin-only endpoints
│   │   ├── auth_controller.go        # Registration & login
│   │   ├── components_controller.go  # Component CRUD
│   │   ├── filters_controller.go     # Filter metadata
│   │   └── image_controller.go       # Image upload/delete
│   ├── middlewares/          # HTTP middleware
│   │   ├── check_role.go            # Role verification
│   │   ├── jwt_middleware.go        # Token validation
│   │   └── security.go              # CORS, rate limit, logging
│   ├── models/               # Database models
│   │   ├── components.go            # Component entities
│   │   └── user.go                  # User model
│   ├── repositories/         # Database layer
│   │   ├── components_repository.go # Component queries
│   │   └── filters_repository.go    # Filter queries
│   └── routes/               # Route definitions
│       └── router.go                # Route registration
├── config/                   # Configuration
│   └── load_env.go                  # Environment loader
├── db/                       # Database
│   └── db.go                        # DB initialization & indexes
├── services/                 # External services
│   └── cloudinary_service.go        # Image service
├── utils/                    # Utilities
│   ├── error.go                     # Error handlers
│   ├── generate_jwt.go              # JWT generation
│   ├── hash_password.go             # Password hashing
│   └── response.go                  # Response helpers
├── main.go                   # Application entry
├── Dockerfile                # Container build
├── docker-compose.yml        # Service orchestration
├── go.mod                    # Dependencies
└── .env.example              # Environment template
```

---

## Features

### Current Features

- **Full CRUD Operations** - Create, Read, Update, Delete components with validation
- **Advanced Filtering System** - Filter by category, brand, price range, and technical specifications
- **Multi-Currency Support** - Automatic currency handling (VND, USD) based on client locale
- **Real-time Search** - Fast full-text search across component names, brands, categories, and models
- **Bulk Operations** - Create multiple components simultaneously with detailed error reporting
- **Pagination** - Efficient data loading with customizable page sizes
- **JWT Authentication** - Secure token-based authentication system
- **Role-Based Access Control (RBAC)** - Admin, Vendor, and User roles
- **Image Management** - Cloudinary integration for image uploads and optimization
- **Security Middleware** - Rate limiting, CORS, request ID tracking, and security headers

## Installation & Setup

### Prerequisites

- Docker Desktop installed
- Git

### Using Docker

#### Services

- **backend**: Go application (Port: 8080)
- **db**: PostgreSQL database (Port: 5432)

#### Volumes

- `postgres_data`: Persistent PostgreSQL data storage

#### Networks

- `pc_builder_network`: Bridge network for service communication

#### Installation

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
   # Server
   PORT=8080
   ENVIRONMENT=development

   # Database
   DB_HOST=db
   DB_PORT=5432
   DB_USER=postgres
   DB_PASSWORD=your_secure_password
   DB_NAME=pc_builder
   DB_SSLMODE=disable

   # Security
   JWT_SECRET=your_jwt_secret_key
   ALLOWED_ORIGINS=http://localhost:5173

   # Cloudinary (Optional - for image uploads)
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
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

### Local Development (without Docker)

1. **Install PostgreSQL 16**

2. **Create database**

```sql
CREATE DATABASE pc_builder;
```

3. **Update .env**

```env
DB_HOST=localhost
```

4. **Install dependencies**

```bash
go mod download
```

5. **Run application**

```bash
go run main.go
```

---

## API Documentation

### Base URL

```bash
http://localhost:8080/api/v1
```

### Authentication Endpoints

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Login

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response:
{
  "status": 200,
  "message": "Login successful",
  "response": {
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### Public Endpoints

#### Get Components (with filters)

```http
GET /components?page=1&page_size=12&category_id=cpu&min_price=100&max_price=1000&sort_by=price&sort_order=asc&currency=USD

Response:
{
  "status": 200,
  "message": "Components fetched successfully",
  "response": {
    "components": [...],
    "pagination": {
      "current_page": 1,
      "page_size": 12,
      "total_pages": 5,
      "total_records": 58
    },
    "filters": {...},
    "summary": {
      "total_components": 58,
      "by_category": {...},
      "by_brand": {...},
      "price_range": {...}
    }
  }
}
```

#### Get Available Filters

```http
GET /components/filters
Accept-Language: en

Response:
{
  "status": 200,
  "message": "Available filters fetched successfully",
  "response": {
    "categories": [...],
    "brands": [...],
    "specs": {...},
    "price_range": {
      "min_price": 0,
      "max_price": 5000,
      "currency": "USD"
    }
  }
}
```

#### Get Single Component

```http
GET /components/:id
```

#### Get All Categories

```http
GET /categories
```

#### Get All Brands

```http
GET /brands
```

### Protected Endpoints (Admin)

All admin endpoints require JWT authentication:

```http
Authorization: Bearer <token>
```

#### Create Component

```http
POST /admin/components
Content-Type: application/json
Authorization: Bearer <token>

{
  "id": "cpu-intel-i9-14900k",
  "name": "Intel Core i9-14900K",
  "category_id": "cpu",
  "brand_ids": [
    {
      "brand_id": "intel",
      "is_primary": true
    }
  ],
  "models": "14900K",
  "price": [
    {
      "currency": "USD",
      "amount": 589.99,
      "symbol": "$"
    },
    {
      "currency": "VND",
      "amount": 14500000,
      "symbol": "₫"
    }
  ],
  "image_url": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg"
  ],
  "specs": {
    "socket": "LGA1700",
    "cores": "24",
    "threads": "32",
    "base_clock": "3.2 GHz",
    "boost_clock": "6.0 GHz"
  }
}
```

#### Bulk Create Components

```http
POST /admin/components/bulk
Content-Type: application/json
Authorization: Bearer <token>

{
  "components": [
    {...component1...},
    {...component2...}
  ]
}

Response:
{
  "status": 201,
  "message": "Bulk creation completed: 5 created, 2 failed",
  "response": {
    "total_requested": 7,
    "total_created": 5,
    "total_failed": 2,
    "results": [...]
  }
}
```

#### Update Component

```http
PUT /admin/components/:id
```

#### Delete Component

```http
DELETE /admin/components/:id
```

#### Image Upload

```http
POST /admin/images/upload
Content-Type: multipart/form-data
Authorization: Bearer <token>

form-data: image=<file>

Response:
{
  "status": 200,
  "message": "Image uploaded successfully",
  "response": {
    "url": "https://res.cloudinary.com/...",
    "thumbnail": "https://res.cloudinary.com/..."
  }
}
```

#### Bulk Image Upload

```http
POST /admin/images/upload-multiple
Content-Type: multipart/form-data
Authorization: Bearer <token>

form-data: images=<file1>, images=<file2>

Max: 10 images
```

#### Create Category

```http
POST /admin/categories
Content-Type: application/json
Authorization: Bearer <token>

{
  "id": "gpu",
  "name": "gpu",
  "display_name": "Graphics Card",
  "description": "GPU components",
  "icon_url": "https://example.com/gpu-icon.svg",
  "sort_order": 1
}
```

#### Create Brand

```http
POST /admin/brands
Content-Type: application/json
Authorization: Bearer <token>

{
  "id": "nvidia",
  "name": "nvidia",
  "display_name": "NVIDIA",
  "logo_url": "https://example.com/nvidia-logo.png",
  "website": "https://www.nvidia.com",
  "country": "USA"
}
```

#### Get All Users (Admin Only)

```http
GET /admin/users
Authorization: Bearer <token>
```

### Vendor Endpoints

Vendors can create and update components but cannot delete them:

```http
POST /vendor/components
PUT /vendor/components/:id
PUT /vendor/components/:id/deactivate
```

---

## Roadmap

### Phase 1: Backend Foundation

- [x] Basic CRUD operations
- [x] Database setup
- [x] Docker configuration
- [x] API endpoints

### Phase 2: Enhanced Backend (In Progress)

- [x] User authentication
- [x] Component relationships
- [x] Advanced search & filtering
- [x] Data validation & error handling
- [x] API documentation

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

## License

This project is licensed under the MIT License - see the [LICENSE](../../LICENSE) file for details.

---

## Acknowledgments

- [Gin Web Framework](https://gin-gonic.com/)
- [GORM](https://gorm.io/)
- [PostgreSQL](https://www.postgresql.org/)
- [Cloudinary](https://cloudinary.com/)
- [Docker](https://www.docker.com/)

---

<div align="center">
Made with ❤️ by Le Dinh Khoi
</div>
