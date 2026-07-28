# Database Schema Documentation

## Overview & Relationships

```
Users (Id, Username, Role)
  └── Patients (Id, PatientCode, Phone, Email, IsDeleted...)
        ├── Appointments (Id, PatientId, DoctorId, DateTime, Status)
        └── MedicalRecords (Id, PatientId, DoctorId, Diagnosis, IsLocked)
              └── Prescriptions (Id, MedicalRecordId, PatientId, DoctorId)
                    └── PrescriptionItems (Id, PrescriptionId, MedicineName, Dosage, Frequency)
```

---

## Table Definitions

### 1. Patients Table
- **Primary Key**: `Id` (INT, Identity)
- **Unique Indexes**:
  - `IX_Patients_Phone`: `Phone` (NVARCHAR(20))
  - `IX_Patients_PatientCode`: `PatientCode` (NVARCHAR(30))
- **Fields**:
  - `FullName` (NVARCHAR(100), Required)
  - `Email` (NVARCHAR(100))
  - `DateOfBirth` (DATETIME2, Required)
  - `Gender` (INT, Enum: 1=Male, 2=Female, 3=Other)
  - `Address` (NVARCHAR(250))
  - `BloodGroup` (NVARCHAR(10))
  - `EmergencyContact` (NVARCHAR(100))
  - `MedicalHistorySummary` (NVARCHAR(MAX))
  - `IsDeleted` (BIT, Soft Delete Flag, Filtered in EF Core `HasQueryFilter(p => !p.IsDeleted)`)
  - `DeletedAt` (DATETIME2, Nullable)
  - `CreatedAt` (DATETIME2)
  - `UpdatedAt` (DATETIME2, Nullable)

### 2. Doctors Table
- **Primary Key**: `Id` (INT, Identity)
- **Fields**:
  - `FullName` (NVARCHAR(100), Required)
  - `Specialization` (NVARCHAR(100))
  - `Phone` (NVARCHAR(20))
  - `Email` (NVARCHAR(100))
  - `LicenseNumber` (NVARCHAR(50))
  - `CreatedAt` (DATETIME2)

### 3. Appointments Table
- **Primary Key**: `Id` (INT, Identity)
- **Foreign Keys**:
  - `PatientId` -> `Patients.Id` (Restrict Delete)
  - `DoctorId` -> `Doctors.Id` (Restrict Delete)
- **Unique Constraint / Index**:
  - `IX_Appointments_Doctor_DateTime_Unique`: `DoctorId + AppointmentDateTime` (Prevents duplicate doctor bookings at the same time slot)
- **Indexes**:
  - `IX_Appointments_PatientId`
  - `IX_Appointments_DoctorId`
  - `IX_Appointments_AppointmentDateTime`
- **Fields**:
  - `AppointmentDateTime` (DATETIME2)
  - `Status` (INT, Enum: 1=Scheduled, 2=Completed, 3=Cancelled, 4=NoShow)
  - `ReasonForVisit` (NVARCHAR(250))
  - `Notes` (NVARCHAR(MAX))
  - `CreatedAt` (DATETIME2)

### 4. MedicalRecords Table
- **Primary Key**: `Id` (INT, Identity)
- **Foreign Keys**:
  - `PatientId` -> `Patients.Id`
  - `DoctorId` -> `Doctors.Id`
  - `AppointmentId` -> `Appointments.Id` (Nullable)
- **Fields**:
  - `Diagnosis` (NVARCHAR(MAX), Required)
  - `ClinicalNotes` (NVARCHAR(MAX), Required)
  - `PrescriptionMedicines` (NVARCHAR(MAX))
  - `VitalSigns` (NVARCHAR(250))
  - `IsLocked` (BIT, Immutability flag - only `Admin` role can modify after creation)
  - `CreatedAt` (DATETIME2)
  - `UpdatedAt` (DATETIME2, Nullable)

### 5. Prescriptions Table
- **Primary Key**: `Id` (INT, Identity)
- **Foreign Keys**:
  - `MedicalRecordId` -> `MedicalRecords.Id`
  - `PatientId` -> `Patients.Id`
  - `DoctorId` -> `Doctors.Id`
- **Fields**:
  - `IssuedDate` (DATETIME2)
  - `Instructions` (NVARCHAR(MAX))
  - `CreatedAt` (DATETIME2)

### 6. PrescriptionItems Table
- **Primary Key**: `Id` (INT, Identity)
- **Foreign Key**:
  - `PrescriptionId` -> `Prescriptions.Id`
- **Fields**:
  - `MedicineName` (NVARCHAR(100), Required)
  - `Dosage` (NVARCHAR(50))
  - `Frequency` (NVARCHAR(50))
  - `DurationDays` (INT)

### 7. Users / Roles Table
- **Primary Key**: `Id` (INT, Identity)
- **Fields**:
  - `Username` (NVARCHAR(50), Unique)
  - `Role` (INT, Enum: 1=Admin, 2=Doctor, 3=Receptionist, 4=Patient)
  - `IsActive` (BIT)

---

## Indexing & Soft Delete Strategy

| Entity | Indexing Strategy | Unique Constraints | Soft Delete |
| :--- | :--- | :--- | :---: |
| `Patients` | Index on `Phone`, `PatientCode`, `CreatedAt` | `Phone`, `PatientCode` | Yes (`IsDeleted`) |
| `Doctors` | Index on `Specialization` | `LicenseNumber` | No |
| `Appointments` | Index on `PatientId`, `DoctorId`, `AppointmentDateTime` | `DoctorId + AppointmentDateTime` | No |
| `MedicalRecords` | Index on `PatientId`, `DoctorId` | None | No (Immutable) |
| `Prescriptions` | Index on `MedicalRecordId`, `PatientId` | None | No |
| `Users` | Index on `Role` | `Username` | No |
