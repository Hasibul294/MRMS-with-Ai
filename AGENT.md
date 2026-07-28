# AI Development Agent Instructions

## Project Name
Patient Appointment and Medical Record Management System (MRMS)

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
- AutoMapper / Mapster
- FluentValidation
- Serilog
- Swagger
- xUnit
- Moq

## Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI design patterns
- React Hook Form
- Zod
- Axios
- React Query (@tanstack/react-query)
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
        components/ui/
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

# Database Schema & Rules

Use SQL Server.

Every table should have:
- Id (Primary Key)
- CreatedAt
- UpdatedAt

Entities Required:
1. `Patients`: Supports Soft Delete (`IsDeleted`, `DeletedAt`), Unique Index on `Phone` and `PatientCode`.
2. `Doctors`: FullName, Specialization, Phone, Email, LicenseNumber.
3. `Appointments`: Foreign keys to `PatientId` and `DoctorId`. Unique Index on `DoctorId + AppointmentDateTime`. Status enum (`Scheduled`, `Completed`, `Cancelled`, `NoShow`).
4. `MedicalRecords`: Foreign keys to `PatientId`, `DoctorId`, `AppointmentId`. Immutability flag (`IsLocked`). Only Admin role can edit.
5. `Prescriptions`: Foreign key to `MedicalRecordId`, `PatientId`, `DoctorId`, `IssuedDate`.
6. `PrescriptionItems`: Foreign key to `PrescriptionId`, `MedicineName`, `Dosage`, `Frequency`, `DurationDays`.
7. `Users` / `Roles`: System user authentication & authorization roles (`Admin`, `Doctor`, `Receptionist`, `Patient`).

Indexes Required on:
- `PatientId`
- `Phone`
- `AppointmentDate` / `AppointmentDateTime`
- `DoctorId`

Unique Constraints:
- Patient Phone
- Patient Code
- Doctor + AppointmentDateTime

Soft Delete:
- Patient records

---

# Functional Requirements

## Patient Management
- Register a new patient
- Update patient information
- View patient details
- Search patients by: Name, Phone number, Patient ID
- Filter patients by: Gender and Registration date
- Paginated patient list
- Soft-delete patient records

## Appointment Management
- Create an appointment for a patient
- Update appointment date and time (Reschedule)
- Cancel an appointment
- View appointment history (by Patient)
- Filter appointments by: Date, Status, Doctor
- Prevent duplicate appointments for the same doctor and time slot

## Medical Record & Prescription Management
- Add basic medical notes
- Add diagnosis
- Add prescribed medicines & vitals (Prescriptions & PrescriptionItems)
- View previous medical records & prescription history
- Maintain created date and updated date
- Prevent unauthorized modification of old records through basic role validation (Only Admin role can edit)

## Patient Details Page
- Patient basic information
- Upcoming appointments
- Previous appointments
- Medical records history
- Prescribed medicines list

---

# Validation Tasks (Verification Checklist)

Ensure test cases and validators cover:
1. Duplicate patient phone number (returns 409 Conflict)
2. Invalid date of birth (future date blocked)
3. Appointment in the past (blocked)
4. Duplicate doctor time slot (returns 409 Conflict)
5. Patient not found (returns 404 Not Found)
6. Empty medical note / diagnosis (validation error)
7. Invalid pagination values (Page < 1 or PageSize > 100)
8. Unauthorized medical record update (non-admin edit returns 403 Forbidden)
9. API failure handling on the frontend (graceful error banner & offline mock fallback)

---

# Mandatory Deliverables

Project Root:
├── backend/
├── frontend/
├── database-schema.md
├── api-documentation.md
├── prompt-history.md
├── ai-comparison.md
├── validation-report.md
└── README.md

