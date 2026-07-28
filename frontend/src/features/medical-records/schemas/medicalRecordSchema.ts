import { z } from 'zod';

export const medicalRecordFormSchema = z.object({
  patientId: z.coerce.number().min(1, 'Please select a patient.'),
  doctorId: z.coerce.number().min(1, 'Please select an attending doctor.'),
  appointmentId: z.coerce.number().optional().nullable(),
  diagnosis: z
    .string()
    .min(3, 'Diagnosis description must be at least 3 characters.')
    .max(500, 'Diagnosis description cannot exceed 500 characters.'),
  clinicalNotes: z
    .string()
    .min(5, 'Clinical notes must be at least 5 characters.'),
  prescriptionMedicines: z.string().optional().default(''),
  vitalSigns: z.string().optional().default(''),
});

export type MedicalRecordFormValues = z.infer<typeof medicalRecordFormSchema>;
