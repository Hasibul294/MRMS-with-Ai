import { apiClient } from './apiClient';
import { Patient, CreatePatientInput, UpdatePatientInput, PatientFilter, PagedResult } from '../types';
import { mockFetchPatients, mockCreatePatient, mockUpdatePatient, mockDeletePatient, getStoredPatients } from './mockBackend';

export const patientService = {
  async getPatients(filter: PatientFilter): Promise<PagedResult<Patient>> {
    try {
      const response = await apiClient.get<PagedResult<Patient>>('/patients', { params: filter });
      return response.data;
    } catch (err: any) {
      if (err.status === 0 || !err.status) {
        return await mockFetchPatients(filter);
      }
      throw err;
    }
  },

  async getPatientById(id: number): Promise<Patient> {
    try {
      const response = await apiClient.get<Patient>(`/patients/${id}`);
      return response.data;
    } catch (err: any) {
      if (err.status === 0 || !err.status) {
        const patients = getStoredPatients();
        const found = patients.find((p) => p.id === id);
        if (!found) throw { status: 404, message: `Patient with ID ${id} not found.` };
        return found;
      }
      throw err;
    }
  },

  async createPatient(input: CreatePatientInput): Promise<Patient> {
    try {
      const response = await apiClient.post<Patient>('/patients', input);
      return response.data;
    } catch (err: any) {
      if (err.status === 0 || !err.status) {
        return await mockCreatePatient(input);
      }
      throw err;
    }
  },

  async updatePatient(id: number, input: UpdatePatientInput): Promise<Patient> {
    try {
      const response = await apiClient.put<Patient>(`/patients/${id}`, input);
      return response.data;
    } catch (err: any) {
      if (err.status === 0 || !err.status) {
        return await mockUpdatePatient(id, input);
      }
      throw err;
    }
  },

  async deletePatient(id: number): Promise<void> {
    try {
      await apiClient.delete(`/patients/${id}`);
    } catch (err: any) {
      if (err.status === 0 || !err.status) {
        return await mockDeletePatient(id);
      }
      throw err;
    }
  },
};
