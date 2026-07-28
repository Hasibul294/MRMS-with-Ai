import React from 'react';
import { Activity, Bell, User, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-600 to-cyan-400 flex items-center justify-center shadow-lg shadow-sky-500/20 text-white font-black text-lg">
          ➕
        </div>
        <div>
          <h1 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
            MRMS Portal <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-400 font-mono font-bold">v1.0</span>
          </h1>
          <p className="text-[11px] text-slate-400 hidden sm:block">Patient Appointment & Medical Record System</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500 animate-ping" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-sky-500" />
        </button>

        <div className="h-6 w-px bg-slate-800" />

        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 font-bold text-xs">
            DR
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
              Dr. Sarah Jenkins <ShieldCheck className="w-3 h-3 text-sky-400" />
            </div>
            <div className="text-[10px] text-slate-400">Chief Medical Officer (Admin)</div>
          </div>
        </div>
      </div>
    </header>
  );
};
