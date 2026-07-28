import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { medicalRecordService, CreateMedicalRecordInput } from '../../../services/medicalRecordService';

export const MEDICAL_RECORDS_QUERY_KEY = 'medical-records';

export const useMedicalRecords = (patientId?: number) => {
  return useQuery({
    queryKey: [MEDICAL_RECORDS_QUERY_KEY, patientId],
    queryFn: () => medicalRecordService.getMedicalRecords(patientId),
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateMedicalRecordInput) => medicalRecordService.createMedicalRecord(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_RECORDS_QUERY_KEY] });
    },
  });
};

export const useUpdateMedicalRecord = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      input,
      userRole,
    }: {
      id: number;
      input: { diagnosis: string; clinicalNotes: string; prescriptionMedicines?: string; vitalSigns?: string };
      userRole?: string;
    }) => medicalRecordService.updateMedicalRecord(id, input, userRole),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [MEDICAL_RECORDS_QUERY_KEY] });
    },
  });
};
