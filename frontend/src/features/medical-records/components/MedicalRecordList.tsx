import React, { useState } from 'react';
import { FileText, Lock, Plus, Activity, Pill, RefreshCw, AlertCircle, Edit, ShieldAlert } from 'lucide-react';
import { useMedicalRecords, useCreateMedicalRecord, useUpdateMedicalRecord } from '../hooks/useMedicalRecords';
import { MedicalRecordFormModal } from './MedicalRecordFormModal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { MedicalRecord } from '../../../types';
import { MedicalRecordFormValues } from '../schemas/medicalRecordSchema';

export const MedicalRecordList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const { data: records = [], isLoading, isError, error, refetch } = useMedicalRecords();

  const createMutation = useCreateMedicalRecord();
  const updateMutation = useUpdateMedicalRecord();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [formServerError, setFormServerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      (r.patientName?.toLowerCase().includes(term) ?? false) ||
      (r.doctorName?.toLowerCase().includes(term) ?? false) ||
      r.diagnosis.toLowerCase().includes(term)
    );
  });

  const handleFormSubmit = async (values: MedicalRecordFormValues) => {
    setFormServerError(null);
    try {
      await createMutation.mutateAsync(values);
      showToast('New clinical medical record created successfully!');
      setIsFormModalOpen(false);
    } catch (err: any) {
      setFormServerError(err.message || 'Failed to save medical record.');
    }
  };

  const handleAttemptEdit = (record: MedicalRecord) => {
    showToast(`🔒 Record #${record.id} is locked. Only Admin role can modify clinical records once saved.`, 'error');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-3 animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✅' : '🔒'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glass-panel rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Electronic Medical Records (EMR)</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              {records.length} Recorded
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Maintain diagnoses, clinical observations, vitals, and prescription histories with immutability protection.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setFormServerError(null);
            setIsFormModalOpen(true);
          }}
        >
          New Clinical Record
        </Button>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center justify-between gap-4 p-4 glass-card rounded-xl">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search patient, diagnosis, doctor..."
        />

        <Button variant="ghost" size="sm" onClick={() => refetch()} title="Refresh Data">
          <RefreshCw className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Records Feed */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-12 glass-panel rounded-2xl text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-400 mx-auto" />
            <p className="text-sm text-slate-400">Loading clinical medical records...</p>
          </div>
        ) : isError ? (
          <div className="p-8 glass-panel rounded-2xl text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300 font-medium">{(error as any)?.message || 'Failed to load medical records'}</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 glass-panel rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              📋
            </div>
            <h4 className="text-base font-semibold text-slate-200">No Clinical Records Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No matching medical history records found for your search query.
            </p>
          </div>
        ) : (
          filtered.map((record) => (
            <div
              key={record.id}
              className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-4 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-base font-bold text-slate-100">{record.patientName}</h4>
                    <Badge variant="info">Record #{record.id}</Badge>
                    {record.isLocked && (
                      <Badge variant="neutral">
                        <span className="flex items-center gap-1">
                          <Lock className="w-3 h-3 text-amber-400" /> Locked
                        </span>
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Attending Physician: <span className="text-slate-200 font-medium">{record.doctorName}</span> • Recorded: {new Date(record.createdAt).toLocaleString()}
                  </p>
                </div>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleAttemptEdit(record)}
                  title="Modify Record (Admin only)"
                >
                  <Edit className="w-4 h-4 text-slate-500 hover:text-amber-400" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Diagnosis
                  </div>
                  <p className="text-sm font-semibold text-slate-200">{record.diagnosis}</p>
                </div>

                <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5" /> Vital Signs
                  </div>
                  <p className="text-xs font-mono text-slate-300">{record.vitalSigns || 'Not recorded'}</p>
                </div>

                <div className="p-3.5 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                    <Pill className="w-3.5 h-3.5" /> Prescribed Medicines
                  </div>
                  <p className="text-xs text-slate-300 whitespace-pre-line leading-relaxed">
                    {record.prescriptionMedicines || 'No medicines prescribed.'}
                  </p>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-slate-950/40 p-3.5 rounded-xl border border-slate-800/80">
                <span className="font-semibold text-sky-400">Clinical Notes:</span> {record.clinicalNotes}
              </div>
            </div>
          ))
        )}
      </div>

      {/* New Medical Record Modal */}
      <MedicalRecordFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        isLoading={createMutation.isPending}
        serverError={formServerError}
      />
    </div>
  );
};
