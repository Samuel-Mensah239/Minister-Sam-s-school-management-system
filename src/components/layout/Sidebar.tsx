import React from 'react';
import {
  LayoutDashboard,
  GraduationCap,
  Users2,
  Building2,
  CalendarCheck,
  FileSpreadsheet,
  CalendarDays,
  Megaphone,
  BarChart3,
  Settings,
  X,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpenMobile,
  onCloseMobile,
}) => {
  const { activeRole } = useSchool();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: ['administrator', 'teacher', 'student', 'parent'] },
    { id: 'students', label: 'Students', icon: GraduationCap, roles: ['administrator', 'teacher'] },
    { id: 'teachers', label: 'Teachers', icon: Users2, roles: ['administrator'] },
    { id: 'classes', label: 'Classes & Subjects', icon: Building2, roles: ['administrator', 'teacher'] },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: ['administrator', 'teacher'] },
    { id: 'results', label: 'Examination & Results', icon: FileSpreadsheet, roles: ['administrator', 'teacher', 'student', 'parent'] },
    { id: 'timetable', label: 'Timetable Management', icon: CalendarDays, roles: ['administrator', 'teacher', 'student', 'parent'] },
    { id: 'announcements', label: 'Announcements', icon: Megaphone, roles: ['administrator', 'teacher', 'student', 'parent'] },
    { id: 'reports', label: 'Reports & Analytics', icon: BarChart3, roles: ['administrator', 'teacher'] },
    { id: 'settings', label: 'Academy Settings', icon: Settings, roles: ['administrator'] },
  ];

  // Filter items visible to current role
  const visibleItems = navItems.filter((item) => item.roles.includes(activeRole));

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
              <img
                src="/src/assets/images/msa_school_crest_1790646026542.jpg"
                alt="MSA Crest"
                className="w-full h-full object-cover"
                onError={(e) => {
                  // Fallback to stylized SVG icon if image fails
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <BookOpen className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm tracking-tight text-white flex items-center gap-1.5">
                Minister Sam Academy
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                MSA Portal · v1.0
              </span>
            </div>
          </div>
          <button
            onClick={onCloseMobile}
            className="lg:hidden text-slate-400 hover:text-white p-1 rounded-md"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Role Context Chip */}
        <div className="px-5 py-2.5 bg-slate-950/60 border-b border-slate-800/60 flex items-center justify-between text-xs">
          <span className="text-slate-400">Current Role</span>
          <div className="flex items-center gap-1.5 font-medium text-amber-400 capitalize">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{activeRole}</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {visibleItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-normal transition-colors text-left ${
                  isActive
                    ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30'
                    : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Institutional Academic Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40 text-[11px] text-slate-400 leading-snug">
          <div className="flex items-center justify-between text-slate-300 font-medium mb-1">
            <span>Academic Session</span>
            <span className="font-mono text-slate-400">2026/2027</span>
          </div>
          <div className="text-slate-400">First Term · Week 4</div>
          <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-800/50 pt-1.5">
            Architectural Prototype for Mentorship Review
          </div>
        </div>
      </aside>
    </>
  );
};
