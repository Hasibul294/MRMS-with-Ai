import React, { useState } from 'react';
import { UserPlus, Eye, Edit, Trash2, Filter, AlertCircle, RefreshCw } from 'lucide-react';
import { usePatients, useCreatePatient, useUpdatePatient, useDeletePatient } from '../hooks/usePatients';
import { PatientFormModal } from './PatientFormModal';
import { PatientDetailModal } from './PatientDetailModal';
import { SearchInput } from '../../../components/ui/SearchInput';
import { Select } from '../../../components/ui/Select';
import { Button } from '../../../components/ui/Button';
import { Badge } from '../../../components/ui/Badge';
import { Pagination } from '../../../components/ui/Pagination';
import { ConfirmDialog } from '../../../components/ui/ConfirmDialog';
import { Patient, Gender, GenderLabels, PatientFilter } from '../../../types';
import { PatientFormValues } from '../schemas/patientSchema';

export const PatientList: React.FC = () => {
  const [filter, setFilter] = useState<PatientFilter>({
    pageNumber: 1,
    pageSize: 8,
    searchTerm: '',
    gender: undefined,
    bloodGroup: undefined,
  });

  const { data: pagedData, isLoading, isError, error, refetch } = usePatients(filter);

  const createPatientMutation = useCreatePatient();
  const updatePatientMutation = useUpdatePatient();
  const deletePatientMutation = useDeletePatient();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [patientToEdit, setPatientToEdit] = useState<Patient | null>(null);
  const [patientToView, setPatientToView] = useState<Patient | null>(null);
  const [patientToDelete, setPatientToDelete] = useState<Patient | null>(null);

  const [formServerError, setFormServerError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSearchChange = (term: string) => {
    setFilter((prev) => ({ ...prev, searchTerm: term, pageNumber: 1 }));
  };

  const handleGenderFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value ? Number(e.target.value) : undefined;
    setFilter((prev) => ({ ...prev, gender: val, pageNumber: 1 }));
  };

  const handleBloodGroupFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value || undefined;
    setFilter((prev) => ({ ...prev, bloodGroup: val, pageNumber: 1 }));
  };

  const handleOpenCreateModal = () => {
    setPatientToEdit(null);
    setFormServerError(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (patient: Patient) => {
    setPatientToEdit(patient);
    setFormServerError(null);
    setIsFormModalOpen(true);
  };

  const handleFormSubmit = async (values: PatientFormValues) => {
    setFormServerError(null);
    try {
      if (patientToEdit) {
        await updatePatientMutation.mutateAsync({ id: patientToEdit.id, input: values });
        showToast(`Patient profile updated successfully.`);
      } else {
        await createPatientMutation.mutateAsync(values);
        showToast(`New patient registered successfully.`);
      }
      setIsFormModalOpen(false);
    } catch (err: any) {
      setFormServerError(err.message || 'Operation failed. Please check inputs.');
    }
  };

  const handleDeleteConfirm = async () => {
    if (!patientToDelete) return;
    try {
      await deletePatientMutation.mutateAsync(patientToDelete.id);
      showToast(`Patient '${patientToDelete.fullName}' soft-deleted.`);
      setPatientToDelete(null);
    } catch (err: any) {
      showToast(err.message || 'Failed to delete patient.', 'error');
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

      {/* Action Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 glass-panel rounded-2xl">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight text-slate-100 flex items-center gap-2">
            <span>Patient Registry</span>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
              {pagedData?.totalCount || 0} Total
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Search, filter, and manage electronic health records and patient profiles.
          </p>
        </div>

        <Button
          variant="primary"
          leftIcon={<UserPlus className="w-4 h-4" />}
          onClick={handleOpenCreateModal}
        >
          Register Patient
        </Button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 glass-card rounded-xl">
        <div className="w-full sm:w-auto">
          <SearchInput
            value={filter.searchTerm || ''}
            onChange={handleSearchChange}
            placeholder="Search name, phone, code..."
          />
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </div>

          <select
            value={filter.gender || ''}
            onChange={handleGenderFilter}
            className="bg-slate-900/90 text-slate-200 text-xs rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Genders</option>
            <option value={Gender.Male}>Male</option>
            <option value={Gender.Female}>Female</option>
            <option value={Gender.Other}>Other</option>
          </select>

          <select
            value={filter.bloodGroup || ''}
            onChange={handleBloodGroupFilter}
            className="bg-slate-900/90 text-slate-200 text-xs rounded-lg border border-slate-800 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All Blood Types</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>

          <Button variant="ghost" size="sm" onClick={() => refetch()} title="Refresh Data">
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Main Patients Table */}
      <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 animate-spin text-sky-400 mx-auto" />
            <p className="text-sm text-slate-400">Loading patients database...</p>
          </div>
        ) : isError ? (
          <div className="p-8 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-rose-400 mx-auto" />
            <p className="text-sm text-rose-300 font-medium">{(error as any)?.message || 'Failed to load patients'}</p>
            <Button variant="outline" size="sm" onClick={() => refetch()}>
              Retry
            </Button>
          </div>
        ) : pagedData?.items.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-500">
              👤
            </div>
            <h4 className="text-base font-semibold text-slate-200">No Patients Found</h4>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No matching records found for the applied search filters or search criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300 border-collapse">
              <thead className="bg-slate-900/80 text-xs uppercase font-bold text-slate-400 tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Patient Code</th>
                  <th className="px-5 py-3.5">Full Name</th>
                  <th className="px-5 py-3.5">Phone / Email</th>
                  <th className="px-5 py-3.5">Age & Gender</th>
                  <th className="px-5 py-3.5">Blood Group</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {pagedData?.items.map((patient) => (
                  <tr key={patient.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-sky-400">
                      {patient.patientCode}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-100">
                      <div>{patient.fullName}</div>
                      <div className="text-xs text-slate-500 font-normal">
                        Registered: {new Date(patient.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-slate-200">{patient.phone}</div>
                      <div className="text-xs text-slate-400">{patient.email || '-'}</div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <span>{patient.age} yrs</span>
                        <Badge variant="info" size="sm">
                          {GenderLabels[patient.gender]}
                        </Badge>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      {patient.bloodGroup ? (
                        <Badge variant="warning" size="sm">
                          {patient.bloodGroup}
                        </Badge>
                      ) : (
                        <span className="text-slate-600">-</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPatientToView(patient)}
                          title="View Profile"
                        >
                          <Eye className="w-4 h-4 text-sky-400" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditModal(patient)}
                          title="Edit Profile"
                        >
                          <Edit className="w-4 h-4 text-amber-400" />
                        </Button>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPatientToDelete(patient)}
                          title="Soft Delete"
                        >
                          <Trash2 className="w-4 h-4 text-rose-400" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {pagedData && (
          <Pagination
            pageNumber={pagedData.pageNumber}
            totalPages={pagedData.totalPages}
            totalCount={pagedData.totalCount}
            pageSize={pagedData.pageSize}
            onPageChange={(page) => setFilter((prev) => ({ ...prev, pageNumber: page }))}
          />
        )}
      </div>

      {/* Patient Form Modal (Create / Edit) */}
      <PatientFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        patientToEdit={patientToEdit}
        isLoading={createPatientMutation.isPending || updatePatientMutation.isPending}
        serverError={formServerError}
      />

      {/* Patient Detail Drawer / Modal */}
      <PatientDetailModal
        isOpen={!!patientToView}
        onClose={() => setPatientToView(null)}
        patient={patientToView}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmDialog
        isOpen={!!patientToDelete}
        onClose={() => setPatientToDelete(null)}
        onConfirm={handleDeleteConfirm}
        title="Confirm Soft Delete"
        message={`Are you sure you want to soft-delete patient '${patientToDelete?.fullName}' (${patientToDelete?.patientCode})? This action preserves record safety.`}
        isLoading={deletePatientMutation.isPending}
        confirmText="Soft Delete"
      />
    </div>
  );
};
