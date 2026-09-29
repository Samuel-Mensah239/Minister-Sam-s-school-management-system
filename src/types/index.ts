/**
 * Core Domain Models for Minister Sam Academy (MSA)
 * 
 * Architectural Note:
 * These TypeScript interfaces reflect the domain entity structures designed
 * for compatibility with future relational database schemas (e.g., PostgreSQL/Prisma/Drizzle)
 * and REST/GraphQL API specifications.
 */

export type Role = 'administrator' | 'teacher' | 'student' | 'parent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
}

export type Status = 'active' | 'inactive';

export interface Student {
  id: string;
  studentId: string; // e.g. MSA-2026-0101
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'Male' | 'Female' | 'Other';
  classId: string;
  className: string;
  dateOfBirth: string; // YYYY-MM-DD
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  status: Status;
  enrollmentDate: string;
  address?: string;
}

export interface Teacher {
  id: string;
  teacherId: string; // e.g. MSA-TCH-004
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  phone: string;
  specialization: string[]; // e.g. ['Mathematics', 'Further Math']
  primarySubjectId: string;
  primarySubjectName: string;
  assignedClassId?: string; // Form Master / Class Teacher assignment
  assignedClassName?: string;
  status: Status;
  joinedDate: string;
}

export interface ClassRoom {
  id: string;
  name: string; // e.g. "Grade 10A (Science)"
  code: string; // e.g. "G10A"
  gradeLevel: number; // 9, 10, 11, 12
  capacity: number;
  enrolledCount: number;
  classTeacherId: string;
  classTeacherName: string;
  roomNumber: string;
  academicYear: string;
}

export interface Subject {
  id: string;
  name: string; // e.g. "Advanced Mathematics"
  code: string; // e.g. "MTH-101"
  department: 'Sciences' | 'Arts & Humanities' | 'Commercial & Business' | 'Technology & Vocational';
  credits: number;
  description: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late';

export interface AttendanceRecord {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  subjectId?: string; // Optional: subject-level attendance or homeroom
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  remarks?: string;
}

export interface Examination {
  id: string;
  title: string; // e.g. "Term 1 Mid-Term Assessment 2026"
  term: 'First Term' | 'Second Term' | 'Third Term';
  academicYear: string; // e.g. "2026/2027"
  startDate: string;
  endDate: string;
}

export interface ExamResult {
  id: string;
  studentId: string;
  studentName: string;
  classId: string;
  className: string;
  subjectId: string;
  subjectName: string;
  examinationId: string;
  examinationTitle: string;
  score: number; // 0 - 100
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  gradePoint: number; // 4.0 scale
  remarks: string;
}

export type TargetAudience = 'all' | 'teachers' | 'students' | 'parents';
export type AnnouncementStatus = 'published' | 'draft' | 'archived';
export type PriorityLevel = 'normal' | 'high' | 'urgent';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  authorName: string;
  authorRole: string;
  date: string; // ISO date string
  targetAudience: TargetAudience;
  priority: PriorityLevel;
  status: AnnouncementStatus;
  pinned?: boolean;
}

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday';
export type TimetableStatus = 'draft' | 'published' | 'archived';

/**
 * Timetable represents an overall schedule version for an academic cycle
 */
export interface Timetable {
  id: string;
  academicYear: string; // e.g. "2026/2027"
  term: 'First Term' | 'Second Term' | 'Third Term';
  name: string; // e.g. "Term 1 Senior Master Timetable"
  effectiveDate: string; // YYYY-MM-DD
  status: TimetableStatus;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * TimetableEntry represents an individual scheduled lesson slot
 */
export interface TimetableEntry {
  id: string;
  timetableId: string;
  day: DayOfWeek;
  startTime: string; // e.g. "08:30" (HH:mm 24hr format)
  endTime: string;   // e.g. "09:30" (HH:mm 24hr format)
  subjectId: string;
  subjectName: string;
  teacherId: string;
  teacherName: string;
  classId: string;
  className: string;
  room: string; // e.g. "Lab 2" or "Room 104"
}

export interface ConflictDetail {
  type: 'teacher' | 'class' | 'room';
  message: string;
  existingEntry: TimetableEntry;
}

export interface ConflictCheckResult {
  hasConflict: boolean;
  conflicts: ConflictDetail[];
}

export interface ActivityLog {
  id: string;
  user: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'student' | 'teacher' | 'attendance' | 'timetable' | 'result' | 'announcement';
}
