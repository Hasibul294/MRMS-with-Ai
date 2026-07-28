import { apiClient } from './apiClient';
import { MedicalRecord } from '../types';
import { mockCreateMedicalRecord, mockUpdateMedicalRecord, getStoredRecords } from './mockBackend';

export interface CreateMedicalRecordInput {
  patientId: number;
  doctorId: number;
  appointmentId?: number | null;
  diagnosis: string;
  clinicalNotes: string;
  prescriptionMedicines?: string;
  vitalSigns?: string;
}

export const medicalRecordService = {
  async getMedicalRecords(patientId?: number): Promise<MedicalRecord[]> {
    try {
      const url = patientId ? `/medical-records/patient/${patientId}` : '/medical-records';
      const response = await apiClient.get<MedicalRecord[]>(url);
      return response.data;
    } catch (err: any) {
      let list = getStoredRecords();
      if (patientId) list = list.filter((r) => r.patientId === patientId);
      return list;
    }
  },

  async createMedicalRecord(input: CreateMedicalRecordInput): Promise<MedicalRecord> {
    try {
      const response = await apiClient.post<MedicalRecord>('/medical-records', input);
      return response.data;
    } catch (err: any) {
      return await mockCreateMedicalRecord(input);
    }
  },

  async updateMedicalRecord(
    id: number,
    input: { diagnosis: string; clinicalNotes: string; prescriptionMedicines?: string; vitalSigns?: string },
    userRole: string = 'Doctor'
  ): Promise<MedicalRecord> {
    try {
      const response = await apiClient.put<MedicalRecord>(`/medical-records/${id}`, { ...input, userRole });
      return response.data;
    } catch (err: any) {
      return await mockUpdateMedicalRecord(id, input, userRole);
    }
  },
};
