import React from 'react';
import { CalendarCheck, ShieldAlert } from 'lucide-react';
import { AttendanceRoster } from '../components/attendance/AttendanceRoster';
import { useSchool } from '../context/SchoolContext';

export const AttendancePage: React.FC = () => {
  const { academicYear, currentTerm } = useSchool();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Daily Academic Attendance Register
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Record student roll-call for individual academic subjects and homeroom divisions.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-slate-700">
          <CalendarCheck className="w-3.5 h-3.5 text-slate-500" />
          <span>{academicYear} · {currentTerm}</span>
        </div>
      </div>

      {/* Main interactive attendance roster */}
      <AttendanceRoster />
    </div>
  );
};
