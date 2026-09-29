import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Clock, CheckCircle } from 'lucide-react';
import { DayOfWeek, TimetableEntry, ConflictCheckResult } from '../../types';
import { useSchool } from '../../context/SchoolContext';

interface TimetableEntryModalProps {
  isOpen: boolean;
  timetableId: string;
  entry?: TimetableEntry | null;
  onClose: () => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TimetableEntryModal: React.FC<TimetableEntryModalProps> = ({
  isOpen,
  timetableId,
  entry,
  onClose,
}) => {
  const { classes, subjects, teachers, validateEntry, addTimetableEntry, updateTimetableEntry } = useSchool();
  const isEditing = Boolean(entry);

  const [day, setDay] = useState<DayOfWeek>(entry?.day || 'Monday');
  const [startTime, setStartTime] = useState(entry?.startTime || '08:30');
  const [endTime, setEndTime] = useState(entry?.endTime || '09:30');
  const [classId, setClassId] = useState(entry?.classId || classes[0]?.id || '');
  const [subjectId, setSubjectId] = useState(entry?.subjectId || subjects[0]?.id || '');
  const [teacherId, setTeacherId] = useState(entry?.teacherId || teachers[0]?.id || '');
  const [room, setRoom] = useState(entry?.room || 'Room 101');

  const [conflictResult, setConflictResult] = useState<ConflictCheckResult>({ hasConflict: false, conflicts: [] });
  const [submittedAttempt, setSubmittedAttempt] = useState(false);

  // Sync state on open
  useEffect(() => {
    if (entry) {
      setDay(entry.day);
      setStartTime(entry.startTime);
      setEndTime(entry.endTime);
      setClassId(entry.classId);
      setSubjectId(entry.subjectId);
      setTeacherId(entry.teacherId);
      setRoom(entry.room);
    } else {
      setDay('Monday');
      setStartTime('08:30');
      setEndTime('09:30');
      setClassId(classes[0]?.id || '');
      setSubjectId(subjects[0]?.id || '');
      setTeacherId(teachers[0]?.id || '');
      setRoom('Room 101');
    }
    setSubmittedAttempt(false);
  }, [entry, isOpen, classes, subjects, teachers]);

  // Live conflict evaluation whenever scheduling parameters change
  useEffect(() => {
    if (!isOpen) return;

    const selectedClass = classes.find((c) => c.id === classId);
    const selectedSubject = subjects.find((s) => s.id === subjectId);
    const selectedTeacher = teachers.find((t) => t.id === teacherId);

    const proposed = {
      timetableId,
      day,
      startTime,
      endTime,
      classId,
      className: selectedClass ? selectedClass.name : '',
      subjectId,
      subjectName: selectedSubject ? selectedSubject.name : '',
      teacherId,
      teacherName: selectedTeacher ? selectedTeacher.fullName : '',
      room,
    };

    const result = validateEntry(proposed, entry?.id);
    setConflictResult(result);
  }, [day, startTime, endTime, classId, subjectId, teacherId, room, timetableId, isOpen, entry, classes, subjects, teachers, validateEntry]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittedAttempt(true);

    if (conflictResult.hasConflict) {
      return;
    }

    const selectedClass = classes.find((c) => c.id === classId);
    const selectedSubject = subjects.find((s) => s.id === subjectId);
    const selectedTeacher = teachers.find((t) => t.id === teacherId);

    if (!selectedClass || !selectedSubject || !selectedTeacher) return;

    const payload = {
      timetableId,
      day,
      startTime,
      endTime,
      classId,
      className: selectedClass.name,
      subjectId,
      subjectName: selectedSubject.name,
      teacherId,
      teacherName: selectedTeacher.fullName,
      room: room.trim() || 'Unassigned',
    };

    if (isEditing && entry) {
      const res = updateTimetableEntry(entry.id, payload);
      if (res.success) onClose();
    } else {
      const res = addTimetableEntry(payload);
      if (res.success) onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="w-full max-w-xl bg-white border border-slate-200 rounded-xl shadow-2xl my-8 overflow-hidden animate-in fade-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Modify Timetable Period' : 'Add Timetable Period Slot'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1 rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {/* Day & Time Slot */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Day of Week *
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value as DayOfWeek)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-medium"
              >
                {DAYS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Start Time (24h) *
              </label>
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                End Time (24h) *
              </label>
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Academic Allocation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Class *
              </label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name} ({cls.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Subject *
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

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Instructor / Teacher *
              </label>
              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              >
                {teachers.map((tch) => (
                  <option key={tch.id} value={tch.id}>
                    {tch.fullName} · {tch.primarySubjectName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Room / Venue *
              </label>
              <input
                type="text"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
                placeholder="e.g. Science Lab 1, Room 104"
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Automated Conflict Detection Engine Output */}
          <div className="pt-2">
            {conflictResult.hasConflict ? (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-rose-800 font-bold text-xs">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>Scheduling Conflict Detected!</span>
                </div>
                <ul className="text-xs text-rose-700 space-y-1 list-disc pl-5">
                  {conflictResult.conflicts.map((c, i) => (
                    <li key={i}>{c.message}</li>
                  ))}
                </ul>
                <p className="text-[11px] text-rose-600 italic">
                  Please adjust the time, day, instructor, class, or venue before saving this period.
                </p>
              </div>
            ) : (
              <div className="p-3 bg-emerald-50 border border-emerald-200/80 rounded-lg flex items-center gap-2 text-xs text-emerald-800">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>No scheduling conflicts detected for this period.</span>
              </div>
            )}
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
              disabled={conflictResult.hasConflict}
              className={`px-4 py-2 text-xs font-semibold text-white rounded-lg transition-colors ${
                conflictResult.hasConflict
                  ? 'bg-slate-300 cursor-not-allowed text-slate-500'
                  : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              {isEditing ? 'Save Changes' : 'Schedule Lesson'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
