# REST API Documentation

Base URL: `/api`

## Patient Endpoints

### 1. GET `/api/patients`
Retrieves a paginated list of patients with search and filtering.

**Query Parameters:**
- `searchTerm` (string, optional)
- `gender` (int: 1=Male, 2=Female, 3=Other, optional)
- `bloodGroup` (string, optional)
- `pageNumber` (int, default: 1)
- `pageSize` (int, default: 10, max: 100)

**Response `200 OK`:**
```json
{
  "items": [
    {
      "id": 1,
      "patientCode": "PAT-202607-1001",
      "fullName": "Eleanor Vance",
      "phone": "+15550192834",
      "email": "eleanor.vance@example.com",
      "dateOfBirth": "1992-04-12T00:00:00Z",
      "age": 34,
      "gender": 2,
      "genderName": "Female",
      "address": "742 Evergreen Terrace",
      "bloodGroup": "O+",
      "createdAt": "2026-07-01T09:30:00Z"
    }
  ],
  "totalCount": 1,
  "pageNumber": 1,
  "pageSize": 10,
  "totalPages": 1,
  "hasNextPage": false,
  "hasPreviousPage": false
}
```

### 2. POST `/api/patients`
Registers a new patient profile.

**Request Body (`CreatePatientDto`):**
```json
{
  "fullName": "John Doe",
  "phone": "+15550199988",
  "email": "john@example.com",
  "dateOfBirth": "1990-05-15",
  "gender": 1,
  "address": "123 Main St",
  "bloodGroup": "O+",
  "emergencyContact": "+15559998877",
  "medicalHistorySummary": "Mild asthma"
}
```

**Responses:**
- `201 Created`: Returns created `PatientDto` with generated `PatientCode`.
- `400 Bad Request`: Validation failure.
- `409 Conflict`: Phone number already exists.

### 3. PUT `/api/patients/{id}`
Updates an existing patient record.

### 4. DELETE `/api/patients/{id}`
Soft-deletes a patient record (`IsDeleted = true`, sets `DeletedAt`). Returns `204 No Content`.
