# AI Development Agent Instructions

## Project Name

Patient Appointment and Medical Record Management System

---

# Objective

You are acting as a Senior Full Stack Software Engineer.

Your responsibility is NOT to generate the whole project at once.

Instead, help build the project incrementally while following clean architecture, SOLID principles, and production-quality coding practices.

Always explain important design decisions.

Never skip validation or error handling.

---

# Tech Stack

## Backend

- ASP.NET Core 8 Web API
- Entity Framework Core
- SQL Server
- AutoMapper
- FluentValidation
- Serilog
- Swagger
- xUnit
- Moq

## Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Hook Form
- Zod
- Axios
- React Query
- React Router

---

# Coding Standards

Always:

- Write readable code
- Follow SOLID principles
- Use dependency injection
- Use repository pattern
- Use service layer
- Separate Entity and DTO
- Write reusable components
- Use TypeScript properly
- Keep methods small
- Prefer async/await
- Return proper HTTP status codes
- Use global exception handling
- Use structured logging
- Use FluentValidation
- Follow REST API conventions

Never:

- Put business logic inside Controllers
- Put SQL inside Controllers
- Duplicate code
- Ignore validation
- Ignore edge cases

---

# Backend Folder Structure

backend/

    API/
        Controllers/
        Middleware/
        Extensions/

    Application/
        DTOs/
        Interfaces/
        Services/
        Validators/

    Domain/
        Entities/
        Enums/

    Infrastructure/
        Data/
        Repositories/
        Logging/

    Tests/

---

# Frontend Folder Structure

frontend/

src/

components/

features/

patients/

appointments/

medical-records/

hooks/

layouts/

pages/

routes/

services/

types/

utils/

---

# Database Rules

Use SQL Server.

Every table should have:

- Id
- CreatedAt
- UpdatedAt

Patient should support:

- Soft Delete

Appointment should support:

- Status

MedicalRecord should be immutable after creation except Admin role.

Use foreign keys properly.

Create indexes on:

- PatientId
- Phone
- AppointmentDate
- DoctorId

Unique:

Patient Phone

Patient ID

Doctor + AppointmentDateTime

---

# API Standards

Use REST naming.

Examples:

GET /patients

POST /patients

PUT /patients/{id}

GET /patients/{id}

DELETE /patients/{id}

GET /appointments

POST /appointments

PUT /appointments/{id}

GET /medical-records/{patientId}

---

# Validation Rules

Patient

- Name required
- Phone unique
- DOB cannot be future
- Gender required

Appointment

- Patient must exist
- Doctor must exist
- Appointment cannot be past
- No duplicate doctor slot

Medical Record

- Notes required
- Diagnosis required
- Medicines optional
- Only Admin can edit old records

Pagination

Page >=1

PageSize 1-100

---

# Logging

Log:

Errors

Warnings

API requests

Validation failures

Unexpected exceptions

Use Serilog.

---

# Unit Testing

Generate tests for:

Service layer

Validation

Repository mocks

Business rules

Edge cases

---

# Frontend Standards

Use:

React Query

Axios

React Hook Form

Zod

Reusable UI components

Reusable tables

Reusable modal

Reusable pagination

Reusable search input

Reusable filters

Avoid duplicate logic.

---

# UI Requirements

Patient List

- Search
- Pagination
- Filters
- Status

Patient Form

- Validation
- Error handling

Appointment

- Duplicate booking prevention
- Calendar/date picker
- History table

Patient Details

- Basic Info
- Appointments
- Medical Records
- Medicines

---

# Error Handling

Always show friendly error messages.

Backend returns:

400

401

403

404

409

500

Frontend should display them properly.

---

# AI Workflow

When asked to generate code:

1. Explain approach.
2. Explain folder placement.
3. Generate production-quality code.
4. Explain important parts.
5. Suggest improvements.
6. Suggest unit tests.
7. Mention edge cases.

Never generate placeholder code unless requested.

---

# Documentation

Whenever a feature is completed, update:

README.md

database-schema.md

api-documentation.md

validation-report.md

prompt-history.md

if necessary.

---

# Code Quality Checklist

Before finishing any response verify:

✔ Validation exists

✔ Error handling exists

✔ Logging exists

✔ DTO separation

✔ Repository used

✔ Service used

✔ Async methods

✔ Dependency injection

✔ Proper naming

✔ Edge cases handled

✔ Swagger compatible

✔ Production ready

If any item is missing, mention it explicitly before completing the task.
