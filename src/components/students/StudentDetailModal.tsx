import React from 'react';
import { X, Mail, Phone, MapPin, Calendar, BookOpen, Award, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Student } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { formatDate } from '../../utils/formatters';

interface StudentDetailModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
  onEdit: () => void;
}

export const StudentDetailModal: React.FC<StudentDetailModalProps> = ({
  isOpen,
  student,
  onClose,
  onEdit,
}) => {
  const { examResults, attendance } = useSchool();

  if (!isOpen || !student) return null;

  // Filter student-specific data
  const studentResults = examResults.filter((r) => r.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);

  const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
  const lateCount = studentAttendance.filter((a) => a.status === 'late').length;
  const absentCount = studentAttendance.filter((a) => a.status === 'absent').length;
  const totalAtt = studentAttendance.length;
  const attRate = totalAtt > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalAtt) * 100) : 95; // nominal default if new

  const averageScore = studentResults.length > 0
    ? Math.round(studentResults.reduce((acc, curr) => acc + curr.score, 0) / studentResults.length)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-2xl bg-white border border-slate-200 rounded-xl shadow-2xl my-8 overflow-hidden animate-in fade-in duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center">
              {student.firstName[0]}{student.lastName[0]}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 leading-tight">
                {student.fullName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                <span>{student.studentId}</span>
                <span aria-hidden="true">·</span>
                <span className="font-sans">{student.className}</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onEdit}
              className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Edit Record
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

        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Key Metrics Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200/70 rounded-xl">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Status</span>
              <span className={`text-xs font-semibold ${student.status === 'active' ? 'text-emerald-700' : 'text-slate-500'}`}>
                {student.status === 'active' ? 'Active Enrollment' : 'Inactive'}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Gender / DOB</span>
              <span className="text-xs text-slate-800">
                {student.gender} · {formatDate(student.dateOfBirth)}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Attendance</span>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                {attRate}% Rate
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Exam Average</span>
              <span className="text-xs font-bold text-slate-900 tabular-nums">
                {averageScore !== null ? `${averageScore}%` : 'Pending'}
              </span>
            </div>
          </div>

          {/* Guardian / Contact Info */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
              Parent & Guardian Contact
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-white border border-slate-200 rounded-lg p-3.5">
              <div className="space-y-1.5">
                <span className="text-slate-500 font-medium block">Guardian Name</span>
                <span className="font-semibold text-slate-900">{student.parentName}</span>
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-500 font-medium block">Phone Contact</span>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.parentPhone}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-500 font-medium block">Email Address</span>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.parentEmail || 'Not specified'}</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <span className="text-slate-500 font-medium block">Residential Address</span>
                <div className="flex items-center gap-1.5 text-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{student.address || 'Campus Residence / Day Student'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Academic Assessment History */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Recorded Assessment Results</span>
              </h3>
              <span className="text-xs text-slate-500">
                {studentResults.length} Subject Records
              </span>
            </div>

            {studentResults.length > 0 ? (
              <div className="border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                    <tr>
                      <th className="py-2.5 px-3">Subject</th>
                      <th className="py-2.5 px-3">Assessment Series</th>
                      <th className="py-2.5 px-3 text-right">Score</th>
                      <th className="py-2.5 px-3 text-center">Grade</th>
                      <th className="py-2.5 px-3">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {studentResults.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50">
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{r.subjectName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{r.examinationTitle}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{r.score}%</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">{r.grade}</td>
                        <td className="py-2.5 px-3 text-slate-500 truncate max-w-xs">{r.remarks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-xs text-slate-500 italic p-3 bg-slate-50 rounded-lg border border-slate-100">
                No formal examination scores logged yet for this academic term.
              </p>
            )}
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Enrolled on {formatDate(student.enrollmentDate)}</span>
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
