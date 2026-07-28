import React, { useState } from 'react';
import { Calendar, Clock, Plus, Filter, User, Stethoscope } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { getStoredAppointments, saveStoredAppointments } from '../../../services/mockBackend';
import { Appointment, AppointmentStatus, AppointmentStatusLabels } from '../../../types';

export const AppointmentList: React.FC = () => {
  const [appointments, setAppointments] = useState<Appointment[]>(getStoredAppointments());
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  const filtered = appointments.filter((app) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      !term ||
      (app.patientName?.toLowerCase().includes(term) ?? false) ||
      (app.doctorName?.toLowerCase().includes(term) ?? false) ||
      app.reasonForVisit.toLowerCase().includes(term);
    const matchesStatus = !statusFilter || String(app.status) === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case AppointmentStatus.Scheduled:
        return <Badge variant="info">Scheduled</Badge>;
      case AppointmentStatus.Completed:
        return <Badge variant="success">Completed</Badge>;
      case AppointmentStatus.Cancelled:
        return <Badge variant="error">Cancelled</Badge>;
      case AppointmentStatus.NoShow:
        return <Badge variant="warning">No Show</Badge>;
      default:
        return <Badge variant="neutral">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glass-panel rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Appointment Schedule</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {appointments.length} Booked
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Manage doctor availability, prevent duplicate slots, and track visit status.
          </p>
        </div>

        <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
          Schedule Appointment
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-card rounded-xl">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search patient, doctor, reason..."
        />

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900/90 text-slate-200 text-xs rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Statuses</option>
            <option value={AppointmentStatus.Scheduled}>Scheduled</option>
            <option value={AppointmentStatus.Completed}>Completed</option>
            <option value={AppointmentStatus.Cancelled}>Cancelled</option>
            <option value={AppointmentStatus.NoShow}>No Show</option>
          </select>
        </div>
      </div>

      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Date & Time</th>
                <th className="px-5 py-3.5">Patient</th>
                <th className="px-5 py-3.5">Assigned Doctor</th>
                <th className="px-5 py-3.5">Reason for Visit</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs text-sky-400 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-sky-500" />
                      {new Date(app.appointmentDateTime).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-100">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-slate-400" />
                      <span>{app.patientName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-200">
                    <div className="flex items-center gap-2">
                      <Stethoscope className="w-4 h-4 text-amber-400" />
                      <span>{app.doctorName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{app.reasonForVisit}</td>
                  <td className="px-5 py-4">{getStatusBadge(app.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
