import React from 'react';
import { User, Phone, Mail, Calendar, MapPin, Activity, Heart, ShieldAlert, Clock } from 'lucide-react';
import { Modal } from '../../../components/ui/Modal';
import { Badge } from '../../../components/ui/Badge';
import { Patient, GenderLabels } from '../../../types';

interface PatientDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  patient: Patient | null;
}

export const PatientDetailModal: React.FC<PatientDetailModalProps> = ({
  isOpen,
  onClose,
  patient,
}) => {
  if (!patient) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Patient File: ${patient.fullName}`}
      subtitle={`Code: ${patient.patientCode}`}
      maxWidth="xl"
    >
      <div className="space-y-6">
        {/* Header Profile Summary */}
        <div className="flex items-center justify-between p-4 bg-slate-800/50 border border-slate-700/60 rounded-2xl">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-600/20 border border-sky-500/30 flex items-center justify-center text-sky-400 text-xl font-bold">
              {patient.fullName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-lg font-bold text-slate-100">{patient.fullName}</h4>
                <Badge variant="info">{GenderLabels[patient.gender]}</Badge>
                {patient.bloodGroup && <Badge variant="warning">{patient.bloodGroup}</Badge>}
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Age: {patient.age} years old ({new Date(patient.dateOfBirth).toLocaleDateString()})
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Phone className="w-4 h-4" /> Phone Number
            </div>
            <p className="text-sm font-medium text-slate-200">{patient.phone}</p>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <Mail className="w-4 h-4" /> Email Address
            </div>
            <p className="text-sm font-medium text-slate-200">{patient.email || 'Not provided'}</p>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
              <MapPin className="w-4 h-4" /> Home Address
            </div>
            <p className="text-sm font-medium text-slate-200">{patient.address || 'Not provided'}</p>
          </div>

          <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-rose-400">
              <ShieldAlert className="w-4 h-4" /> Emergency Contact
            </div>
            <p className="text-sm font-medium text-slate-200">{patient.emergencyContact || 'None'}</p>
          </div>
        </div>

        {/* Medical History */}
        <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400">
            <Activity className="w-4 h-4" /> Medical History & Notes
          </div>
          <p className="text-sm text-slate-300 whitespace-pre-line leading-relaxed">
            {patient.medicalHistorySummary || 'No significant medical history recorded.'}
          </p>
        </div>

        {/* System Meta */}
        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-3 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Registered: {new Date(patient.createdAt).toLocaleString()}
          </span>
          {patient.updatedAt && (
            <span>Last Updated: {new Date(patient.updatedAt).toLocaleString()}</span>
          )}
        </div>
      </div>
    </Modal>
  );
};
