import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientService } from '../../../services/patientService';
import { PatientFilter, CreatePatientInput, UpdatePatientInput } from '../../../types';

export const PATIENTS_QUERY_KEY = 'patients';

export const usePatients = (filter: PatientFilter) => {
  return useQuery({
    queryKey: [PATIENTS_QUERY_KEY, filter],
    queryFn: () => patientService.getPatients(filter),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
};

export const usePatient = (id: number | null) => {
  return useQuery({
    queryKey: [PATIENTS_QUERY_KEY, id],
    queryFn: () => (id ? patientService.getPatientById(id) : null),
    enabled: !!id,
  });
};

export const useCreatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreatePatientInput) => patientService.createPatient(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_QUERY_KEY] });
    },
  });
};

export const useUpdatePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdatePatientInput }) =>
      patientService.updatePatient(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_QUERY_KEY] });
    },
  });
};

export const useDeletePatient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => patientService.deletePatient(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [PATIENTS_QUERY_KEY] });
    },
  });
};
