# Database Schema Documentation

## Entities

### 1. Patients Table
- `Id` (INT, Primary Key, Identity)
- `PatientCode` (NVARCHAR(30), Unique Index `IX_Patients_PatientCode`)
- `FullName` (NVARCHAR(100), Required)
- `Phone` (NVARCHAR(20), Unique Index `IX_Patients_Phone`, Required)
- `Email` (NVARCHAR(100))
- `DateOfBirth` (DATETIME2, Required)
- `Gender` (INT, Enum: 1=Male, 2=Female, 3=Other)
- `Address` (NVARCHAR(250))
- `BloodGroup` (NVARCHAR(10))
- `EmergencyContact` (NVARCHAR(100))
- `MedicalHistorySummary` (NVARCHAR(MAX))
- `IsDeleted` (BIT, Soft Delete Flag)
- `DeletedAt` (DATETIME2, Nullable)
- `CreatedAt` (DATETIME2)
- `UpdatedAt` (DATETIME2, Nullable)

### 2. Appointments Table
- `Id` (INT, Primary Key)
- `PatientId` (INT, Foreign Key -> Patients.Id, Index `IX_Appointments_PatientId`)
- `DoctorId` (INT, Foreign Key -> Doctors.Id, Index `IX_Appointments_DoctorId`)
- `AppointmentDateTime` (DATETIME2, Index `IX_Appointments_AppointmentDateTime`)
- `Status` (INT, Enum: 1=Scheduled, 2=Completed, 3=Cancelled, 4=NoShow)
- `ReasonForVisit` (NVARCHAR(250))
- `Notes` (NVARCHAR(MAX))
- Unique Constraint: `DoctorId + AppointmentDateTime` (`IX_Appointments_Doctor_DateTime_Unique`)

### 3. MedicalRecords Table
- `Id` (INT, Primary Key)
- `PatientId` (INT, Foreign Key -> Patients.Id)
- `DoctorId` (INT, Foreign Key -> Doctors.Id)
- `AppointmentId` (INT, Nullable Foreign Key)
- `Diagnosis` (NVARCHAR(MAX), Required)
- `ClinicalNotes` (NVARCHAR(MAX), Required)
- `PrescriptionMedicines` (NVARCHAR(MAX))
- `VitalSigns` (NVARCHAR(250))
- `IsLocked` (BIT, Immutability Flag)
- `CreatedAt` (DATETIME2)
