import { z } from 'zod';

export const appointmentFormSchema = z.object({
  patientId: z.coerce.number().min(1, 'Please select a patient.'),
  doctorId: z.coerce.number().min(1, 'Please select a doctor.'),
  appointmentDateTime: z
    .string()
    .min(1, 'Appointment date and time is required.')
    .refine((val) => {
      const selected = new Date(val);
      const now = new Date();
      // Allow slight 5 min buffer for form submission time
      return selected.getTime() >= now.getTime() - 5 * 60 * 1000;
    }, 'Appointment date and time cannot be in the past.'),
  reasonForVisit: z
    .string()
    .min(2, 'Reason for visit must be at least 2 characters.')
    .max(250, 'Reason for visit cannot exceed 250 characters.'),
  notes: z.string().optional().default(''),
});

export type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

export const rescheduleSchema = z.object({
  newAppointmentDateTime: z
    .string()
    .min(1, 'New appointment date and time is required.')
    .refine((val) => {
      const selected = new Date(val);
      const now = new Date();
      return selected.getTime() >= now.getTime() - 5 * 60 * 1000;
    }, 'Rescheduled date cannot be in the past.'),
  reason: z.string().optional().default(''),
});

export type RescheduleFormValues = z.infer<typeof rescheduleSchema>;
