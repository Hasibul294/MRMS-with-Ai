import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { patientFormSchema, PatientFormValues } from '../schemas/patientSchema';
import { Patient, Gender } from '../../../types';

interface PatientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: PatientFormValues) => Promise<void>;
  patientToEdit?: Patient | null;
  isLoading?: boolean;
  serverError?: string | null;
}

export const PatientFormModal: React.FC<PatientFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  patientToEdit,
  isLoading = false,
  serverError,
}) => {
  const isEditing = !!patientToEdit;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PatientFormValues>({
    resolver: zodResolver(patientFormSchema),
    defaultValues: {
      fullName: '',
      phone: '',
      email: '',
      dateOfBirth: '',
      gender: Gender.Male,
      address: '',
      bloodGroup: '',
      emergencyContact: '',
      medicalHistorySummary: '',
    },
  });

  useEffect(() => {
    if (patientToEdit) {
      reset({
        fullName: patientToEdit.fullName,
        phone: patientToEdit.phone,
        email: patientToEdit.email || '',
        dateOfBirth: patientToEdit.dateOfBirth.split('T')[0],
        gender: patientToEdit.gender,
        address: patientToEdit.address || '',
        bloodGroup: patientToEdit.bloodGroup || '',
        emergencyContact: patientToEdit.emergencyContact || '',
        medicalHistorySummary: patientToEdit.medicalHistorySummary || '',
      });
    } else {
      reset({
        fullName: '',
        phone: '',
        email: '',
        dateOfBirth: '',
        gender: Gender.Male,
        address: '',
        bloodGroup: '',
        emergencyContact: '',
        medicalHistorySummary: '',
      });
    }
  }, [patientToEdit, reset, isOpen]);

  const handleFormSubmit = async (data: PatientFormValues) => {
    await onSubmit(data);
  };

  const genderOptions = [
    { label: 'Male', value: Gender.Male },
    { label: 'Female', value: Gender.Female },
    { label: 'Other', value: Gender.Other },
  ];

  const bloodGroupOptions = [
    { label: 'Select Blood Group', value: '' },
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? `Edit Patient (${patientToEdit?.patientCode})` : 'Register New Patient'}
      subtitle={isEditing ? 'Update patient contact details and history' : 'Fill in patient information for registration'}
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
            ⚠️ {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Full Name"
            placeholder="e.g. Jane Doe"
            required
            error={errors.fullName?.message}
            {...register('fullName')}
          />

          <Input
            label="Phone Number"
            placeholder="e.g. +15550192834"
            required
            error={errors.phone?.message}
            {...register('phone')}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="jane@example.com"
            error={errors.email?.message}
            {...register('email')}
          />

          <Input
            label="Date of Birth"
            type="date"
            required
            error={errors.dateOfBirth?.message}
            {...register('dateOfBirth')}
          />

          <Select
            label="Gender"
            required
            options={genderOptions}
            error={errors.gender?.message}
            {...register('gender', { valueAsNumber: true })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select
            label="Blood Group"
            options={bloodGroupOptions}
            error={errors.bloodGroup?.message}
            {...register('bloodGroup')}
          />

          <Input
            label="Emergency Contact"
            placeholder="e.g. +15559876543 (Spouse)"
            error={errors.emergencyContact?.message}
            {...register('emergencyContact')}
          />
        </div>

        <Input
          label="Address"
          placeholder="Street, City, Zip Code"
          error={errors.address?.message}
          {...register('address')}
        />

        <Textarea
          label="Medical History Summary"
          placeholder="Allergies, chronic diseases, past surgeries, or active medications..."
          rows={3}
          error={errors.medicalHistorySummary?.message}
          {...register('medicalHistorySummary')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            {isEditing ? 'Save Changes' : 'Register Patient'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
