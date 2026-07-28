import React from 'react';
import { Users, Calendar, FileText, LayoutDashboard, Settings } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'patients', label: 'Patients Registry', icon: Users },
    { id: 'appointments', label: 'Appointments', icon: Calendar },
    { id: 'records', label: 'Medical Records', icon: FileText },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-950/60 p-4 hidden md:flex flex-col justify-between shrink-0">
      <div className="space-y-6">
        <div className="px-3 text-[11px] font-bold uppercase tracking-wider text-slate-500">
          Main Navigation
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'bg-sky-600/20 text-sky-400 border border-sky-500/30 shadow-lg shadow-sky-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-400' : 'text-slate-500'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      <div className="p-3.5 bg-slate-900/60 border border-slate-800/80 rounded-2xl space-y-2">
        <div className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
          <Settings className="w-3.5 h-3.5 text-sky-400" /> Stack Compliance
        </div>
        <p className="text-[11px] text-slate-400 leading-tight">
          React Query server state + Zod forms + ASP.NET Core 8 Web API Clean Architecture.
        </p>
      </div>
    </aside>
  );
};
