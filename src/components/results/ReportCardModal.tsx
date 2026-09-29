import React, { useRef } from 'react';
import { X, Printer, Download, Award, CheckCircle2 } from 'lucide-react';
import { Student } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { formatDate } from '../../utils/formatters';

interface ReportCardModalProps {
  isOpen: boolean;
  student: Student | null;
  onClose: () => void;
}

export const ReportCardModal: React.FC<ReportCardModalProps> = ({
  isOpen,
  student,
  onClose,
}) => {
  const { examResults, attendance, academicYear, currentTerm } = useSchool();
  const reportRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !student) return null;

  const studentResults = examResults.filter((r) => r.studentId === student.id);
  const studentAttendance = attendance.filter((a) => a.studentId === student.id);

  const presentCount = studentAttendance.filter((a) => a.status === 'present').length;
  const lateCount = studentAttendance.filter((a) => a.status === 'late').length;
  const totalDays = Math.max(studentAttendance.length, 1);
  const attendancePct = Math.round(((presentCount + lateCount * 0.5) / totalDays) * 100);

  const totalScore = studentResults.reduce((acc, curr) => acc + curr.score, 0);
  const averageScore = studentResults.length > 0 ? (totalScore / studentResults.length).toFixed(1) : '0.0';
  const cumulativeGPA = studentResults.length > 0
    ? (studentResults.reduce((acc, curr) => acc + curr.gradePoint, 0) / studentResults.length).toFixed(2)
    : '0.00';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-3xl bg-white border border-slate-200 rounded-xl shadow-2xl my-8 overflow-hidden animate-in fade-in duration-150">
        {/* Modal Header (Non-printable) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <h2 className="text-sm font-bold text-slate-900">
              Student Terminal Report Card
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Dossier</span>
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

        {/* Printable Academic Report Body */}
        <div ref={reportRef} className="p-8 space-y-6 text-slate-900 max-h-[78vh] overflow-y-auto print:max-h-none print:p-0">
          {/* Institutional Crest and Header */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
                <img
                  src="/src/assets/images/msa_school_crest_1790646026542.jpg"
                  alt="Minister Sam Academy Crest"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h1 className="text-xl font-extrabold tracking-tight text-slate-950 uppercase">
                  Minister Sam Academy
                </h1>
                <p className="text-xs text-slate-600 font-medium">
                  Excellence, Character & Analytical Leadership
                </p>
                <p className="text-[11px] text-slate-500">
                  Campus Address: 12 Academy Boulevard, Victoria Hills · Contact: info@ministersam.edu
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="inline-block px-2.5 py-1 text-xs font-bold uppercase tracking-wider bg-slate-100 border border-slate-300 rounded">
                Official Transcript
              </div>
              <div className="mt-1 text-xs font-mono text-slate-600">
                {academicYear} · {currentTerm}
              </div>
            </div>
          </div>

          {/* Student Profile Metadata Box */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs">
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Candidate Name</span>
              <span className="font-bold text-slate-900">{student.fullName}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Student ID</span>
              <span className="font-mono font-bold text-slate-800">{student.studentId}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Class Division</span>
              <span className="font-semibold text-slate-800">{student.className}</span>
            </div>
            <div>
              <span className="text-slate-500 font-semibold block text-[10px] uppercase">Date of Birth</span>
              <span className="text-slate-800">{formatDate(student.dateOfBirth)}</span>
            </div>
          </div>

          {/* Performance Summary Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 border border-slate-200 rounded-lg text-center bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Average Score</span>
              <span className="text-xl font-bold font-mono text-slate-900">{averageScore}%</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg text-center bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Cumulative GPA</span>
              <span className="text-xl font-bold font-mono text-slate-900">{cumulativeGPA} / 4.0</span>
            </div>
            <div className="p-3 border border-slate-200 rounded-lg text-center bg-white">
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Session Attendance</span>
              <span className="text-xl font-bold font-mono text-emerald-700">{attendancePct}%</span>
            </div>
          </div>

          {/* Detailed Course Breakdown Table */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Course Assessment Breakdown
            </h3>
            <div className="border border-slate-300 rounded-lg overflow-hidden">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-2.5 px-3">Subject / Course</th>
                    <th className="py-2.5 px-3">Examination Series</th>
                    <th className="py-2.5 px-3 text-right">Score</th>
                    <th className="py-2.5 px-3 text-center">Grade</th>
                    <th className="py-2.5 px-3 text-center">Grade Point</th>
                    <th className="py-2.5 px-3">Faculty Remark</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {studentResults.length > 0 ? (
                    studentResults.map((r) => (
                      <tr key={r.id}>
                        <td className="py-2.5 px-3 font-semibold text-slate-900">{r.subjectName}</td>
                        <td className="py-2.5 px-3 text-slate-600">{r.examinationTitle}</td>
                        <td className="py-2.5 px-3 text-right font-mono font-bold text-slate-900">{r.score}%</td>
                        <td className="py-2.5 px-3 text-center font-bold text-slate-900">{r.grade}</td>
                        <td className="py-2.5 px-3 text-center font-mono text-slate-700">{r.gradePoint.toFixed(1)}</td>
                        <td className="py-2.5 px-3 text-slate-600 italic">{r.remarks}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-slate-500 italic">
                        No examination scores logged for this candidate during this term.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Signatures & Remarks Box */}
          <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-200 text-xs">
            <div className="p-3.5 border border-slate-200 rounded-lg space-y-4">
              <div>
                <span className="font-semibold text-slate-700 block">Class Form Tutor Comments:</span>
                <p className="text-slate-600 italic mt-1">
                  "Alexander demonstrates remarkable academic diligence and active participation in STEM laboratory projects."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                <span className="text-slate-400 text-[10px]">Tutor Signature: Dr. Arthur Sterling</span>
                <span className="text-[10px] text-slate-400">Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            <div className="p-3.5 border border-slate-200 rounded-lg space-y-4">
              <div>
                <span className="font-semibold text-slate-700 block">Principal's Official Attestation:</span>
                <p className="text-slate-600 italic mt-1">
                  "An exemplary academic performance. Approved for academic honors recommendation."
                </p>
              </div>
              <div className="pt-3 border-t border-slate-200 flex justify-between items-end">
                <span className="text-slate-400 text-[10px]">Registrar Seal: Minister Sam Academy</span>
                <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Authenticated
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="print:hidden px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
          >
            Close Report
          </button>
        </div>
      </div>
    </div>
  );
};
