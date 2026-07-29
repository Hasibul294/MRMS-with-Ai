# Patient Appointment and Medical Record Management System (MRMS)

Production-quality healthcare management solution built following C# Clean Architecture, SOLID principles, ASP.NET Core 8 Web API, and React 18 with React Query & Zod.

---

## Tech Stack

### Backend
- **Framework**: ASP.NET Core 8 Web API
- **ORM**: Entity Framework Core 8 (SQLite out-of-the-box, SQL Server support)
- **Architecture**: Clean Layered Architecture (`MRMS.API`, `MRMS.Application`, `MRMS.Domain`, `MRMS.Infrastructure`, `MRMS.Tests`)
- **Validation**: FluentValidation
- **Logging**: Serilog
- **Testing**: xUnit + Moq

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Server State Management**: React Query (`@tanstack/react-query`) + Axios
- **Form Management**: React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Styling**: Tailwind CSS + Glassmorphism design system

---

## Project Structure

```
MRMS/
├── backend/
│   ├── MRMS.API/             # REST Controllers, Middleware, Serilog & DI Configuration
│   ├── MRMS.Application/     # DTOs, Service Interfaces, Business Logic, FluentValidators
│   ├── MRMS.Domain/          # Entities (Patient, Doctor, Appointment, MedicalRecord) & Enums
│   ├── MRMS.Infrastructure/  # EF Core ApplicationDbContext, Repositories, DbSeeder
│   └── MRMS.Tests/           # Unit Tests for Services & Validators (xUnit + Moq)
└── frontend/
    ├── src/
    │   ├── components/ui/    # Reusable UI (Button, Input, Select, Modal, Table, Pagination)
    │   ├── features/         # Modular Features (patients, appointments, medical-records)
    │   ├── services/         # Axios client, Patient API, Stateful Mock fallback
    │   └── types/            # TypeScript definitions matching Backend DTOs
```

---

## Prerequisites

Before running the application locally, ensure you have the following installed:
- **.NET 8 SDK**: Download from [.NET Official Site](https://dotnet.microsoft.com/download/dotnet/8.0)
- **Node.js 18+ & npm**: Download from [Node.js Official Site](https://nodejs.org/)

---

## How to Run Backend Server Locally

The backend API is pre-configured with **SQLite** by default (`mrms.db`), enabling **zero-setup local execution** without requiring a standalone SQL Server instance. On first run, the database is automatically created and populated with sample doctors, patients, appointments, and medical records.

### Step 1: Navigate to Project Root or Backend Directory

Open your terminal in the `MRMS` root directory:

```bash
cd backend/MRMS.API
```

### Step 2: Restore Dependencies & Build

```bash
dotnet restore
dotnet build
```

### Step 3: Run the Backend API

```bash
dotnet run
```

Alternatively, from the project root directory without changing folders:

```bash
dotnet run --project backend/MRMS.API/MRMS.API.csproj
```

### Step 4: Access Swagger API Documentation

Once started, the API will output its running URL (typically `http://localhost:5000` or `https://localhost:5001`).

- **Swagger UI Endpoint**: Navigate to `http://localhost:5000/swagger` (or root `http://localhost:5000/`) in your browser to inspect and test all interactive REST API endpoints.

### (Optional) Database Configuration & SQL Server Setup

To switch from SQLite to Microsoft SQL Server:
1. Open `backend/MRMS.API/appsettings.json`.
2. Update `"UseSqlite": false`.
3. Set your SQL Server connection string under `"ConnectionStrings": { "DefaultConnection": "..." }`.
4. Run `dotnet run --project backend/MRMS.API/MRMS.API.csproj`.

### Step 5: Run Backend Unit Tests

To run the full suite of backend service and validator unit tests:

```bash
dotnet test backend/MRMS.Tests/MRMS.Tests.csproj
```

---

## How to Run Frontend Server Locally

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
npm install
```

### Step 3: Start Vite Development Server

```bash
npm run dev
```

### Step 4: Open Browser

Navigate to [http://localhost:3000](http://localhost:3000) (or `http://localhost:5173`).

> **Note**: The frontend Axios client communicates with the backend API automatically. If the backend is offline, the frontend gracefully falls back to stateful mock data so you can continue testing the UI uninterrupted.

---

## Documentation & Deliverables

- [AGENT.md](file:///d:/office-work/MRMS/AGENT.md) — Complete Project Instructions & Tech Stack Requirements
- [database-schema.md](file:///d:/office-work/MRMS/database-schema.md) — SQL Database Schema & Indexing Rules
- [api-documentation.md](file:///d:/office-work/MRMS/api-documentation.md) — REST API Endpoints & Request/Response Specification
- [ai-comparison.md](file:///d:/office-work/MRMS/ai-comparison.md) — AI Development Tool Comparison (Antigravity vs Kilo Code Free Tier)
- [validation-report.md](file:///d:/office-work/MRMS/validation-report.md) — Code Quality & Test Verification Report
- [prompt-history.md](file:///d:/office-work/MRMS/prompt-history.md) — Execution Prompt History Log
