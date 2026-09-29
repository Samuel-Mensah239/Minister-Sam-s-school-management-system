import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Filter,
  Edit2,
  Trash2,
  Clock,
  MapPin,
  User,
  GraduationCap,
  Layers,
  LayoutGrid,
  List,
} from 'lucide-react';
import { DayOfWeek, TimetableEntry } from '../../types';
import { useSchool } from '../../context/SchoolContext';
import { ConfirmModal } from '../layout/ConfirmModal';

interface TimetableGridProps {
  timetableId: string;
  onAddEntry: () => void;
  onEditEntry: (entry: TimetableEntry) => void;
}

const DAYS: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

export const TimetableGrid: React.FC<TimetableGridProps> = ({
  timetableId,
  onAddEntry,
  onEditEntry,
}) => {
  const {
    timetableEntries,
    deleteTimetableEntry,
    classes,
    teachers,
    activeRole,
    timetables,
  } = useSchool();

  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterTeacher, setFilterTeacher] = useState<string>('all');
  const [filterDay, setFilterDay] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const [entryToDelete, setEntryToDelete] = useState<TimetableEntry | null>(null);

  const currentTimetable = timetables.find((t) => t.id === timetableId);
  const isAdministrator = activeRole === 'administrator';

  // Filter entries
  const entries = timetableEntries.filter((e) => {
    if (e.timetableId !== timetableId) return false;
    if (filterClass !== 'all' && e.classId !== filterClass) return false;
    if (filterTeacher !== 'all' && e.teacherId !== filterTeacher) return false;
    if (filterDay !== 'all' && e.day !== filterDay) return false;
    return true;
  });

  const getEntriesForDay = (day: DayOfWeek) => {
    return entries
      .filter((e) => e.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const daysToShow = filterDay === 'all' ? DAYS : DAYS.filter((d) => d === filterDay);

  return (
    <div className="space-y-4">
      {/* Filters & Control Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter:</span>
          </div>

          {/* Class Filter */}
          <select
            value={filterClass}
            onChange={(e) => setFilterClass(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Classes</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          {/* Teacher Filter */}
          <select
            value={filterTeacher}
            onChange={(e) => setFilterTeacher(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Teachers</option>
            {teachers.map((tch) => (
              <option key={tch.id} value={tch.id}>
                {tch.fullName}
              </option>
            ))}
          </select>

          {/* Day Filter */}
          <select
            value={filterDay}
            onChange={(e) => setFilterDay(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Weekdays (Mon - Fri)</option>
            {DAYS.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>

        {/* View Toggle & Add Action */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Weekly Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
                viewMode === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
              title="Sequential List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {isAdministrator && (
            <button
              type="button"
              onClick={onAddEntry}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>Add Lesson Period</span>
            </button>
          )}
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
          {daysToShow.map((day) => {
            const dayEntries = getEntriesForDay(day);

            return (
              <div
                key={day}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col"
              >
                {/* Day Header */}
                <div className="px-3.5 py-2.5 bg-slate-900 text-white flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider">{day}</span>
                  <span className="text-[11px] font-mono text-amber-300 tabular-nums">
                    {dayEntries.length} {dayEntries.length === 1 ? 'Period' : 'Periods'}
                  </span>
                </div>

                {/* Day Slots */}
                <div className="p-2.5 space-y-2.5 flex-1 min-h-[300px] bg-slate-50/50">
                  {dayEntries.length > 0 ? (
                    dayEntries.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3 bg-white border border-slate-200/90 rounded-lg shadow-xs hover:border-slate-300 transition-all group"
                      >
                        {/* Time & Action Toolbar */}
                        <div className="flex items-center justify-between text-[11px] font-mono font-bold text-slate-700 mb-1.5">
                          <span className="flex items-center gap-1 text-slate-600">
                            <Clock className="w-3 h-3 text-slate-400" />
                            {entry.startTime} - {entry.endTime}
                          </span>

                          {isAdministrator && (
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => onEditEntry(entry)}
                                className="p-1 text-slate-400 hover:text-slate-800 rounded transition-colors"
                                title="Edit lesson period"
                              >
                                <Edit2 className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => setEntryToDelete(entry)}
                                className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                title="Remove lesson period"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Subject */}
                        <div className="font-bold text-xs text-slate-900 leading-snug mb-1">
                          {entry.subjectName}
                        </div>

                        {/* Details */}
                        <div className="space-y-1 text-[11px] text-slate-500">
                          <div className="flex items-center gap-1 truncate text-slate-700">
                            <GraduationCap className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{entry.className}</span>
                          </div>
                          <div className="flex items-center gap-1 truncate text-slate-600">
                            <User className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{entry.teacherName}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] text-slate-500 font-mono">
                            <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                            <span className="truncate">{entry.room}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="h-full flex items-center justify-center p-6 text-center text-xs text-slate-400 italic">
                      No lessons scheduled
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Sequential List View */
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
          {entries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Day</th>
                    <th className="py-3 px-4">Time Interval</th>
                    <th className="py-3 px-4">Subject</th>
                    <th className="py-3 px-4">Class</th>
                    <th className="py-3 px-4">Instructor</th>
                    <th className="py-3 px-4">Venue</th>
                    {isAdministrator && <th className="py-3 px-4 text-right">Actions</th>}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {entries.map((entry) => (
                    <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{entry.day}</td>
                      <td className="py-3 px-4 font-mono font-medium text-slate-700">
                        {entry.startTime} - {entry.endTime}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">{entry.subjectName}</td>
                      <td className="py-3 px-4 text-slate-700">{entry.className}</td>
                      <td className="py-3 px-4 text-slate-700">{entry.teacherName}</td>
                      <td className="py-3 px-4 font-mono text-slate-500">{entry.room}</td>
                      {isAdministrator && (
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => onEditEntry(entry)}
                              className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                              title="Edit slot"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => setEntryToDelete(entry)}
                              className="p-1.5 text-slate-500 hover:text-rose-600 rounded-md hover:bg-rose-50"
                              title="Delete slot"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-500 text-xs">
              No timetable entries match your selected criteria.
            </div>
          )}
        </div>
      )}

      {/* Confirmation Dialog for controlled timetable entry deletion */}
      <ConfirmModal
        isOpen={Boolean(entryToDelete)}
        title="Delete Timetable Period"
        message={`Are you sure you want to remove the ${entryToDelete?.day} ${entryToDelete?.startTime} - ${entryToDelete?.endTime} lesson for ${entryToDelete?.className} (${entryToDelete?.subjectName})?`}
        confirmLabel="Delete Period"
        onConfirm={() => {
          if (entryToDelete) {
            deleteTimetableEntry(entryToDelete.id);
            setEntryToDelete(null);
          }
        }}
        onCancel={() => setEntryToDelete(null)}
      />
    </div>
  );
};
