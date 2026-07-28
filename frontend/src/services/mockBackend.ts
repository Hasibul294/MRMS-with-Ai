import { Patient, CreatePatientInput, UpdatePatientInput, PatientFilter, PagedResult, Gender, Appointment, MedicalRecord, AppointmentStatus, Doctor } from '../types';

const PATIENTS_STORAGE_KEY = 'mrms_mock_patients_v1';
const APPOINTMENTS_STORAGE_KEY = 'mrms_mock_appointments_v1';
const RECORDS_STORAGE_KEY = 'mrms_mock_records_v1';

export const INITIAL_DOCTORS: Doctor[] = [
  { id: 1, fullName: 'Dr. Sarah Jenkins', specialization: 'Cardiology', phone: '+15550001111', email: 'sarah.j@mrms.org', licenseNumber: 'MED-8821' },
  { id: 2, fullName: 'Dr. Marcus Vance', specialization: 'Endocrinology', phone: '+15550002222', email: 'marcus.v@mrms.org', licenseNumber: 'MED-9932' },
  { id: 3, fullName: 'Dr. Emily Watson', specialization: 'Pediatrics', phone: '+15550003333', email: 'emily.w@mrms.org', licenseNumber: 'MED-4412' },
  { id: 4, fullName: 'Dr. Alexander Hayes', specialization: 'Neurology', phone: '+15550004444', email: 'alex.h@mrms.org', licenseNumber: 'MED-5509' },
];

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

// Patient Handlers
export const mockFetchPatients = async (filter: PatientFilter): Promise<PagedResult<Patient>> => {
  await new Promise((res) => setTimeout(res, 200));
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
  await new Promise((res) => setTimeout(res, 250));
  const list = getStoredPatients();

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
  await new Promise((res) => setTimeout(res, 250));
  const list = getStoredPatients();
  const index = list.findIndex((p) => p.id === id);
  if (index === -1) throw { status: 404, message: `Patient with ID ${id} not found.` };

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
  await new Promise((res) => setTimeout(res, 200));
  const list = getStoredPatients();
  const filtered = list.filter((p) => p.id !== id);
  saveStoredPatients(filtered);
};

// Appointment Handlers
export const mockCreateAppointment = async (input: {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  reasonForVisit: string;
  notes?: string;
}): Promise<Appointment> => {
  await new Promise((res) => setTimeout(res, 300));
  const appointments = getStoredAppointments();
  const patients = getStoredPatients();

  const patient = patients.find((p) => p.id === Number(input.patientId));
  if (!patient) throw { status: 404, message: `Selected Patient not found.` };

  const doctor = INITIAL_DOCTORS.find((d) => d.id === Number(input.doctorId));
  if (!doctor) throw { status: 404, message: `Selected Doctor not found.` };

  // Rule: Check slot collision for DoctorId + AppointmentDateTime
  const requestedTime = new Date(input.appointmentDateTime).getTime();
  const slotConflict = appointments.some(
    (a) =>
      a.doctorId === Number(input.doctorId) &&
      a.status !== AppointmentStatus.Cancelled &&
      Math.abs(new Date(a.appointmentDateTime).getTime() - requestedTime) < 15 * 60 * 1000 // 15 min window
  );

  if (slotConflict) {
    throw {
      status: 409,
      message: `Dr. ${doctor.fullName} already has a booked appointment near ${new Date(input.appointmentDateTime).toLocaleString()}. Please choose a different time slot.`,
    };
  }

  const newApp: Appointment = {
    id: Date.now(),
    patientId: patient.id,
    patientName: patient.fullName,
    doctorId: doctor.id,
    doctorName: `${doctor.fullName} (${doctor.specialization})`,
    appointmentDateTime: input.appointmentDateTime,
    status: AppointmentStatus.Scheduled,
    reasonForVisit: input.reasonForVisit.trim(),
    notes: input.notes?.trim() || '',
    createdAt: new Date().toISOString(),
  };

  appointments.unshift(newApp);
  saveStoredAppointments(appointments);
  return newApp;
};

export const mockRescheduleAppointment = async (id: number, newDateTime: string, reason?: string): Promise<Appointment> => {
  await new Promise((res) => setTimeout(res, 250));
  const appointments = getStoredAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) throw { status: 404, message: `Appointment not found.` };

  const app = appointments[index];
  const requestedTime = new Date(newDateTime).getTime();

  // Slot collision check excluding current appointment
  const slotConflict = appointments.some(
    (a) =>
      a.id !== id &&
      a.doctorId === app.doctorId &&
      a.status !== AppointmentStatus.Cancelled &&
      Math.abs(new Date(a.appointmentDateTime).getTime() - requestedTime) < 15 * 60 * 1000
  );

  if (slotConflict) {
    throw {
      status: 409,
      message: `Doctor is unavailable at ${new Date(newDateTime).toLocaleString()} due to an existing booking.`,
    };
  }

  appointments[index] = {
    ...app,
    appointmentDateTime: newDateTime,
    notes: reason ? `${app.notes} [Rescheduled: ${reason}]`.trim() : app.notes,
    status: AppointmentStatus.Scheduled,
  };

  saveStoredAppointments(appointments);
  return appointments[index];
};

export const mockCancelAppointment = async (id: number): Promise<Appointment> => {
  await new Promise((res) => setTimeout(res, 200));
  const appointments = getStoredAppointments();
  const index = appointments.findIndex((a) => a.id === id);
  if (index === -1) throw { status: 404, message: `Appointment not found.` };

  appointments[index].status = AppointmentStatus.Cancelled;
  saveStoredAppointments(appointments);
  return appointments[index];
};

// Medical Record Handlers
export const mockCreateMedicalRecord = async (input: {
  patientId: number;
  doctorId: number;
  appointmentId?: number | null;
  diagnosis: string;
  clinicalNotes: string;
  prescriptionMedicines?: string;
  vitalSigns?: string;
}): Promise<MedicalRecord> => {
  await new Promise((res) => setTimeout(res, 300));
  const records = getStoredRecords();
  const patients = getStoredPatients();

  const patient = patients.find((p) => p.id === Number(input.patientId));
  if (!patient) throw { status: 404, message: `Selected Patient not found.` };

  const doctor = INITIAL_DOCTORS.find((d) => d.id === Number(input.doctorId));
  if (!doctor) throw { status: 404, message: `Selected Doctor not found.` };

  const newRecord: MedicalRecord = {
    id: Date.now(),
    patientId: patient.id,
    patientName: patient.fullName,
    doctorId: doctor.id,
    doctorName: doctor.fullName,
    appointmentId: input.appointmentId || undefined,
    diagnosis: input.diagnosis.trim(),
    clinicalNotes: input.clinicalNotes.trim(),
    prescriptionMedicines: input.prescriptionMedicines?.trim() || '',
    vitalSigns: input.vitalSigns?.trim() || 'BP: 120/80 mmHg | Temp: 98.6 F',
    isLocked: true,
    createdAt: new Date().toISOString(),
  };

  records.unshift(newRecord);
  saveStoredRecords(records);
  return newRecord;
};

export const mockUpdateMedicalRecord = async (
  id: number,
  input: { diagnosis: string; clinicalNotes: string; prescriptionMedicines?: string; vitalSigns?: string },
  userRole: string = 'Doctor'
): Promise<MedicalRecord> => {
  await new Promise((res) => setTimeout(res, 250));
  if (userRole !== 'Admin') {
    throw { status: 403, message: `Unauthorized: Only Admin role can modify clinical records once created.` };
  }

  const records = getStoredRecords();
  const index = records.findIndex((r) => r.id === id);
  if (index === -1) throw { status: 404, message: `Medical Record not found.` };

  records[index] = {
    ...records[index],
    diagnosis: input.diagnosis.trim(),
    clinicalNotes: input.clinicalNotes.trim(),
    prescriptionMedicines: input.prescriptionMedicines?.trim() || records[index].prescriptionMedicines,
    vitalSigns: input.vitalSigns?.trim() || records[index].vitalSigns,
  };

  saveStoredRecords(records);
  return records[index];
};
