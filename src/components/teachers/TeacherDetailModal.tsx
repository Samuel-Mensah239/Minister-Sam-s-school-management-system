import React from 'react';
import { X, Mail, Phone, Calendar, BookOpen, Clock, Building } from 'lucide-react';
import { Teacher } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { formatDate } from '../../utils/formatters';

interface TeacherDetailModalProps {
  isOpen: boolean;
  teacher: Teacher | null;
  onClose: () => void;
  onEdit: () => void;
}

export const TeacherDetailModal: React.FC<TeacherDetailModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onEdit,
}) => {
  const { timetableEntries } = useSchool();

  if (!isOpen || !teacher) return null;

  const scheduledLessons = timetableEntries.filter((e) => e.teacherId === teacher.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl my-8 overflow-hidden animate-in fade-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center">
              {teacher.firstName[0]}{teacher.lastName[0]}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {teacher.fullName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>{teacher.teacherId}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans text-slate-700">{teacher.primarySubjectName}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Edit Details
            </button>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-slate-700 p-1.5 rounded-md"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Info cards */}
          <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 border border-slate-200/70 rounded-xl p-4">
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Status</span>
              <span className={`font-semibold ${teacher.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}`}>
                {teacher.status === 'active' ? 'Active Faculty' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Class Teacher Assignment</span>
              <span className="font-semibold text-slate-800">
                {teacher.assignedClassName || 'Subject Specialist Only'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Email</span>
              <div className="flex items-center gap-1.5 text-slate-800 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{teacher.email}</span>
              </div>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px] mb-1">Phone</span>
              <div className="flex items-center gap-1.5 text-slate-800">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{teacher.phone}</span>
              </div>
            </div>
          </div>

          {/* Assigned Timetable Lessons */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-slate-600" />
                <span>Weekly Teaching Periods</span>
              </h3>
              <span className="text-xs text-slate-500 tabular-nums">
                {scheduledLessons.length} Scheduled Lessons
              </span>
            </div>

            {scheduledLessons.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Day & Time</th>
                      <th className="py-2.5 px-3">Class</th>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Room</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {scheduledLessons.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">
                          {l.day}, {l.startTime} - {l.endTime}
                        </td>
                        <td className="py-2.5 px-3 text-slate-700">{l.className}</td>
                        <td className="py-2.5 px-3 font-medium text-slate-900">{l.subjectName}</td>
                        <td className="py-2.5 px-3 text-slate-500">{l.room}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-100">
                No active timetable teaching slots currently allocated to this faculty member.
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Joined faculty on {formatDate(teacher.joinedDate)}</span>
          <button
            onClick={onClose}
            className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
