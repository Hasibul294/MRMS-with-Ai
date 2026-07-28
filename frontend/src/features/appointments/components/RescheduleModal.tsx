import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { rescheduleSchema, RescheduleFormValues } from '../schemas/appointmentSchema';
import { Appointment } from '../../../types';

interface RescheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (newDateTime: string, reason?: string) => Promise<void>;
  appointment: Appointment | null;
  isLoading?: boolean;
  serverError?: string | null;
}

export const RescheduleModal: React.FC<RescheduleModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  appointment,
  isLoading = false,
  serverError,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RescheduleFormValues>({
    resolver: zodResolver(rescheduleSchema),
    defaultValues: {
      newAppointmentDateTime: '',
      reason: '',
    },
  });

  useEffect(() => {
    if (appointment && isOpen) {
      const dateObj = new Date(appointment.appointmentDateTime);
      const localIso = new Date(dateObj.getTime() - dateObj.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);

      reset({
        newAppointmentDateTime: localIso,
        reason: '',
      });
    }
  }, [appointment, isOpen, reset]);

  const handleFormSubmit = async (data: RescheduleFormValues) => {
    await onConfirm(data.newAppointmentDateTime, data.reason);
  };

  if (!appointment) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Reschedule Appointment (#${appointment.id})`}
      subtitle={`Patient: ${appointment.patientName} | Doctor: ${appointment.doctorName}`}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
            ⚠️ {serverError}
          </div>
        )}

        <Input
          label="New Date & Time"
          type="datetime-local"
          required
          error={errors.newAppointmentDateTime?.message}
          {...register('newAppointmentDateTime')}
        />

        <Textarea
          label="Reason for Rescheduling"
          placeholder="e.g. Doctor schedule change or patient request..."
          rows={3}
          error={errors.reason?.message}
          {...register('reason')}
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Confirm Reschedule
          </Button>
        </div>
      </form>
    </Modal>
  );
};
