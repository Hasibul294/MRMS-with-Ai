import { Patient, CreatePatientInput, UpdatePatientInput, PatientFilter, PagedResult, Gender, Appointment, MedicalRecord, AppointmentStatus } from '../types';

const PATIENTS_STORAGE_KEY = 'mrms_mock_patients_v1';
const APPOINTMENTS_STORAGE_KEY = 'mrms_mock_appointments_v1';
const RECORDS_STORAGE_KEY = 'mrms_mock_records_v1';

const INITIAL_PATIENTS: Patient[] = [
  {
    id: 1,
    patientCode: 'PAT-202607-1001',
    fullName: 'Eleanor Vance',
    phone: '+15550192834',
    email: 'eleanor.vance@example.com',
    dateOfBirth: '1992-04-12',
    age: 34,
    gender: Gender.Female,
    genderName: 'Female',
    address: '742 Evergreen Terrace, Springfield',
    bloodGroup: 'O+',
    emergencyContact: '+15559876543 (Husband)',
    medicalHistorySummary: 'Mild asthma, penicillin allergy.',
    createdAt: '2026-07-01T09:30:00Z',
  },
  {
    id: 2,
    patientCode: 'PAT-202607-1002',
    fullName: 'Robert Sterling',
    phone: '+15550183726',
    email: 'robert.sterling@example.com',
    dateOfBirth: '1978-11-25',
    age: 47,
    gender: Gender.Male,
    genderName: 'Male',
    address: '100 Baker Street, London',
    bloodGroup: 'A+',
    emergencyContact: '+15558765432 (Wife)',
    medicalHistorySummary: 'Type 2 Diabetes mellitus under medication.',
    createdAt: '2026-07-05T14:15:00Z',
  },
  {
    id: 3,
    patientCode: 'PAT-202607-1003',
    fullName: 'Sophia Martinez',
    phone: '+15550174625',
    email: 'sophia.m@example.com',
    dateOfBirth: '1999-08-03',
    age: 26,
    gender: Gender.Female,
    genderName: 'Female',
    address: '458 Sunset Blvd, Los Angeles',
    bloodGroup: 'B-',
    emergencyContact: '+15557654321 (Mother)',
    medicalHistorySummary: 'No chronic illness. Routine checkups.',
    createdAt: '2026-07-10T11:00:00Z',
  },
  {
    id: 4,
    patientCode: 'PAT-202607-1004',
    fullName: 'David K. Chen',
    phone: '+15550165514',
    email: 'd.chen@example.com',
    dateOfBirth: '1985-01-30',
    age: 41,
    gender: Gender.Male,
    genderName: 'Male',
    address: '88 Wall Street, New York',
    bloodGroup: 'AB+',
    emergencyContact: '+15556543210 (Sister)',
    medicalHistorySummary: 'Hypertension managed with Lisinopril.',
    createdAt: '2026-07-15T16:20:00Z',
  },
];

const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 101,
    patientId: 1,
    patientName: 'Eleanor Vance',
    doctorId: 1,
    doctorName: 'Dr. Sarah Jenkins (Cardiology)',
    appointmentDateTime: '2026-07-29T10:00:00Z',
    status: AppointmentStatus.Scheduled,
    reasonForVisit: 'Annual Heart Checkup & ECG',
    notes: 'Patient requested morning slot.',
    createdAt: '2026-07-20T10:00:00Z',
  },
  {
    id: 102,
    patientId: 2,
    patientName: 'Robert Sterling',
    doctorId: 2,
    doctorName: 'Dr. Marcus Vance (Endocrinology)',
    appointmentDateTime: '2026-07-30T14:30:00Z',
    status: AppointmentStatus.Scheduled,
    reasonForVisit: 'HbA1c Diabetes Review',
    notes: 'Bring recent fasting blood test report.',
    createdAt: '2026-07-22T11:30:00Z',
  },
];

const INITIAL_RECORDS: MedicalRecord[] = [
  {
    id: 501,
    patientId: 1,
    patientName: 'Eleanor Vance',
    doctorId: 1,
    doctorName: 'Dr. Sarah Jenkins',
    diagnosis: 'Mild Sinus Bradycardia',
    clinicalNotes: 'ECG shows normal sinus rhythm with mild bradycardia (58 bpm). Normal S1/S2.',
    prescriptionMedicines: '1. Tab. CoQ10 100mg once daily after meal\n2. Continue regular exercise',
    vitalSigns: 'BP: 118/76 mmHg | Pulse: 58 bpm | Temp: 98.4 F | SpO2: 99%',
    isLocked: true,
    createdAt: '2026-06-15T10:30:00Z',
  },
];

export const getStoredPatients = (): Patient[] => {
  const data = localStorage.getItem(PATIENTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(INITIAL_PATIENTS));
    return INITIAL_PATIENTS;
  }
  return JSON.parse(data);
};

export const saveStoredPatients = (patients: Patient[]) => {
  localStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
};

export const getStoredAppointments = (): Appointment[] => {
  const data = localStorage.getItem(APPOINTMENTS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(INITIAL_APPOINTMENTS));
    return INITIAL_APPOINTMENTS;
  }
  return JSON.parse(data);
};

export const saveStoredAppointments = (appointments: Appointment[]) => {
  localStorage.setItem(APPOINTMENTS_STORAGE_KEY, JSON.stringify(appointments));
};

export const getStoredRecords = (): MedicalRecord[] => {
  const data = localStorage.getItem(RECORDS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(INITIAL_RECORDS));
    return INITIAL_RECORDS;
  }
  return JSON.parse(data);
};

export const saveStoredRecords = (records: MedicalRecord[]) => {
  localStorage.setItem(RECORDS_STORAGE_KEY, JSON.stringify(records));
};

// Mock async API handlers
export const mockFetchPatients = async (filter: PatientFilter): Promise<PagedResult<Patient>> => {
  await new Promise((res) => setTimeout(res, 250)); // simulate network latency
  let list = getStoredPatients();

  if (filter.searchTerm) {
    const term = filter.searchTerm.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.fullName.toLowerCase().includes(term) ||
        p.phone.includes(term) ||
        p.email.toLowerCase().includes(term) ||
        p.patientCode.toLowerCase().includes(term)
    );
  }

  if (filter.gender) {
    list = list.filter((p) => Number(p.gender) === Number(filter.gender));
  }

  if (filter.bloodGroup) {
    list = list.filter((p) => p.bloodGroup === filter.bloodGroup);
  }

  const totalCount = list.length;
  const pageNumber = filter.pageNumber || 1;
  const pageSize = filter.pageSize || 10;
  const startIndex = (pageNumber - 1) * pageSize;
  const items = list.slice(startIndex, startIndex + pageSize);

  const totalPages = Math.ceil(totalCount / pageSize) || 1;

  return {
    items,
    totalCount,
    pageNumber,
    pageSize,
    totalPages,
    hasNextPage: pageNumber < totalPages,
    hasPreviousPage: pageNumber > 1,
  };
};

export const mockCreatePatient = async (input: CreatePatientInput): Promise<Patient> => {
  await new Promise((res) => setTimeout(res, 300));
  const list = getStoredPatients();

  // Validate phone uniqueness
  const phoneExists = list.some((p) => p.phone.trim() === input.phone.trim());
  if (phoneExists) {
    throw { status: 409, message: `A patient with phone number '${input.phone}' already exists.` };
  }

  const dobDate = new Date(input.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  if (today < new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate())) age--;

  const newPatient: Patient = {
    id: Date.now(),
    patientCode: `PAT-202607-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    dateOfBirth: input.dateOfBirth,
    age: age < 0 ? 0 : age,
    gender: Number(input.gender) as Gender,
    genderName: Number(input.gender) === Gender.Male ? 'Male' : Number(input.gender) === Gender.Female ? 'Female' : 'Other',
    address: input.address.trim(),
    bloodGroup: input.bloodGroup.trim(),
    emergencyContact: input.emergencyContact.trim(),
    medicalHistorySummary: input.medicalHistorySummary.trim(),
    createdAt: new Date().toISOString(),
  };

  list.unshift(newPatient);
  saveStoredPatients(list);
  return newPatient;
};

export const mockUpdatePatient = async (id: number, input: UpdatePatientInput): Promise<Patient> => {
  await new Promise((res) => setTimeout(res, 300));
  const list = getStoredPatients();

  const index = list.findIndex((p) => p.id === id);
  if (index === -1) {
    throw { status: 404, message: `Patient with ID ${id} not found.` };
  }

  // Check phone uniqueness
  const phoneExists = list.some((p) => p.id !== id && p.phone.trim() === input.phone.trim());
  if (phoneExists) {
    throw { status: 409, message: `A patient with phone number '${input.phone}' already exists.` };
  }

  const dobDate = new Date(input.dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dobDate.getFullYear();
  if (today < new Date(today.getFullYear(), dobDate.getMonth(), dobDate.getDate())) age--;

  const updated: Patient = {
    ...list[index],
    fullName: input.fullName.trim(),
    phone: input.phone.trim(),
    email: input.email.trim(),
    dateOfBirth: input.dateOfBirth,
    age: age < 0 ? 0 : age,
    gender: Number(input.gender) as Gender,
    genderName: Number(input.gender) === Gender.Male ? 'Male' : Number(input.gender) === Gender.Female ? 'Female' : 'Other',
    address: input.address.trim(),
    bloodGroup: input.bloodGroup.trim(),
    emergencyContact: input.emergencyContact.trim(),
    medicalHistorySummary: input.medicalHistorySummary.trim(),
    updatedAt: new Date().toISOString(),
  };

  list[index] = updated;
  saveStoredPatients(list);
  return updated;
};

export const mockDeletePatient = async (id: number): Promise<void> => {
  await new Promise((res) => setTimeout(res, 250));
  const list = getStoredPatients();
  const filtered = list.filter((p) => p.id !== id);
  if (list.length === filtered.length) {
    throw { status: 404, message: `Patient with ID ${id} not found.` };
  }
  saveStoredPatients(filtered);
};
