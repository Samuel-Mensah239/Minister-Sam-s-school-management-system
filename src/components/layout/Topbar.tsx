import React from 'react';
import { Menu, Bell, UserCircle, Sparkles } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { Role } from '../../types';

interface TopbarProps {
  currentTab: string;
  onOpenMobileSidebar: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ currentTab, onOpenMobileSidebar }) => {
  const { activeRole, setActiveRole, academicYear, currentTerm, announcements } = useSchool();

  const tabTitles: Record<string, string> = {
    dashboard: 'Academic Overview & Metrics',
    students: 'Student Directory & Records',
    teachers: 'Faculty & Teacher Management',
    classes: 'Classes & Curriculum Departments',
    attendance: 'Daily Attendance Register',
    results: 'Examinations & Student Performance',
    timetable: 'Master Academic Timetable Management',
    announcements: 'Official School Announcements',
    reports: 'Institutional Reports & Analytics',
    settings: 'Academy Configuration & Architecture',
  };

  const unreadAnnouncements = announcements.filter((a) => a.status === 'published').length;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 sm:px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Navigation Trigger & Page Context */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 focus:outline-hidden"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
            <span>Minister Sam Academy</span>
            <span aria-hidden="true">/</span>
            <span className="text-slate-700 capitalize">{currentTab}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
            {tabTitles[currentTab] || 'Portal'}
          </h1>
        </div>
      </div>

      {/* Zone 2: Middle Academic Context (Desktop) */}
      <div className="hidden md:flex items-center gap-3 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
        <span className="font-semibold text-slate-800">{academicYear}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span>{currentTerm}</span>
        <span aria-hidden="true" className="text-slate-300">·</span>
        <span className="text-emerald-700 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          Session Active
        </span>
      </div>

      {/* Zone 3: Interactive Role Switcher & User Profile */}
      <div className="flex items-center gap-3">
        {/* Role Switcher with clean label */}
        <div className="flex items-center gap-2">
          <label htmlFor="role-select" className="hidden sm:inline text-xs font-semibold text-slate-500">
            Role:
          </label>
          <select
            id="role-select"
            value={activeRole}
            onChange={(e) => setActiveRole(e.target.value as Role)}
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-2 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
          >
            <option value="administrator">Administrator</option>
            <option value="teacher">Teacher (Faculty)</option>
            <option value="student">Student</option>
            <option value="parent">Parent/Guardian</option>
          </select>
        </div>

        {/* Notifications Icon */}
        <div className="relative">
          <button
            className="p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg relative transition-colors"
            title={`${unreadAnnouncements} active announcements`}
          >
            <Bell className="w-4 h-4" />
            {unreadAnnouncements > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* User Identity Avatar */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-slate-900 text-amber-300 flex items-center justify-center font-bold text-xs">
            {activeRole === 'administrator' ? 'AD' : activeRole === 'teacher' ? 'TC' : activeRole === 'student' ? 'ST' : 'PR'}
          </div>
          <div className="hidden xl:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-800 leading-tight">
              {activeRole === 'administrator'
                ? 'Dr. Arthur Sterling'
                : activeRole === 'teacher'
                ? 'Prof. David Mensah'
                : activeRole === 'student'
                ? 'Alexander Cole'
                : 'Marcus Cole (Parent)'}
            </span>
            <span className="text-[10px] text-slate-500 capitalize">
              {activeRole}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
