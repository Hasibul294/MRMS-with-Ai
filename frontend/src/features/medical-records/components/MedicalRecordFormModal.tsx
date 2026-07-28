import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Select } from '../../../components/ui/Select';
import { Textarea } from '../../../components/ui/Textarea';
import { Button } from '../../../components/ui/Button';
import { medicalRecordFormSchema, MedicalRecordFormValues } from '../schemas/medicalRecordSchema';
import { getStoredPatients, INITIAL_DOCTORS } from '../../../services/mockBackend';
import { Patient } from '../../../types';

interface MedicalRecordFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (values: MedicalRecordFormValues) => Promise<void>;
  isLoading?: boolean;
  serverError?: string | null;
}

export const MedicalRecordFormModal: React.FC<MedicalRecordFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
  serverError,
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);

  useEffect(() => {
    if (isOpen) {
      setPatients(getStoredPatients());
    }
  }, [isOpen]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<MedicalRecordFormValues>({
    resolver: zodResolver(medicalRecordFormSchema),
    defaultValues: {
      patientId: 0,
      doctorId: 0,
      diagnosis: '',
      clinicalNotes: '',
      prescriptionMedicines: '',
      vitalSigns: 'BP: 120/80 mmHg | Pulse: 72 bpm | Temp: 98.6 F | SpO2: 98%',
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        patientId: patients.length > 0 ? patients[0].id : 0,
        doctorId: INITIAL_DOCTORS[0].id,
        diagnosis: '',
        clinicalNotes: '',
        prescriptionMedicines: '',
        vitalSigns: 'BP: 120/80 mmHg | Pulse: 72 bpm | Temp: 98.6 F | SpO2: 98%',
      });
    }
  }, [isOpen, patients, reset]);

  const handleFormSubmit = async (data: MedicalRecordFormValues) => {
    await onSubmit(data);
  };

  const patientOptions = [
    { label: '-- Select Patient --', value: 0 },
    ...patients.map((p) => ({
      label: `${p.fullName} (${p.patientCode})`,
      value: p.id,
    })),
  ];

  const doctorOptions = [
    { label: '-- Select Attending Doctor --', value: 0 },
    ...INITIAL_DOCTORS.map((d) => ({
      label: `${d.fullName} (${d.specialization})`,
      value: d.id,
    })),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create New Clinical Medical Record"
      subtitle="Document diagnosis, clinical observations, vitals, and prescribed medicines"
      maxWidth="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {serverError && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium">
            ⚠️ {serverError}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        </div>

        <Input
          label="Diagnosis Summary"
          placeholder="e.g. Mild Sinusitis / Type 2 Diabetes Mellitus"
          required
          error={errors.diagnosis?.message}
          {...register('diagnosis')}
        />

        <Textarea
          label="Clinical Observations & Examination Notes"
          placeholder="Detailed clinical notes, symptoms reported, and physical findings..."
          rows={3}
          required
          error={errors.clinicalNotes?.message}
          {...register('clinicalNotes')}
        />

        <Input
          label="Vital Signs"
          placeholder="BP, Pulse, Temp, SpO2..."
          error={errors.vitalSigns?.message}
          {...register('vitalSigns')}
        />

        <Textarea
          label="Prescribed Medicines & Dosage Instructions"
          placeholder="e.g. 1. Tab. Amoxicillin 500mg - 1-0-1 after meals (5 days)..."
          rows={3}
          error={errors.prescriptionMedicines?.message}
          {...register('prescriptionMedicines')}
        />

        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-300 text-xs flex items-center gap-2">
          <span>🔒 Note: Created clinical records are locked for immutability and record integrity.</span>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button variant="outline" type="button" onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="primary" type="submit" isLoading={isLoading}>
            Save Clinical Record
          </Button>
        </div>
      </form>
    </Modal>
  );
};
