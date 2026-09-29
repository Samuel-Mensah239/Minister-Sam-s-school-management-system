import React, { useState, useEffect } from 'react';
import { Check, X, Clock, Save, Calendar, CheckCheck, Users } from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { AttendanceStatus } from '../../types';

export const AttendanceRoster: React.FC = () => {
  const { classes, subjects, students, attendance, saveBatchAttendance } = useSchool();

  const [selectedClassId, setSelectedClassId] = useState<string>(classes[0]?.id || '');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(subjects[0]?.id || '');
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Local state for roll-call modifications
  const [rosterStatus, setRosterStatus] = useState<Record<string, AttendanceStatus>>({});
  const [rosterRemarks, setRosterRemarks] = useState<Record<string, string>>({});

  // Active students in selected class
  const classStudents = students.filter(
    (s) => s.classId === selectedClassId && s.status === 'active'
  );

  // Load existing records or default all to 'present'
  useEffect(() => {
    const existingMap: Record<string, AttendanceStatus> = {};
    const remarksMap: Record<string, string> = {};

    classStudents.forEach((student) => {
      const match = attendance.find(
        (a) =>
          a.studentId === student.id &&
          a.classId === selectedClassId &&
          a.date === selectedDate
      );
      if (match) {
        existingMap[student.id] = match.status;
        if (match.remarks) remarksMap[student.id] = match.remarks;
      } else {
        existingMap[student.id] = 'present'; // Sensible default
      }
    });

    setRosterStatus(existingMap);
    setRosterRemarks(remarksMap);
  }, [selectedClassId, selectedDate, attendance, students]);

  const handleStatusChange = (studentId: string, status: AttendanceStatus) => {
    setRosterStatus((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleRemarkChange = (studentId: string, remarks: string) => {
    setRosterRemarks((prev) => ({ ...prev, [studentId]: remarks }));
  };

  const markAll = (status: AttendanceStatus) => {
    const next: Record<string, AttendanceStatus> = {};
    classStudents.forEach((s) => {
      next[s.id] = status;
    });
    setRosterStatus(next);
  };

  // Summaries
  const totalStudents = classStudents.length;
  const presentCount = Object.values(rosterStatus).filter((s) => s === 'present').length;
  const lateCount = Object.values(rosterStatus).filter((s) => s === 'late').length;
  const absentCount = Object.values(rosterStatus).filter((s) => s === 'absent').length;
  const attendanceRate = totalStudents > 0 ? Math.round(((presentCount + lateCount * 0.5) / totalStudents) * 100) : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (classStudents.length === 0) return;

    const records = classStudents.map((s) => ({
      studentId: s.id,
      studentName: s.fullName,
      classId: selectedClassId,
      subjectId: selectedSubjectId,
      date: selectedDate,
      status: rosterStatus[s.id] || 'present',
      remarks: rosterRemarks[s.id] || undefined,
    }));

    saveBatchAttendance(records);
  };

  return (
    <div className="space-y-6">
      {/* Session Configuration Strip */}
      <div className="bg-white border border-slate-200/80 rounded-xl p-5 shadow-xs">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">
          Roll-Call Session Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Academic Class
            </label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            >
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Subject Period
            </label>
            <select
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            >
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} ({sub.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Attendance Date
            </label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Summary Metrics Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">Total Enrolled</span>
          <span className="text-xl font-bold text-slate-900 tabular-nums">{totalStudents}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">Present</span>
          <span className="text-xl font-bold text-emerald-800 tabular-nums">{presentCount}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider block">Late</span>
          <span className="text-xl font-bold text-amber-800 tabular-nums">{lateCount}</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-rose-700 uppercase tracking-wider block">Absent</span>
          <span className="text-xl font-bold text-rose-800 tabular-nums">{absentCount}</span>
        </div>
        <div className="col-span-2 sm:col-span-1 bg-slate-900 text-white border border-slate-800 rounded-xl p-3.5 shadow-xs">
          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">Rate</span>
          <span className="text-xl font-bold text-amber-300 tabular-nums">{attendanceRate}%</span>
        </div>
      </div>

      {/* Student Roster Table */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-200 gap-3 bg-slate-50/60">
          <div>
            <h4 className="text-sm font-bold text-slate-900">
              Attendance Register ({classStudents.length} Students)
            </h4>
            <p className="text-xs text-slate-500">
              Click individual statuses or use bulk marking shortcuts prior to saving.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 mr-1">Quick Mark:</span>
            <button
              type="button"
              onClick={() => markAll('present')}
              className="px-2.5 py-1 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
            >
              All Present
            </button>
            <button
              type="button"
              onClick={() => markAll('late')}
              className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
            >
              All Late
            </button>
          </div>
        </div>

        {classStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">ID Number</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4">Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {classStudents.map((student) => {
                  const currentStatus = rosterStatus[student.id] || 'present';
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/60 transition-colors">
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student.fullName}
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-500">
                        {student.studentId}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 rounded-lg max-w-fit mx-auto">
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'present')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                              currentStatus === 'present'
                                ? 'bg-emerald-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Present
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'late')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                              currentStatus === 'late'
                                ? 'bg-amber-500 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Late
                          </button>
                          <button
                            type="button"
                            onClick={() => handleStatusChange(student.id, 'absent')}
                            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all ${
                              currentStatus === 'absent'
                                ? 'bg-rose-600 text-white shadow-xs'
                                : 'text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            Absent
                          </button>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="text"
                          value={rosterRemarks[student.id] || ''}
                          onChange={(e) => handleRemarkChange(student.id, e.target.value)}
                          placeholder="e.g. Excused, medical note"
                          className="w-full px-2.5 py-1 text-xs border border-slate-200 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-8 text-center text-slate-500 text-xs">
            No active students enrolled in this class.
          </div>
        )}

        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Records will be logged into the permanent attendance ledger.
          </div>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            <span>Submit Roll-Call</span>
          </button>
        </div>
      </div>
    </div>
  );
};
