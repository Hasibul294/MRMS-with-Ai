import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { appointmentService, CreateAppointmentInput } from '../../../services/appointmentService';
import { AppointmentStatus } from '../../../types';

export const APPOINTMENTS_QUERY_KEY = 'appointments';

export const useAppointments = (params?: {
  patientId?: number;
  doctorId?: number;
  date?: string;
  status?: AppointmentStatus;
  searchTerm?: string;
}) => {
  return useQuery({
    queryKey: [APPOINTMENTS_QUERY_KEY, params],
    queryFn: () => appointmentService.getAppointments(params),
    staleTime: 1000 * 60 * 2, // 2 minutes
  });
};

export const useBookAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateAppointmentInput) => appointmentService.bookAppointment(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    },
  });
};

export const useRescheduleAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, newDateTime, reason }: { id: number; newDateTime: string; reason?: string }) =>
      appointmentService.rescheduleAppointment(id, newDateTime, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    },
  });
};

export const useCancelAppointment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => appointmentService.cancelAppointment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [APPOINTMENTS_QUERY_KEY] });
    },
  });
};
