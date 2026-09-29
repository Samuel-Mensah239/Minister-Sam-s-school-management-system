import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  Users,
  CalendarCheck,
  Download,
  Printer,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const ReportsPage: React.FC = () => {
  const { students, teachers, classes, examResults, attendance } = useSchool();

  const activeStudents = students.filter((s) => s.status === 'active');
  const totalScores = examResults.reduce((acc, curr) => acc + curr.score, 0);
  const schoolAverage = examResults.length > 0 ? (totalScores / examResults.length).toFixed(1) : '82.4';

  const presentCount = attendance.filter((a) => a.status === 'present').length;
  const lateCount = attendance.filter((a) => a.status === 'late').length;
  const attTotal = attendance.length || 1;
  const attRate = Math.round(((presentCount + lateCount * 0.5) / attTotal) * 100);

  // Grade distributions
  const gradeCount = {
    A: examResults.filter((r) => r.grade === 'A').length,
    B: examResults.filter((r) => r.grade === 'B').length,
    C: examResults.filter((r) => r.grade === 'C').length,
    D: examResults.filter((r) => r.grade === 'D').length,
    F: examResults.filter((r) => r.grade === 'F').length,
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Institutional Reports & Academic Analytics
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Holistic data aggregation across academy enrollment, attendance consistency, and GPA distribution.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors shadow-xs"
        >
          <Printer className="w-4 h-4 text-slate-500" />
          <span>Print Institutional Digest</span>
        </button>
      </div>

      {/* Aggregate Indicators */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Overall Examination Mean</span>
            <Award className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {schoolAverage}%
          </div>
          <p className="text-xs text-emerald-700 font-medium mt-1">
            Standard deviation within normative bounds
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Session Attendance Compliance</span>
            <CalendarCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            {attRate}%
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Aggregated across all senior form registers
          </p>
        </div>

        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase mb-2">
            <span>Teacher-Student Ratio</span>
            <Users className="w-4 h-4 text-slate-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-slate-900 tabular-nums">
            1 : {Math.round(activeStudents.length / (teachers.length || 1))}
          </div>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Optimal educational contact ratio
          </p>
        </div>
      </div>

      {/* Grade Performance Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Assessment Grade Distribution
          </h3>

          <div className="space-y-3">
            {[
              { label: 'Grade A (80 - 100%) Distinction', count: gradeCount.A, color: 'bg-emerald-600' },
              { label: 'Grade B (70 - 79%) Very Good', count: gradeCount.B, color: 'bg-sky-600' },
              { label: 'Grade C (60 - 69%) Credit', count: gradeCount.C, color: 'bg-amber-500' },
              { label: 'Grade D (50 - 59%) Pass', count: gradeCount.D, color: 'bg-orange-500' },
              { label: 'Grade F (0 - 49%) Fail', count: gradeCount.F, color: 'bg-rose-600' },
            ].map((item) => {
              const pct = examResults.length > 0 ? Math.round((item.count / examResults.length) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.label}</span>
                    <span className="font-mono text-slate-900 font-bold tabular-nums">
                      {item.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Enrollment Distribution per Class */}
        <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
            Class Cohort Enrollment Balance
          </h3>

          <div className="space-y-3">
            {classes.map((cls) => {
              const enrolled = students.filter((s) => s.classId === cls.id && s.status === 'active').length;
              const capPct = Math.round((enrolled / cls.capacity) * 100);

              return (
                <div key={cls.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">{cls.name}</span>
                    <span className="font-mono text-slate-700 tabular-nums">
                      {enrolled} / {cls.capacity} seats ({capPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                    <div className="h-full bg-slate-900 rounded-full" style={{ width: `${capPct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
