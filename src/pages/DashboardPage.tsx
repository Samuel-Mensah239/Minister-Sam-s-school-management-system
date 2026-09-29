import React from 'react';
import {
  GraduationCap,
  Users2,
  Building2,
  CalendarCheck,
  Megaphone,
  Clock,
  ArrowRight,
  Plus,
  UserPlus,
  CalendarDays,
  FileCheck2,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { StatCard } from '../components/common/StatCard';
import { formatDate, formatDateTime } from '../utils/formatters';

interface DashboardPageProps {
  onNavigate: (tab: string) => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
  const {
    students,
    teachers,
    classes,
    attendance,
    announcements,
    activityLogs,
    activeRole,
    academicYear,
    currentTerm,
    timetables,
  } = useSchool();

  // Metrics
  const activeStudents = students.filter((s) => s.status === 'active').length;
  const activeTeachers = teachers.filter((t) => t.status === 'active').length;
  const totalClasses = classes.length;

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const totalAttRecords = attendance.length;
  const attendanceRate = totalAttRecords > 0
    ? Math.round(((presentCount + lateCount * 0.5) / totalAttRecords) * 100)
    : 94; // fallback baseline

  const publishedAnnouncements = announcements
    .filter((a) => a.status === 'published')
    .slice(0, 3);

  const activeTimetable = timetables.find((t) => t.status === 'published');

  return (
    <div className="space-y-6">
      {/* Institutional Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              <span>Minister Sam Academy · Academic Portal</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Institutional Operations & Oversight
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Active Session: <strong className="text-white">{academicYear} ({currentTerm})</strong>. Standardized administrative workflows for academic timetabling, student registration, faculty rosters, and automated grade evaluations.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
            <button
              onClick={() => onNavigate('timetable')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-slate-950 bg-amber-400 rounded-lg hover:bg-amber-300 transition-colors shadow-xs"
            >
              <CalendarDays className="w-4 h-4" />
              <span>Manage Timetable</span>
            </button>
            <button
              onClick={() => onNavigate('attendance')}
              className="flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-800 border border-slate-700 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Mark Attendance</span>
            </button>
          </div>
        </div>

        {/* Subtle Decorative Pattern */}
        <div className="absolute right-0 bottom-0 opacity-5 pointer-events-none transform translate-x-12 translate-y-12">
          <BookOpen className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Students"
          value={activeStudents}
          subtext={`${students.length - activeStudents} inactive / on-leave`}
          icon={GraduationCap}
          trend={{ value: '+4.2% term growth', isPositive: true }}
        />
        <StatCard
          label="Active Faculty"
          value={activeTeachers}
          subtext={`${teachers.length} certified instructors`}
          icon={Users2}
          trend={{ value: 'Full capacity', isPositive: true }}
        />
        <StatCard
          label="Academic Classes"
          value={totalClasses}
          subtext="Grades 10 through 12"
          icon={Building2}
        />
        <StatCard
          label="Attendance Rate"
          value={`${attendanceRate}%`}
          subtext="Current academic term average"
          icon={CalendarCheck}
          trend={{ value: '+1.5% vs last term', isPositive: true }}
        />
      </div>

      {/* Main Grid: Announcements, Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Announcements & Operations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Actions Panel */}
          <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
              Core Administrative Actions
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <button
                onClick={() => onNavigate('students')}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <UserPlus className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Enroll Student</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Registration record</span>
              </button>

              <button
                onClick={() => onNavigate('timetable')}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CalendarDays className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Schedule Slot</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Conflict validator</span>
              </button>

              <button
                onClick={() => onNavigate('attendance')}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <CalendarCheck className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Roll-Call</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Daily register</span>
              </button>

              <button
                onClick={() => onNavigate('results')}
                className="flex flex-col items-center justify-center p-3.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-center transition-colors group"
              >
                <div className="w-9 h-9 rounded-lg bg-slate-900 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                  <FileCheck2 className="w-4 h-4" />
                </div>
                <span className="text-xs font-bold text-slate-800">Log Scores</span>
                <span className="text-[10px] text-slate-500 mt-0.5">Automated GPA</span>
              </button>
            </div>
          </div>

          {/* Recent Announcements Board */}
          <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Official Institutional Announcements
                </h3>
              </div>
              <button
                onClick={() => onNavigate('announcements')}
                className="flex items-center gap-1 text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {publishedAnnouncements.map((announcement) => (
                <div key={announcement.id} className="p-4 hover:bg-slate-50/60 transition-colors">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                      {announcement.title}
                    </h4>
                    <div className="text-[11px] text-slate-400 font-mono shrink-0">
                      {formatDate(announcement.date)}
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {announcement.content}
                  </p>
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] text-slate-400">
                    <span className="font-medium text-slate-600">{announcement.authorName}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">{announcement.authorRole}</span>
                    <span aria-hidden="true">·</span>
                    <span className="capitalize">Target: {announcement.targetAudience}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Timetable Status & Recent Activity Stream */}
        <div className="space-y-6">
          {/* Active Timetable Card */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Active Master Schedule
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded">
                Published
              </span>
            </div>

            {activeTimetable ? (
              <div className="space-y-2 text-xs">
                <div className="font-bold text-slate-900 text-sm">
                  {activeTimetable.name}
                </div>
                <div className="flex items-center justify-between text-slate-500 pt-1 border-t border-slate-100">
                  <span>Term:</span>
                  <span className="font-medium text-slate-800">{activeTimetable.term}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>Effective Date:</span>
                  <span className="font-mono text-slate-800">{formatDate(activeTimetable.effectiveDate)}</span>
                </div>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate('timetable')}
                    className="w-full py-2 text-xs font-semibold text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-center"
                  >
                    Open Weekly Schedule Matrix
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic">No published timetable active.</p>
            )}
          </div>

          {/* Institutional Audit Activity Stream */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Audit Activity Stream
                </h3>
              </div>
            </div>

            <div className="p-4 space-y-4 max-h-[360px] overflow-y-auto">
              {activityLogs.slice(0, 6).map((log) => (
                <div key={log.id} className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-slate-400 mt-1.5 shrink-0" />
                  <div className="flex-1 space-y-0.5">
                    <p className="text-slate-800 leading-snug">
                      <strong className="font-semibold text-slate-900">{log.user}</strong>{' '}
                      <span className="text-slate-600">{log.action.toLowerCase()}</span>{' '}
                      <span className="font-medium text-slate-900">{log.target}</span>
                    </p>
                    <div className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(log.timestamp)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
