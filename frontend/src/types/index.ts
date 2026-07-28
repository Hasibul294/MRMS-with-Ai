export enum Gender {
  Male = 1,
  Female = 2,
  Other = 3,
}

export const GenderLabels: Record<Gender, string> = {
  [Gender.Male]: 'Male',
  [Gender.Female]: 'Female',
  [Gender.Other]: 'Other',
};

export enum AppointmentStatus {
  Scheduled = 1,
  Completed = 2,
  Cancelled = 3,
  NoShow = 4,
}

export const AppointmentStatusLabels: Record<AppointmentStatus, string> = {
  [AppointmentStatus.Scheduled]: 'Scheduled',
  [AppointmentStatus.Completed]: 'Completed',
  [AppointmentStatus.Cancelled]: 'Cancelled',
  [AppointmentStatus.NoShow]: 'No Show',
};

export interface Patient {
  id: number;
  patientCode: string;
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string; // ISO String YYYY-MM-DD
  age: number;
  gender: Gender;
  genderName: string;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  medicalHistorySummary: string;
  createdAt: string;
  updatedAt?: string;
}

export interface CreatePatientInput {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  medicalHistorySummary: string;
}

export interface UpdatePatientInput {
  fullName: string;
  phone: string;
  email: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  bloodGroup: string;
  emergencyContact: string;
  medicalHistorySummary: string;
}

export interface PatientFilter {
  searchTerm?: string;
  gender?: Gender;
  bloodGroup?: string;
  pageNumber: number;
  pageSize: number;
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface Doctor {
  id: number;
  fullName: string;
  specialization: string;
  phone: string;
  email: string;
  licenseNumber: string;
}

export interface Appointment {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentDateTime: string;
  status: AppointmentStatus;
  reasonForVisit: string;
  notes: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: number;
  patientId: number;
  patientName?: string;
  doctorId: number;
  doctorName?: string;
  appointmentId?: number;
  diagnosis: string;
  clinicalNotes: string;
  prescriptionMedicines: string;
  vitalSigns: string;
  isLocked: boolean;
  createdAt: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  title: string;
  message: string;
  errors?: Record<string, string[]>;
}
