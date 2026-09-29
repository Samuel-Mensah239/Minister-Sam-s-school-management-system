import React, { useState } from 'react';
import {
  UserPlus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  FileSpreadsheet,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Student } from '../types';
import { SearchInput } from '../components/common/SearchInput';
import { StudentModal } from '../components/students/StudentModal';
import { StudentDetailModal } from '../components/students/StudentDetailModal';
import { ConfirmModal } from '../components/layout/ConfirmModal';
import { formatDate } from '../utils/formatters';

export const StudentsPage: React.FC = () => {
  const { students, classes, toggleStudentStatus, deleteStudent, activeRole } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterGender, setFilterGender] = useState('all');

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const [detailStudent, setDetailStudent] = useState<Student | null>(null);
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null);

  const isAdministrator = activeRole === 'administrator';

  // Filtered Students
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.parentName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = filterClass === 'all' || s.classId === filterClass;
    const matchesStatus = filterStatus === 'all' || s.status === filterStatus;
    const matchesGender = filterGender === 'all' || s.gender === filterGender;

    return matchesSearch && matchesClass && matchesStatus && matchesGender;
  });

  return (
    <div className="space-y-5">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Student Academic Records
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Total of {students.length} registered students across senior academy grades.
          </p>
        </div>

        {isAdministrator && (
          <button
            onClick={() => {
              setEditingStudent(null);
              setIsFormModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Enroll New Student</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by student name, ID number, or parent..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          {/* Gender Filter */}
          <select
            value={filterGender}
            onChange={(e) => setFilterGender(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Genders</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
      </div>

      {/* Main Students Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        {filteredStudents.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Student ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Gender</th>
                  <th className="py-3 px-4">Class</th>
                  <th className="py-3 px-4">Date of Birth</th>
                  <th className="py-3 px-4">Parent / Guardian</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {student.studentId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {student.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {student.gender}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {student.className}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {formatDate(student.dateOfBirth)}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{student.parentName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{student.parentPhone}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold ${
                          student.status === 'active' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {student.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailStudent(student)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                          title="View student profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {isAdministrator && (
                          <>
                            <button
                              onClick={() => {
                                setEditingStudent(student);
                                setIsFormModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                              title="Edit student"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => toggleStudentStatus(student.id)}
                              className={`p-1.5 rounded-md hover:bg-slate-100 ${
                                student.status === 'active'
                                  ? 'text-slate-500 hover:text-amber-700'
                                  : 'text-slate-500 hover:text-emerald-700'
                              }`}
                              title={student.status === 'active' ? 'Deactivate student' : 'Reactivate student'}
                            >
                              {student.status === 'active' ? (
                                <UserX className="w-3.5 h-3.5" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => setStudentToDelete(student)}
                              className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                              title="Delete record"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-12 text-center text-slate-500 text-xs">
            No students found matching the selected query.
          </div>
        )}
      </div>

      {/* Add / Edit Student Modal */}
      <StudentModal
        isOpen={isFormModalOpen}
        student={editingStudent}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingStudent(null);
        }}
      />

      {/* View Student Profile Modal */}
      <StudentDetailModal
        isOpen={Boolean(detailStudent)}
        student={detailStudent}
        onClose={() => setDetailStudent(null)}
        onEdit={() => {
          if (detailStudent) {
            setEditingStudent(detailStudent);
            setDetailStudent(null);
            setIsFormModalOpen(true);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(studentToDelete)}
        title="Delete Student Record"
        message={`Are you sure you want to permanently delete the institutional file for ${studentToDelete?.fullName} (${studentToDelete?.studentId})? In most cases, changing the status to Inactive is preferred to preserve academic records.`}
        confirmLabel="Permanently Delete"
        onConfirm={() => {
          if (studentToDelete) {
            deleteStudent(studentToDelete.id);
            setStudentToDelete(null);
          }
        }}
        onCancel={() => setStudentToDelete(null)}
      />
    </div>
  );
};
