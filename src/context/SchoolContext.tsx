import React, { createContext, useContext, useState } from 'react';
import {
  Student,
  Teacher,
  ClassRoom,
  Subject,
  AttendanceRecord,
  Examination,
  ExamResult,
  Announcement,
  Timetable,
  TimetableEntry,
  ActivityLog,
  Role,
  ConflictCheckResult,
} from '../types';
import {
  initialClasses,
  initialSubjects,
  initialTeachers,
  initialStudents,
  initialAttendance,
  initialExaminations,
  initialExamResults,
  initialAnnouncements,
  initialTimetables,
  initialTimetableEntries,
  initialActivityLogs,
} from '../data/mockData';
import { checkTimetableConflicts } from '../utils/timetableValidation';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

interface SchoolContextType {
  // Domain Data
  students: Student[];
  teachers: Teacher[];
  classes: ClassRoom[];
  subjects: Subject[];
  attendance: AttendanceRecord[];
  examinations: Examination[];
  examResults: ExamResult[];
  announcements: Announcement[];
  timetables: Timetable[];
  timetableEntries: TimetableEntry[];
  activityLogs: ActivityLog[];

  // App & Contextual State
  activeRole: Role;
  setActiveRole: (role: Role) => void;
  activeTimetableId: string;
  setActiveTimetableId: (id: string) => void;
  academicYear: string;
  currentTerm: string;

  // Student Actions
  addStudent: (student: Omit<Student, 'id' | 'fullName'>) => void;
  updateStudent: (id: string, updates: Partial<Student>) => void;
  toggleStudentStatus: (id: string) => void;
  deleteStudent: (id: string) => void;

  // Teacher Actions
  addTeacher: (teacher: Omit<Teacher, 'id' | 'fullName'>) => void;
  updateTeacher: (id: string, updates: Partial<Teacher>) => void;
  toggleTeacherStatus: (id: string) => void;
  deleteTeacher: (id: string) => void;

  // Attendance Actions
  saveBatchAttendance: (records: Omit<AttendanceRecord, 'id'>[]) => void;

  // Results Actions
  saveExamResult: (result: Omit<ExamResult, 'id'>, existingId?: string) => void;
  deleteExamResult: (id: string) => void;

  // Announcements Actions
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'date'>) => void;
  updateAnnouncement: (id: string, updates: Partial<Announcement>) => void;
  togglePublishAnnouncement: (id: string) => void;
  deleteAnnouncement: (id: string) => void;

  // Timetable Actions
  createTimetable: (timetable: Omit<Timetable, 'id' | 'createdAt' | 'updatedAt'>) => string;
  updateTimetable: (id: string, updates: Partial<Timetable>) => void;
  setTimetableStatus: (id: string, status: Timetable['status']) => void;
  deleteTimetable: (id: string) => void;
  validateEntry: (entry: Omit<TimetableEntry, 'id'>, excludeId?: string) => ConflictCheckResult;
  addTimetableEntry: (entry: Omit<TimetableEntry, 'id'>) => { success: boolean; conflicts?: ConflictCheckResult };
  updateTimetableEntry: (id: string, entry: Omit<TimetableEntry, 'id'>) => { success: boolean; conflicts?: ConflictCheckResult };
  deleteTimetableEntry: (id: string) => void;

  // Notifications
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;
}

const SchoolContext = createContext<SchoolContextType | undefined>(undefined);

export const SchoolProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(initialStudents);
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [classes] = useState<ClassRoom[]>(initialClasses);
  const [subjects] = useState<Subject[]>(initialSubjects);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(initialAttendance);
  const [examinations] = useState<Examination[]>(initialExaminations);
  const [examResults, setExamResults] = useState<ExamResult[]>(initialExamResults);
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [timetables, setTimetables] = useState<Timetable[]>(initialTimetables);
  const [timetableEntries, setTimetableEntries] = useState<TimetableEntry[]>(initialTimetableEntries);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(initialActivityLogs);

  const [activeRole, setActiveRole] = useState<Role>('administrator');
  const [activeTimetableId, setActiveTimetableId] = useState<string>('tt-master-2026-t1');
  const academicYear = '2026/2027';
  const currentTerm = 'First Term';

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4500);
  };

  const dismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logActivity = (action: string, target: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: `act-${Date.now()}`,
      user: activeRole === 'administrator' ? 'Administrator' : activeRole === 'teacher' ? 'Faculty Member' : 'System User',
      action,
      target,
      timestamp: new Date().toISOString(),
      type,
    };
    setActivityLogs((prev) => [newLog, ...prev.slice(0, 24)]);
  };

  // Student Handlers
  const addStudent = (studentData: Omit<Student, 'id' | 'fullName'>) => {
    const id = `stu-${Date.now()}`;
    const fullName = `${studentData.firstName} ${studentData.lastName}`;
    const newStudent: Student = {
      ...studentData,
      id,
      fullName,
    };
    setStudents((prev) => [newStudent, ...prev]);
    logActivity('Enrolled new student', `${fullName} (${studentData.studentId})`, 'student');
    showToast(`Student ${fullName} enrolled successfully.`);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const updated = { ...s, ...updates };
          if (updates.firstName || updates.lastName) {
            updated.fullName = `${updated.firstName} ${updated.lastName}`;
          }
          return updated;
        }
        return s;
      })
    );
    showToast('Student record updated successfully.');
  };

  const toggleStudentStatus = (id: string) => {
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === id) {
          const nextStatus = s.status === 'active' ? 'inactive' : 'active';
          logActivity(
            nextStatus === 'active' ? 'Reactivated student' : 'Deactivated student',
            `${s.fullName} (${s.studentId})`,
            'student'
          );
          return { ...s, status: nextStatus };
        }
        return s;
      })
    );
    showToast('Student status updated.');
  };

  const deleteStudent = (id: string) => {
    const target = students.find((s) => s.id === id);
    setStudents((prev) => prev.filter((s) => s.id !== id));
    if (target) {
      logActivity('Deleted student record', `${target.fullName} (${target.studentId})`, 'student');
    }
    showToast('Student record removed.');
  };

  // Teacher Handlers
  const addTeacher = (teacherData: Omit<Teacher, 'id' | 'fullName'>) => {
    const id = `tch-${Date.now()}`;
    const fullName = `${teacherData.firstName} ${teacherData.lastName}`;
    const newTeacher: Teacher = {
      ...teacherData,
      id,
      fullName,
    };
    setTeachers((prev) => [newTeacher, ...prev]);
    logActivity('Added faculty member', `${fullName} (${teacherData.teacherId})`, 'teacher');
    showToast(`Teacher ${fullName} created successfully.`);
  };

  const updateTeacher = (id: string, updates: Partial<Teacher>) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const updated = { ...t, ...updates };
          if (updates.firstName || updates.lastName) {
            updated.fullName = `${updated.firstName} ${updated.lastName}`;
          }
          return updated;
        }
        return t;
      })
    );
    showToast('Teacher record updated successfully.');
  };

  const toggleTeacherStatus = (id: string) => {
    setTeachers((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextStatus = t.status === 'active' ? 'inactive' : 'active';
          logActivity(
            nextStatus === 'active' ? 'Reactivated teacher' : 'Deactivated teacher',
            `${t.fullName} (${t.teacherId})`,
            'teacher'
          );
          return { ...t, status: nextStatus };
        }
        return t;
      })
    );
    showToast('Teacher status updated.');
  };

  const deleteTeacher = (id: string) => {
    const target = teachers.find((t) => t.id === id);
    setTeachers((prev) => prev.filter((t) => t.id !== id));
    if (target) {
      logActivity('Deleted teacher record', `${target.fullName} (${target.teacherId})`, 'teacher');
    }
    showToast('Teacher record removed.');
  };

  // Attendance Handlers
  const saveBatchAttendance = (records: Omit<AttendanceRecord, 'id'>[]) => {
    setAttendance((prev) => {
      // Remove any existing records for the same student on the same date and class
      const keySet = new Set(records.map((r) => `${r.studentId}_${r.date}_${r.classId}`));
      const filtered = prev.filter((r) => !keySet.has(`${r.studentId}_${r.date}_${r.classId}`));
      const newItems: AttendanceRecord[] = records.map((r, i) => ({
        ...r,
        id: `att-${Date.now()}-${i}`,
      }));
      return [...newItems, ...filtered];
    });

    const presentCount = records.filter((r) => r.status === 'present').length;
    const rate = Math.round((presentCount / (records.length || 1)) * 100);
    logActivity('Submitted attendance log', `${records.length} students processed (${rate}% present)`, 'attendance');
    showToast(`Attendance saved successfully (${records.length} records processed).`);
  };

  // Results Handlers
  const saveExamResult = (resultData: Omit<ExamResult, 'id'>, existingId?: string) => {
    if (existingId) {
      setExamResults((prev) =>
        prev.map((r) => (r.id === existingId ? { ...resultData, id: existingId } : r))
      );
      showToast('Score updated successfully.');
    } else {
      const newResult: ExamResult = {
        ...resultData,
        id: `res-${Date.now()}`,
      };
      setExamResults((prev) => [newResult, ...prev]);
      logActivity('Recorded examination score', `${resultData.studentName} - ${resultData.subjectName} (${resultData.score}%)`, 'result');
      showToast('Score recorded successfully.');
    }
  };

  const deleteExamResult = (id: string) => {
    setExamResults((prev) => prev.filter((r) => r.id !== id));
    showToast('Examination score record removed.');
  };

  // Announcements Handlers
  const addAnnouncement = (data: Omit<Announcement, 'id' | 'date'>) => {
    const newAnc: Announcement = {
      ...data,
      id: `anc-${Date.now()}`,
      date: new Date().toISOString(),
    };
    setAnnouncements((prev) => [newAnc, ...prev]);
    logActivity('Created announcement', data.title, 'announcement');
    showToast('Announcement posted successfully.');
  };

  const updateAnnouncement = (id: string, updates: Partial<Announcement>) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
    showToast('Announcement updated.');
  };

  const togglePublishAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const next = a.status === 'published' ? 'draft' : 'published';
          return { ...a, status: next };
        }
        return a;
      })
    );
    showToast('Announcement status updated.');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement removed.');
  };

  // Timetable Handlers
  const createTimetable = (timetableData: Omit<Timetable, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `tt-${Date.now()}`;
    const now = new Date().toISOString();
    const newTt: Timetable = {
      ...timetableData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    // If set to published, unpublish other timetables
    if (newTt.status === 'published') {
      setTimetables((prev) =>
        prev.map((t) => (t.status === 'published' ? { ...t, status: 'draft' as const } : t)).concat(newTt)
      );
      setActiveTimetableId(id);
    } else {
      setTimetables((prev) => [...prev, newTt]);
    }

    logActivity('Created new timetable schedule', newTt.name, 'timetable');
    showToast(`Timetable "${newTt.name}" created.`);
    return id;
  };

  const updateTimetable = (id: string, updates: Partial<Timetable>) => {
    const now = new Date().toISOString();
    setTimetables((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, ...updates, updatedAt: now };
        }
        // If status changed to published, unpublish others
        if (updates.status === 'published' && t.id !== id && t.status === 'published') {
          return { ...t, status: 'draft' as const, updatedAt: now };
        }
        return t;
      })
    );
    showToast('Timetable details updated.');
  };

  const setTimetableStatus = (id: string, status: Timetable['status']) => {
    const now = new Date().toISOString();
    setTimetables((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          return { ...t, status, updatedAt: now };
        }
        if (status === 'published' && t.status === 'published') {
          return { ...t, status: 'draft' as const, updatedAt: now };
        }
        return t;
      })
    );
    logActivity('Updated timetable status', `Set to ${status}`, 'timetable');
    showToast(`Timetable marked as ${status}.`);
  };

  const deleteTimetable = (id: string) => {
    setTimetables((prev) => prev.filter((t) => t.id !== id));
    setTimetableEntries((prev) => prev.filter((e) => e.timetableId !== id));
    showToast('Timetable and associated entries deleted.');
  };

  const validateEntry = (entry: Omit<TimetableEntry, 'id'>, excludeId?: string) => {
    return checkTimetableConflicts(entry, timetableEntries, excludeId);
  };

  const addTimetableEntry = (entry: Omit<TimetableEntry, 'id'>) => {
    const conflictResult = validateEntry(entry);
    if (conflictResult.hasConflict) {
      return { success: false, conflicts: conflictResult };
    }

    const newEntry: TimetableEntry = {
      ...entry,
      id: `tte-${Date.now()}`,
    };
    setTimetableEntries((prev) => [...prev, newEntry]);
    logActivity('Scheduled timetable slot', `${entry.className} - ${entry.subjectName} (${entry.day} ${entry.startTime})`, 'timetable');
    showToast('Lesson slot added to timetable.');
    return { success: true };
  };

  const updateTimetableEntry = (id: string, entry: Omit<TimetableEntry, 'id'>) => {
    const conflictResult = validateEntry(entry, id);
    if (conflictResult.hasConflict) {
      return { success: false, conflicts: conflictResult };
    }

    setTimetableEntries((prev) =>
      prev.map((e) => (e.id === id ? { ...entry, id } : e))
    );
    showToast('Lesson slot updated.');
    return { success: true };
  };

  const deleteTimetableEntry = (id: string) => {
    setTimetableEntries((prev) => prev.filter((e) => e.id !== id));
    showToast('Timetable slot removed.');
  };

  return (
    <SchoolContext.Provider
      value={{
        students,
        teachers,
        classes,
        subjects,
        attendance,
        examinations,
        examResults,
        announcements,
        timetables,
        timetableEntries,
        activityLogs,
        activeRole,
        setActiveRole,
        activeTimetableId,
        setActiveTimetableId,
        academicYear,
        currentTerm,
        addStudent,
        updateStudent,
        toggleStudentStatus,
        deleteStudent,
        addTeacher,
        updateTeacher,
        toggleTeacherStatus,
        deleteTeacher,
        saveBatchAttendance,
        saveExamResult,
        deleteExamResult,
        addAnnouncement,
        updateAnnouncement,
        togglePublishAnnouncement,
        deleteAnnouncement,
        createTimetable,
        updateTimetable,
        setTimetableStatus,
        deleteTimetable,
        validateEntry,
        addTimetableEntry,
        updateTimetableEntry,
        deleteTimetableEntry,
        toasts,
        showToast,
        dismissToast,
      }}
    >
      {children}
    </SchoolContext.Provider>
  );
};

export const useSchool = () => {
  const context = useContext(SchoolContext);
  if (!context) {
    throw new Error('useSchool must be used within a SchoolProvider');
  }
  return context;
};
