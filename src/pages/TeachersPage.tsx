import React, { useState } from 'react';
import {
  UserPlus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  UserCheck,
  UserX,
  Mail,
  Phone,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Teacher } from '../types';
import { SearchInput } from '../components/common/SearchInput';
import { TeacherModal } from '../components/teachers/TeacherModal';
import { TeacherDetailModal } from '../components/teachers/TeacherDetailModal';
import { ConfirmModal } from '../components/layout/ConfirmModal';

export const TeachersPage: React.FC = () => {
  const { teachers, subjects, toggleTeacherStatus, deleteTeacher, activeRole } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [detailTeacher, setDetailTeacher] = useState<Teacher | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<Teacher | null>(null);

  const isAdministrator = activeRole === 'administrator';

  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch =
      t.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.teacherId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSubject = filterSubject === 'all' || t.primarySubjectId === filterSubject;
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;

    return matchesSearch && matchesSubject && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Academic Faculty Roster
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {teachers.length} certified teaching instructors and departmental specialists.
          </p>
        </div>

        {isAdministrator && (
          <button
            onClick={() => {
              setEditingTeacher(null);
              setIsFormModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search by instructor name, ID, or email..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

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

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Main Teachers Table */}
      <div className="bg-white border border-slate-200/90 rounded-xl shadow-xs overflow-hidden">
        {filteredTeachers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Teacher ID</th>
                  <th className="py-3 px-4">Full Name</th>
                  <th className="py-3 px-4">Institutional Email</th>
                  <th className="py-3 px-4">Primary Subject</th>
                  <th className="py-3 px-4">Assigned Class</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTeachers.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-medium text-slate-700">
                      {teacher.teacherId}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900">
                      {teacher.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>{teacher.email}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-900">
                      {teacher.primarySubjectName}
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      {teacher.assignedClassName || (
                        <span className="text-slate-400 italic">None (Subject Specialist)</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`text-xs font-semibold ${
                          teacher.status === 'active' ? 'text-emerald-700' : 'text-slate-400'
                        }`}
                      >
                        {teacher.status === 'active' ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => setDetailTeacher(teacher)}
                          className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                          title="View faculty profile"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>

                        {isAdministrator && (
                          <>
                            <button
                              onClick={() => {
                                setEditingTeacher(teacher);
                                setIsFormModalOpen(true);
                              }}
                              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                              title="Edit teacher"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => toggleTeacherStatus(teacher.id)}
                              className={`p-1.5 rounded-md hover:bg-slate-100 ${
                                teacher.status === 'active'
                                  ? 'text-slate-500 hover:text-amber-700'
                                  : 'text-slate-500 hover:text-emerald-700'
                              }`}
                              title={teacher.status === 'active' ? 'Deactivate teacher' : 'Reactivate teacher'}
                            >
                              {teacher.status === 'active' ? (
                                <UserX className="w-3.5 h-3.5" />
                              ) : (
                                <UserCheck className="w-3.5 h-3.5" />
                              )}
                            </button>

                            <button
                              onClick={() => setTeacherToDelete(teacher)}
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
            No instructors found matching the filter criteria.
          </div>
        )}
      </div>

      {/* Add / Edit Teacher Modal */}
      <TeacherModal
        isOpen={isFormModalOpen}
        teacher={editingTeacher}
        onClose={() => {
          setIsFormModalOpen(false);
          setEditingTeacher(null);
        }}
      />

      {/* View Teacher Details Modal */}
      <TeacherDetailModal
        isOpen={Boolean(detailTeacher)}
        teacher={detailTeacher}
        onClose={() => setDetailTeacher(null)}
        onEdit={() => {
          if (detailTeacher) {
            setEditingTeacher(detailTeacher);
            setDetailTeacher(null);
            setIsFormModalOpen(true);
          }
        }}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(teacherToDelete)}
        title="Delete Faculty Record"
        message={`Are you sure you want to permanently delete ${teacherToDelete?.fullName} (${teacherToDelete?.teacherId})? Deactivation is recommended if this faculty member has historical academic scores or attendance logs.`}
        confirmLabel="Permanently Delete"
        onConfirm={() => {
          if (teacherToDelete) {
            deleteTeacher(teacherToDelete.id);
            setTeacherToDelete(null);
          }
        }}
        onCancel={() => setTeacherToDelete(null)}
      />
    </div>
  );
};
