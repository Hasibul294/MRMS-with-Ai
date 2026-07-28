import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardPage } from './pages/DashboardPage';
import { PatientList } from './features/patients/components/PatientList';
import { AppointmentList } from './features/appointments/components/AppointmentList';
import { MedicalRecordList } from './features/medical-records/components/MedicalRecordList';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('patients');

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage onNavigate={setActiveTab} />;
      case 'patients':
        return <PatientList />;
      case 'appointments':
        return <AppointmentList />;
      case 'records':
        return <MedicalRecordList />;
      default:
        return <PatientList />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Header />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default App;
