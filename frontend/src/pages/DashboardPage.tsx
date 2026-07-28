import React from 'react';
import { Users, Calendar, FileText, Activity, TrendingUp, ShieldCheck, ArrowRight } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { getStoredPatients, getStoredAppointments, getStoredRecords } from '../services/mockBackend';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const patientsCount = getStoredPatients().length;
  const appointmentsCount = getStoredAppointments().length;
  const recordsCount = getStoredRecords().length;

  const stats = [
    { label: 'Total Registered Patients', count: patientsCount, icon: Users, color: 'sky', change: '+12% this month' },
    { label: 'Upcoming Appointments', count: appointmentsCount, icon: Calendar, color: 'amber', change: '2 slots today' },
    { label: 'Electronic Medical Records', count: recordsCount, icon: FileText, color: 'emerald', change: '100% Immutable' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden glass-panel p-6 sm:p-8 rounded-3xl border border-sky-500/20 bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40">
        <div className="relative z-10 space-y-3 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 text-sky-400 text-xs font-bold border border-sky-500/20">
            <Activity className="w-3.5 h-3.5" /> Clinical Command Dashboard
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">
            Patient Appointment & Medical Record Management System
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Architected with ASP.NET Core 8 Web API backend clean architecture & React Query server state management.
          </p>
          <div className="pt-2 flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => onNavigate('patients')} rightIcon={<ArrowRight className="w-4 h-4" />}>
              Manage Patients
            </Button>
            <Button variant="outline" onClick={() => onNavigate('appointments')}>
              View Appointments
            </Button>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">{stat.label}</span>
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-sky-400 border border-slate-700">
                  <Icon className="w-5 h-5" />
                </div>
              </div>
              <div className="text-3xl font-extrabold text-slate-100 font-mono">{stat.count}</div>
              <div className="text-xs text-sky-400 font-medium flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> {stat.change}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
