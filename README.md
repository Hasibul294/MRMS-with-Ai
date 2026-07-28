# Patient Appointment and Medical Record Management System (MRMS)

Production-quality healthcare solution built following Clean Architecture, SOLID principles, ASP.NET Core 8 Web API, and React with React Query & Zod.

## Tech Stack

### Backend
- **Framework**: ASP.NET Core 8 Web API
- **ORM**: Entity Framework Core 8
- **Database**: SQL Server
- **Architecture**: Clean Layered Architecture (`MRMS.API`, `MRMS.Application`, `MRMS.Domain`, `MRMS.Infrastructure`, `MRMS.Tests`)
- **Validation**: FluentValidation
- **Logging**: Serilog
- **Testing**: xUnit + Moq

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Server State Management**: React Query (`@tanstack/react-query`) + Axios
- **Form Management**: React Hook Form + Zod (`@hookform/resolvers/zod`)
- **Styling**: Tailwind CSS + Glassmorphism design tokens

---

## Project Structure

```
MRMS/
├── backend/
│   ├── MRMS.API/             # REST Controllers, Middleware, Extensions
│   ├── MRMS.Application/     # DTOs, Services, Interfaces, FluentValidators
│   ├── MRMS.Domain/          # Entities (Patient, Doctor, Appointment, MedicalRecord) & Enums
│   ├── MRMS.Infrastructure/  # EF Core DbContext, Configurations, Repositories
│   └── MRMS.Tests/           # Service & Validator xUnit tests
└── frontend/
    ├── src/
    │   ├── components/ui/    # Reusable UI (Button, Input, Select, Modal, Table, Pagination)
    │   ├── features/
    │   │   ├── patients/     # Hooks (React Query), Zod schemas, Form modals, List
    │   │   ├── appointments/ # Appointment schedule view
    │   │   └── medical-records/ # Immutable EMR records view
    │   ├── services/         # Axios client, Patient API, Stateful Mock fallback
    │   └── types/            # TypeScript definitions matching C# DTOs
```

---

## Quick Start (Frontend)

1. `cd frontend`
2. `npm install`
3. `npm run dev`
4. Open [http://localhost:3000](http://localhost:3000) in your browser.
