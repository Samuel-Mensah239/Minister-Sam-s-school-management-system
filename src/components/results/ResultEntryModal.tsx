import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { ExamResult } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { calculateGrade } from '../../utils/gradeCalculator';

interface ResultEntryModalProps {
  isOpen: boolean;
  result?: ExamResult | null;
  onClose: () => void;
}

export const ResultEntryModal: React.FC<ResultEntryModalProps> = ({
  isOpen,
  result,
  onClose,
}) => {
  const { students, subjects, examinations, classes, saveExamResult } = useSchool();
  const isEditing = Boolean(result);

  const [studentId, setStudentId] = useState(result?.studentId || students[0]?.id || '');
  const [subjectId, setSubjectId] = useState(result?.subjectId || subjects[0]?.id || '');
  const [examinationId, setExaminationId] = useState(result?.examinationId || examinations[0]?.id || '');
  const [score, setScore] = useState<number>(result?.score ?? 75);
  const [customRemarks, setCustomRemarks] = useState(result?.remarks || '');

  useEffect(() => {
    if (result) {
      setStudentId(result.studentId);
      setSubjectId(result.subjectId);
      setExaminationId(result.examinationId);
      setScore(result.score);
      setCustomRemarks(result.remarks);
    } else {
      setStudentId(students[0]?.id || '');
      setSubjectId(subjects[0]?.id || '');
      setExaminationId(examinations[0]?.id || '');
      setScore(75);
      setCustomRemarks('');
    }
  }, [result, isOpen, students, subjects, examinations]);

  if (!isOpen) return null;

  const currentGradeInfo = calculateGrade(score);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedStudent = students.find((s) => s.id === studentId);
    const selectedSubject = subjects.find((s) => s.id === subjectId);
    const selectedExam = examinations.find((e) => e.id === examinationId);

    if (!selectedStudent || !selectedSubject || !selectedExam) return;

    saveExamResult(
      {
        studentId,
        studentName: selectedStudent.fullName,
        classId: selectedStudent.classId,
        className: selectedStudent.className,
        subjectId,
        subjectName: selectedSubject.name,
        examinationId,
        examinationTitle: selectedExam.title,
        score,
        grade: currentGradeInfo.grade,
        gradePoint: currentGradeInfo.gradePoint,
        remarks: customRemarks.trim() || currentGradeInfo.remarks,
      },
      result?.id
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-md bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">
            {isEditing ? 'Modify Examination Result' : 'Enter Assessment Score'}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Examination Series
            </label>
            <select
              value={examinationId}
              onChange={(e) => setExaminationId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            >
              {examinations.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.title} ({ex.term})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Candidate Student
            </label>
            <select
              value={studentId}
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            >
              {students.map((st) => (
                <option key={st.id} value={st.id}>
                  {st.fullName} ({st.studentId} · {st.className})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Score Percentage (0 - 100%)
              </label>
              <span className="text-xs font-mono font-bold text-slate-900">
                {score}%
              </span>
            </div>
            <input
              type="number"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(Math.min(100, Math.max(0, Number(e.target.value) || 0)))}
              className="w-full px-3 py-2 text-xs font-mono font-bold border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          {/* Automatic Grade Computation Preview */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                Computed Evaluation
              </span>
              <span className="text-xs text-slate-700 font-medium">
                {currentGradeInfo.remarks}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-semibold">
                  Grade Point
                </span>
                <span className="text-xs font-mono font-bold text-slate-800">
                  {currentGradeInfo.gradePoint.toFixed(1)} / 4.0
                </span>
              </div>
              <div className="w-9 h-9 rounded-lg bg-slate-900 text-amber-300 font-bold text-sm flex items-center justify-center">
                {currentGradeInfo.grade}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Teacher Remarks (Optional)
            </label>
            <input
              type="text"
              value={customRemarks}
              onChange={(e) => setCustomRemarks(e.target.value)}
              placeholder={currentGradeInfo.remarks}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors"
            >
              {isEditing ? 'Update Score' : 'Record Score'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
