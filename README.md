# SmartHire Pro 🚀

> **AI-Based Recruitment Management System**  
> Built with Java 17 · Spring Boot 3 · Spring Security · JWT · MySQL · Docker

---

## 📁 Project Structure

```
smarthire-pro/
├── src/
│   └── main/
│       ├── java/com/smarthire/pro/
│       │   ├── config/          # SecurityConfig, SwaggerConfig
│       │   ├── controller/      # REST Controllers (Auth, Candidate, Job, Interview, ...)
│       │   ├── dto/
│       │   │   ├── request/     # Request DTOs
│       │   │   └── response/    # Response DTOs
│       │   ├── entity/          # JPA Entities (User, Candidate, Job, Application, ...)
│       │   ├── exception/       # Custom exceptions & GlobalExceptionHandler
│       │   ├── repository/      # Spring Data JPA Repositories
│       │   ├── security/        # JwtTokenProvider, JwtFilter, UserDetailsService
│       │   ├── service/         # Business Logic Services
│       │   └── SmartHireProApplication.java
│       └── resources/
│           └── application.yml
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

---

## ⚡ Quick Start

### 1. Prerequisites
- Java 17+
- Maven 3.9+
- Docker & Docker Compose (for local DB)
- MySQL 8.0 (or use Docker)

### 2. Run with Docker Compose (Recommended)
```bash
docker-compose up -d
```
> App runs on `http://localhost:8080/api`

### 3. Run Locally (with local MySQL)
```bash
# Update src/main/resources/application.yml with your DB credentials
mvn spring-boot:run
```

---

## 📖 API Documentation

Once running, access Swagger UI at:  
👉 **http://localhost:8080/api/swagger-ui.html**

---

## 🔐 Authentication

All APIs (except `/auth/**`) require a Bearer JWT token.

**Register:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John HR",
  "email": "john@company.com",
  "password": "password123",
  "role": "HR"
}
```

**Login:**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@company.com",
  "password": "password123"
}
```
Returns: `{ "token": "eyJ...", "tokenType": "Bearer", "role": "HR" }`

**Use token in subsequent requests:**
```http
Authorization: Bearer eyJ...
```

---

## 🏃 Agile Sprint Progress

| Sprint | Status | Feature |
|---|---|---|
| Sprint 1 | ✅ Done | Foundation & Setup |
| Sprint 2 | 🔄 In Progress | Auth & RBAC |
| Sprint 3 | ⬜ Planned | Candidate & Job Management |
| Sprint 4 | ⬜ Planned | Resume Screening & Interviews |
| Sprint 5 | ⬜ Planned | Onboarding & Status Tracking |
| Sprint 6 | ⬜ Planned | Dashboard, Reporting & Deployment |

---

## 👥 Roles & Access

| Role | Capabilities |
|---|---|
| **ADMIN** | Full access — user management, all features |
| **HR** | Job postings, candidate management, onboarding, dashboard |
| **RECRUITER** | Candidate management, interviews, application tracking |
# SmartHire-Pro
