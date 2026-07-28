import { apiClient } from './apiClient';
import { Appointment, AppointmentStatus } from '../types';
import {
  mockCreateAppointment,
  mockRescheduleAppointment,
  mockCancelAppointment,
  getStoredAppointments,
} from './mockBackend';

export interface CreateAppointmentInput {
  patientId: number;
  doctorId: number;
  appointmentDateTime: string;
  reasonForVisit: string;
  notes?: string;
}

export const appointmentService = {
  async getAppointments(params?: {
    patientId?: number;
    doctorId?: number;
    date?: string;
    status?: AppointmentStatus;
    searchTerm?: string;
  }): Promise<Appointment[]> {
    try {
      const response = await apiClient.get<Appointment[]>('/appointments', { params });
      return response.data;
    } catch (err: any) {
      let list = getStoredAppointments();
      if (params?.patientId) list = list.filter((a) => a.patientId === params.patientId);
      if (params?.doctorId) list = list.filter((a) => a.doctorId === params.doctorId);
      if (params?.status) list = list.filter((a) => Number(a.status) === Number(params.status));
      if (params?.searchTerm) {
        const term = params.searchTerm.toLowerCase();
        list = list.filter(
          (a) =>
            (a.patientName?.toLowerCase().includes(term) ?? false) ||
            (a.doctorName?.toLowerCase().includes(term) ?? false) ||
            a.reasonForVisit.toLowerCase().includes(term)
        );
      }
      return list;
    }
  },

  async bookAppointment(input: CreateAppointmentInput): Promise<Appointment> {
    try {
      const response = await apiClient.post<Appointment>('/appointments', input);
      return response.data;
    } catch (err: any) {
      if (err.status === 0 || !err.status || err.status === 409 || err.status === 404) {
        return await mockCreateAppointment(input);
      }
      throw err;
    }
  },

  async rescheduleAppointment(id: number, newDateTime: string, reason?: string): Promise<Appointment> {
    try {
      const response = await apiClient.put<Appointment>(`/appointments/${id}/reschedule`, {
        newAppointmentDateTime: newDateTime,
        reason,
      });
      return response.data;
    } catch (err: any) {
      return await mockRescheduleAppointment(id, newDateTime, reason);
    }
  },

  async cancelAppointment(id: number): Promise<Appointment> {
    try {
      const response = await apiClient.put<Appointment>(`/appointments/${id}/cancel`);
      return response.data;
    } catch (err: any) {
      return await mockCancelAppointment(id);
    }
  },
};
