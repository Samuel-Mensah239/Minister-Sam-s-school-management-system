import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  Award,
  Download,
  Printer,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { ExamResult, Student } from '../types';
import { SearchInput } from '../components/common/SearchInput';
import { ResultEntryModal } from '../components/results/ResultEntryModal';
import { ReportCardModal } from '../components/results/ReportCardModal';
import { ConfirmModal } from '../components/layout/ConfirmModal';

export const ResultsPage: React.FC = () => {
  const {
    examResults,
    students,
    subjects,
    examinations,
    classes,
    deleteExamResult,
    activeRole,
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterExam, setFilterExam] = useState('all');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterClass, setFilterClass] = useState('all');

  // Modals
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingResult, setEditingResult] = useState<ExamResult | null>(null);

  const [selectedStudentForReport, setSelectedStudentForReport] = useState<Student | null>(null);
  const [resultToDelete, setResultToDelete] = useState<ExamResult | null>(null);

  const isTeacherOrAdmin = activeRole === 'administrator' || activeRole === 'teacher';

  const filteredResults = examResults.filter((r) => {
    const matchesSearch =
      r.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.subjectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.examinationTitle.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesExam = filterExam === 'all' || r.examinationId === filterExam;
    const matchesSubject = filterSubject === 'all' || r.subjectId === filterSubject;
    const matchesClass = filterClass === 'all' || r.classId === filterClass;

    return matchesSearch && matchesExam && matchesSubject && matchesClass;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Examinations & Academic Assessment Ledger
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Log continuous assessment scores, calculate GPA, and generate official terminal transcripts.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick Generate Report Card */}
          <select
            onChange={(e) => {
              const target = students.find((s) => s.id === e.target.value);
              if (target) {
                setSelectedStudentForReport(target);
                e.target.value = '';
              }
            }}
            defaultValue=""
            className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
          >
            <option value="" disabled>
              Generate Student Report Card...
            </option>
            {students.map((st) => (
              <option key={st.id} value={st.id}>
                {st.fullName} ({st.className})
              </option>
            ))}
          </select>

          {isTeacherOrAdmin && (
            <button
              onClick={() => {
                setEditingResult(null);
                setIsEntryModalOpen(true);
              }}
              className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Enter Assessment Score</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by student, subject, or assessment..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={filterExam}
            onChange={(e) => setFilterExam(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Examination Series</option>
            {examinations.map((ex) => (
              <option key={ex.id} value={ex.id}>
                {ex.title}
              </option>
            ))}
          </select>

          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Subjects</option>
            {subjects.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Results Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        {filteredResults.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Subject</th>
                  <th className="py-3 px-4">Examination Series</th>
                  <th className="py-3 px-4 text-right">Score</th>
                  <th className="py-3 px-4 text-center">Grade</th>
                  <th className="py-3 px-4 text-center">Grade Point</th>
                  <th className="py-3 px-4">Teacher Remark</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredResults.map((result) => {
                  const student = students.find((s) => s.id === result.studentId);

                  return (
                    <tr key={result.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">
                        {result.studentName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {result.className}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {result.subjectName}
                      </td>
                      <td className="py-3 px-4 text-slate-600">
                        {result.examinationTitle}
                      </td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                        {result.score}%
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="font-bold text-slate-900 bg-slate-100 px-2 py-0.5 rounded font-mono">
                          {result.grade}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                        {result.gradePoint.toFixed(1)}
                      </td>
                      <td className="py-3 px-4 text-slate-500 max-w-xs truncate">
                        {result.remarks}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {student && (
                            <button
                              onClick={() => setSelectedStudentForReport(student)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                              title="Generate transcript"
                            >
                              <Award className="w-3.5 h-3.5 text-amber-500" />
                            </button>
                          )}

                          {isTeacherOrAdmin && (
                            <>
                              <button
                                onClick={() => {
                                  setEditingResult(result);
                                  setIsEntryModalOpen(true);
                                }}
                                className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                                title="Edit score"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>

                              <button
                                onClick={() => setResultToDelete(result)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                                title="Remove score"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            No examination results found matching the query.
          </div>
        )}
      </div>

      {/* Enter / Edit Score Modal */}
      <ResultEntryModal
        isOpen={isEntryModalOpen}
        result={editingResult}
        onClose={() => {
          setIsEntryModalOpen(false);
          setEditingResult(null);
        }}
      />

      {/* Student Terminal Transcript / Report Card Modal */}
      <ReportCardModal
        isOpen={Boolean(selectedStudentForReport)}
        student={selectedStudentForReport}
        onClose={() => setSelectedStudentForReport(null)}
      />

      {/* Delete Confirmation Dialog */}
      <ConfirmModal
        isOpen={Boolean(resultToDelete)}
        title="Delete Examination Score"
        message={`Are you sure you want to remove the ${resultToDelete?.subjectName} examination score (${resultToDelete?.score}%) for ${resultToDelete?.studentName}?`}
        confirmLabel="Delete Score Record"
        onConfirm={() => {
          if (resultToDelete) {
            deleteExamResult(resultToDelete.id);
            setResultToDelete(null);
          }
        }}
        onCancel={() => setResultToDelete(null)}
      />
    </div>
  );
};
