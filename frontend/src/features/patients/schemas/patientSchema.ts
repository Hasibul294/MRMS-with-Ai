import { z } from 'zod';
import { Gender } from '../../../types';

export const patientFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full Name must be at least 2 characters.')
    .max(100, 'Full Name cannot exceed 100 characters.'),
  phone: z
    .string()
    .min(7, 'Phone number must be at least 7 digits.')
    .max(20, 'Phone number cannot exceed 20 characters.')
    .regex(/^\+?[0-9\s\-()]+$/, 'Invalid phone number format.'),
  email: z
    .string()
    .email('Invalid email address format.')
    .or(z.literal('')),
  dateOfBirth: z
    .string()
    .min(1, 'Date of birth is required.')
    .refine((val) => {
      const selected = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return selected <= today;
    }, 'Date of birth cannot be in the future.'),
  gender: z
    .number()
    .refine((val) => [Gender.Male, Gender.Female, Gender.Other].includes(val), {
      message: 'Please select a valid gender.',
    }),
  address: z.string().max(250, 'Address cannot exceed 250 characters.').optional().default(''),
  bloodGroup: z.string().optional().default(''),
  emergencyContact: z.string().optional().default(''),
  medicalHistorySummary: z.string().optional().default(''),
});

export type PatientFormValues = z.infer<typeof patientFormSchema>;
