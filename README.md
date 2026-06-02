# SmartHire Pro

SmartHire Pro is an AI-based recruitment management system with a Spring Boot backend and a Vite + React frontend.

## Repository Layout

```text
SmartHire Pro/
├── backend/
│   ├── pom.xml
│   ├── Dockerfile
│   └── src/
│       └── main/
│           ├── java/com/smarthire/pro/
│           │   ├── config/
│           │   ├── controller/
│           │   ├── dto/
│           │   ├── entity/
│           │   ├── exception/
│           │   ├── repository/
│           │   ├── security/
│           │   └── service/
│           └── resources/
│               ├── application.properties
│               ├── application-dev.properties
│               ├── application-staging.properties
│               ├── application-prod.properties
│               └── db/migration/
├── frontend/
│   ├── package.json
│   ├── vite.config.ts
│   └── src/
│       ├── App.tsx
│       ├── App.css
│       ├── main.tsx
│       └── index.css
├── docker-compose.yml
└── docs/
    └── audits/
```

## Tech Stack

- Backend: Java 17, Spring Boot 3.2, Spring Security, Spring Data JPA, Flyway, JWT, MySQL
- Frontend: React 19, TypeScript, Vite
- Dev tools: Docker, Docker Compose, Maven, npm

## Local Setup

### Backend

1. Open the backend folder.
2. Load the local environment variables from `backend/.env`.
3. Start the application with Maven.

```bash
cd "SmartHire Pro/backend"
set -a && source .env && set +a
mvn spring-boot:run
```

Backend URLs:

- API base: `http://localhost:8080/api`
- Swagger UI: `http://localhost:8080/api/swagger-ui.html`

### Frontend

1. Open the frontend folder.
2. Install dependencies if needed.
3. Start the Vite dev server.

```bash
cd "SmartHire Pro/frontend"
npm install
npm run dev
```

Frontend URL:

- App: `http://localhost:5173`

### Database

The backend expects MySQL on `localhost:3306` with the credentials defined in `backend/.env`. Database schema changes are handled by Flyway migrations.

## Authentication Flow

The frontend is wired to the backend auth endpoints.

- Register: `POST /api/auth/register`
- Login: `POST /api/auth/login`

Successful login returns a JWT token that is stored in `localStorage` as `smarthire_token`.

## Key Features

- Role-based access for `ADMIN`, `HR`, and `RECRUITER`
- JWT authentication
- Candidate, job, interview, and onboarding domain models
- Database migrations through Flyway
- Separate frontend and backend development workflows

## Notes

- The root project now acts as a container for the backend and frontend apps.
- The frontend source files live in `frontend/src/`.
- The backend source files live in `backend/src/`.
