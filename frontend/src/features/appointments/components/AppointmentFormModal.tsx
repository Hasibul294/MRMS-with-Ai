import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { appointmentFormSchema, AppointmentFormValues } from '../schemas/appointmentSchema';
import { patientService } from '../../../services/patientService';
import { getStoredPatients, INITIAL_DOCTORS } from '../../../services/mockBackend';
import { Patient } from '../../../types';

interface AppointmentFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: AppointmentFormValues) => Promise<void>;
  isLoading?: boolean;
  serverError?: string | null;
}

export const AppointmentFormModal: React.FC<AppointmentFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  serverError,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (isOpen) {
      patientService
        .getPatients({ pageNumber: 1, pageSize: 100 })
        .then((res) => {
          setPatients(res.items && res.items.length > 0 ? res.items : getStoredPatients());
        })
        .catch(() => {
          setPatients(getStoredPatients());
        });
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      patientId: 0,
      doctorId: 0,
      appointmentDateTime: '',
      reasonForVisit: '',
      notes: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      // Default to tomorrow 10:00 AM
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(10, 0, 0, 0);

      // Local ISO format for datetime-local input YYYY-MM-DDTHH:mm
      const localIso = new Date(tomorrow.getTime() - tomorrow.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      reset({
        patientId: patients.length > 0 ? patients[0].id : 0,
        doctorId: INITIAL_DOCTORS[0].id,
        appointmentDateTime: localIso,
        reasonForVisit: '',
        notes: '',
      });
    }
  }, [isOpen, patients, reset]);

  const handleFormSubmit = async (data: AppointmentFormValues) => {
    await onSubmit(data);
  };

  const patientOptions = [
    { label: '-- Select Patient --', value: 0 },
    ...patients.map((p) => ({
      label: `${p.fullName} (${p.patientCode} - ${p.phone})`,
      value: p.id,
    })),
  ];

  const doctorOptions = [
    { label: '-- Select Doctor --', value: 0 },
    ...INITIAL_DOCTORS.map((d) => ({
      label: `${d.fullName} (${d.specialization})`,
      value: d.id,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Schedule New Appointment"
      subtitle="Select patient, attending physician, and available slot"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
            ⚠️ {serverError}
          </div>
        )}

        <Select
          label="Patient"
          required
          options={patientOptions}
          error={errors.patientId?.message}
          {...register('patientId')}
        />

        <Select
          label="Attending Doctor"
          required
          options={doctorOptions}
          error={errors.doctorId?.message}
          {...register('doctorId')}
        />

        <Input
          label="Appointment Date & Time"
          type="datetime-local"
          required
          error={errors.appointmentDateTime?.message}
          {...register('appointmentDateTime')}
        />

        <Input
          label="Reason for Visit"
          placeholder="e.g. Annual Heart Checkup & ECG"
          required
          error={errors.reasonForVisit?.message}
          {...register('reasonForVisit')}
        />

        <Textarea
          label="Clinical Notes / Special Instructions"
          placeholder="e.g. Patient requested morning slot..."
          rows={3}
          error={errors.notes?.message}
          {...register('notes')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Confirm Booking
          </Button>
        </div>
      </form>
    </Modal>
  );
};
