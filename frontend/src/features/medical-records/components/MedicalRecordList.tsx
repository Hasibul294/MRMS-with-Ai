import React, { useState } from 'react';
import { FileText, Lock, Plus, Search, Activity, Pill } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { getStoredRecords } from '../../../services/mockBackend';
import { MedicalRecord } from '../../../types';

export const MedicalRecordList: React.FC = () => {
  const [records, setRecords] = useState<MedicalRecord[]>(getStoredRecords());
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = records.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      !term ||
      (r.patientName?.toLowerCase().includes(term) ?? false) ||
      (r.doctorName?.toLowerCase().includes(term) ?? false) ||
      r.diagnosis.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glass-panel rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Electronic Medical Records (EMR)</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Immutable Core
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Clinical diagnosis, vital signs, and prescription history. Locked for immutability after creation.
          </p>
        </div>

        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          New Clinical Record
        </Button>
      </div>

      <div className="p-4 glass-card rounded-xl">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search patient, diagnosis, doctor..."
        />
      </div>

      <div className="space-y-4">
        {filtered.map((record) => (
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
                        <Lock className="w-3 h-3 text-amber-400" /> Immutable
                      </span>
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Attending Physician: <span className="text-slate-200 font-medium">{record.doctorName}</span> • Date: {new Date(record.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-semibold text-sky-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Diagnosis
                </div>
                <p className="text-sm font-semibold text-slate-200">{record.diagnosis}</p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Vital Signs
                </div>
                <p className="text-xs font-mono text-slate-300">{record.vitalSigns}</p>
              </div>

              <div className="p-3 bg-slate-900/60 border border-slate-800 rounded-xl space-y-1">
                <div className="text-xs font-semibold text-amber-400 flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5" /> Prescriptions
                </div>
                <p className="text-xs text-slate-300 whitespace-pre-line">{record.prescriptionMedicines}</p>
              </div>
            </div>

            <div className="text-xs text-slate-400 bg-slate-950/40 p-3 rounded-xl border border-slate-800/80">
              <span className="font-semibold text-slate-300">Clinical Notes:</span> {record.clinicalNotes}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
