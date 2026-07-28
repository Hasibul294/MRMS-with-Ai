import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Filter, User, Stethoscope, RefreshCw, AlertCircle, RotateCcw, XCircle } from 'lucide-react';
import { useAppointments, useBookAppointment, useRescheduleAppointment, useCancelAppointment } from '../hooks/useAppointments';
import { AppointmentFormModal } from './AppointmentFormModal';
import { RescheduleModal } from './RescheduleModal';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { SearchInput } from '../../../components/ui/SearchInput';
import { INITIAL_DOCTORS } from '../../../services/mockBackend';
import { Appointment, AppointmentStatus } from '../../../types';
import { AppointmentFormValues } from '../schemas/appointmentSchema';

export const AppointmentList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [doctorFilter, setDoctorFilter] = useState<string>('');

  const { data: appointments = [], isLoading, isError, error, refetch } = useAppointments({
    status: statusFilter ? Number(statusFilter) : undefined,
    doctorId: doctorFilter ? Number(doctorFilter) : undefined,
    searchTerm: searchTerm || undefined,
  });

  const bookMutation = useBookAppointment();
  const rescheduleMutation = useRescheduleAppointment();
  const cancelMutation = useCancelAppointment();

  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const [appointmentToReschedule, setAppointmentToReschedule] = useState<Appointment | null>(null);

  const [formServerError, setFormServerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleBookSubmit = async (values: AppointmentFormValues) => {
    setFormServerError(null);
    try {
      await bookMutation.mutateAsync(values);
      showToast('Appointment booked successfully!');
      setIsBookModalOpen(false);
    } catch (err: any) {
      setFormServerError(err.message || 'Failed to book appointment. Please check availability.');
    }
  };

  const handleRescheduleSubmit = async (newDateTime: string, reason?: string) => {
    if (!appointmentToReschedule) return;
    setFormServerError(null);
    try {
      await rescheduleMutation.mutateAsync({ id: appointmentToReschedule.id, newDateTime, reason });
      showToast('Appointment rescheduled successfully!');
      setAppointmentToReschedule(null);
    } catch (err: any) {
      setFormServerError(err.message || 'Slot unavailable for rescheduling.');
    }
  };

  const handleCancel = async (id: number) => {
    try {
      await cancelMutation.mutateAsync(id);
      showToast('Appointment cancelled.');
    } catch (err: any) {
      showToast(err.message || 'Failed to cancel appointment.', 'error');
    }
  };

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
      {/* Toast Alert */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-2xl border text-sm font-semibold flex items-center gap-3 animate-fade-in ${
            toastMessage.type === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          <span>{toastMessage.type === 'success' ? '✅' : '❌'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glass-panel rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Appointment Schedule</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {appointments.length} Total Bookings
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Book appointments, reschedule slots, and enforce doctor schedule collision prevention.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => {
            setFormServerError(null);
            setIsBookModalOpen(true);
          }}
        >
          Schedule Appointment
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-card rounded-xl">
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search patient, doctor, reason..."
        />

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>

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

          <select
            value={doctorFilter}
            onChange={(e) => setDoctorFilter(e.target.value)}
            className="bg-slate-900/90 text-slate-200 text-xs rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Doctors</option>
            {INITIAL_DOCTORS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.fullName}
              </option>
            ))}
          </select>

          <Button variant="ghost" size="sm" onClick={() => refetch()} title="Refresh Data">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
            <p className="text-sm text-slate-400">Loading appointment schedules...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300 font-medium">{(error as any)?.message || 'Failed to load appointments'}</p>
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              📅
            </div>
            <h4 className="text-base font-semibold text-slate-200">No Appointments Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No matching scheduled visits found for the selected filters.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Date & Time</th>
                  <th className="px-5 py-3.5">Patient</th>
                  <th className="px-5 py-3.5">Assigned Doctor</th>
                  <th className="px-5 py-3.5">Reason for Visit</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {appointments.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs text-sky-400 font-medium">
                      <div className="flex items-center gap-1.5">
                        <CalendarIcon className="w-3.5 h-3.5 text-sky-500" />
                        {new Date(app.appointmentDateTime).toLocaleString([], {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
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
                    <td className="px-5 py-4 text-right">
                      {app.status === AppointmentStatus.Scheduled && (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFormServerError(null);
                              setAppointmentToReschedule(app);
                            }}
                            leftIcon={<RotateCcw className="w-3.5 h-3.5 text-amber-400" />}
                          >
                            Reschedule
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCancel(app.id)}
                            leftIcon={<XCircle className="w-3.5 h-3.5 text-rose-400" />}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      <AppointmentFormModal
        isOpen={isBookModalOpen}
        onClose={() => setIsBookModalOpen(false)}
        onSubmit={handleBookSubmit}
        isLoading={bookMutation.isPending}
        serverError={formServerError}
      />

      {/* Reschedule Modal */}
      <RescheduleModal
        isOpen={!!appointmentToReschedule}
        onClose={() => setAppointmentToReschedule(null)}
        onConfirm={handleRescheduleSubmit}
        appointment={appointmentToReschedule}
        isLoading={rescheduleMutation.isPending}
        serverError={formServerError}
      />
    </div>
  );
};
