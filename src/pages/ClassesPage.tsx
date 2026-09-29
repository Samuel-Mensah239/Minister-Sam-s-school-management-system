import React, { useState } from 'react';
import {
  Building2,
  BookOpen,
  Users,
  MapPin,
  GraduationCap,
  Layers,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const ClassesPage: React.FC = () => {
  const { classes, subjects, students, teachers } = useSchool();
  const [activeTab, setActiveTab] = useState<'classes' | 'subjects'>('classes');

  return (
    <div className="space-y-5">
      {/* Header and Tab Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Academic Classes & Curriculum Subjects
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Configure institutional sections, room assignments, and academic departments.
          </p>
        </div>

        {/* Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-lg border border-slate-200">
          <button
            onClick={() => setActiveTab('classes')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'classes'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Academic Classes ({classes.length})
          </button>
          <button
            onClick={() => setActiveTab('subjects')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'subjects'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Curriculum Subjects ({subjects.length})
          </button>
        </div>
      </div>

      {/* Classes Grid */}
      {activeTab === 'classes' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const enrolled = students.filter((s) => s.classId === cls.id && s.status === 'active').length;
            const occupancyPct = Math.round((enrolled / cls.capacity) * 100);

            return (
              <div
                key={cls.id}
                className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                      {cls.code}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-500">
                      Grade {cls.gradeLevel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    {cls.name}
                  </h3>

                  <div className="mt-4 space-y-2 text-xs text-slate-600">
                    <div className="flex items-center gap-2">
                      <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>Form Tutor: <strong className="text-slate-800">{cls.classTeacherName}</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{cls.roomNumber}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-slate-500 font-medium">Class Capacity</span>
                    <span className="font-mono font-bold text-slate-900">
                      {enrolled} / {cls.capacity} ({occupancyPct}%)
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        occupancyPct > 90 ? 'bg-amber-500' : 'bg-slate-900'
                      }`}
                      style={{ width: `${Math.min(occupancyPct, 100)}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Subjects Table */
        <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Subject Code</th>
                  <th className="py-3 px-4">Course Name</th>
                  <th className="py-3 px-4">Department</th>
                  <th className="py-3 px-4 text-center">Credit Units</th>
                  <th className="py-3 px-4">Course Outline</th>
                  <th className="py-3 px-4">Assigned Faculty</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {subjects.map((subject) => {
                  const subjectTeachers = teachers.filter((t) => t.primarySubjectId === subject.id);

                  return (
                    <tr key={subject.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-slate-800">
                        {subject.code}
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {subject.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {subject.department}
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                        {subject.credits}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-sm truncate">
                        {subject.description}
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {subjectTeachers.length > 0 ? (
                          subjectTeachers.map((t) => t.fullName).join(', ')
                        ) : (
                          <span className="text-slate-400 italic">Rotational</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
