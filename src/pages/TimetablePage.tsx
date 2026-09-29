import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Calendar,
  CheckCircle2,
  Archive,
  FileEdit,
  Trash2,
  AlertTriangle,
  Layers,
  ChevronDown,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Timetable, TimetableEntry } from '../types';
import { TimetableGrid } from '../components/timetable/TimetableGrid';
import { TimetablePeriodModal } from '../components/timetable/TimetablePeriodModal';
import { TimetableEntryModal } from '../components/timetable/TimetableEntryModal';
import { ConfirmModal } from '../components/layout/ConfirmModal';
import { formatDate } from '../utils/formatters';

export const TimetablePage: React.FC = () => {
  const {
    timetables,
    activeTimetableId,
    setActiveTimetableId,
    setTimetableStatus,
    deleteTimetable,
    activeRole,
  } = useSchool();

  const isAdministrator = activeRole === 'administrator';

  // Modal states
  const [isPeriodModalOpen, setIsPeriodModalOpen] = useState(false);
  const [editingTimetable, setEditingTimetable] = useState<Timetable | null>(null);

  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimetableEntry | null>(null);

  const [timetableToDelete, setTimetableToDelete] = useState<Timetable | null>(null);

  // Selected timetable
  const currentTimetable =
    timetables.find((t) => t.id === activeTimetableId) ||
    timetables.find((t) => t.status === 'published') ||
    timetables[0];

  const effectiveId = currentTimetable ? currentTimetable.id : '';

  return (
    <div className="space-y-6">
      {/* Timetable Lifecycle & Administration Header */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 leading-tight">
              Master Academic Timetable Architecture
            </h2>
            {currentTimetable && (
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                  currentTimetable.status === 'published'
                    ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                    : currentTimetable.status === 'draft'
                    ? 'text-amber-700 bg-amber-50 border-amber-200'
                    : 'text-slate-500 bg-slate-100 border-slate-200'
                }`}
              >
                {currentTimetable.status}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-500">
            {currentTimetable?.description || 'Active institutional weekly schedule configuration.'}
          </p>
        </div>

        {/* Timetable Switcher & Management Toolbar */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Schedule Version Selector */}
          <div className="relative">
            <select
              value={effectiveId}
              onChange={(e) => setActiveTimetableId(e.target.value)}
              className="text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg pl-3 pr-8 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden cursor-pointer"
            >
              {timetables.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.status.toUpperCase()})
                </option>
              ))}
            </select>
          </div>

          {/* Administrator Lifecycle Controls */}
          {isAdministrator && currentTimetable && (
            <div className="flex items-center gap-1.5">
              {currentTimetable.status === 'draft' && (
                <button
                  type="button"
                  onClick={() => setTimetableStatus(currentTimetable.id, 'published')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 rounded-lg hover:bg-emerald-100 transition-colors"
                  title="Make this the active published schedule"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Publish Schedule</span>
                </button>
              )}

              {currentTimetable.status === 'published' && (
                <button
                  type="button"
                  onClick={() => setTimetableStatus(currentTimetable.id, 'draft')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-amber-800 bg-amber-50 border border-amber-200 rounded-lg hover:bg-amber-100 transition-colors"
                  title="Return to draft status for faculty revision"
                >
                  <FileEdit className="w-3.5 h-3.5 text-amber-600" />
                  <span>Revert to Draft</span>
                </button>
              )}

              {currentTimetable.status !== 'archived' && (
                <button
                  type="button"
                  onClick={() => setTimetableStatus(currentTimetable.id, 'archived')}
                  className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg transition-colors"
                  title="Move schedule to archive"
                >
                  <Archive className="w-3.5 h-3.5 text-slate-500" />
                  <span>Archive</span>
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  setEditingTimetable(currentTimetable);
                  setIsPeriodModalOpen(true);
                }}
                className="px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Edit Settings
              </button>

              <button
                type="button"
                onClick={() => {
                  setEditingTimetable(null);
                  setIsPeriodModalOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Timetable</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Meta Specs Ribbon */}
      {currentTimetable && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5 text-xs text-slate-600">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Session</span>
            <span className="font-semibold text-slate-800">{currentTimetable.academicYear}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Term / Semester</span>
            <span className="font-semibold text-slate-800">{currentTimetable.term}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Effective Date</span>
            <span className="font-mono text-slate-800">{formatDate(currentTimetable.effectiveDate)}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">Conflict Detection</span>
            <span className="text-emerald-700 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Room & Teacher Engine
            </span>
          </div>
        </div>
      )}

      {/* Interactive Weekly Grid and List View */}
      {effectiveId ? (
        <TimetableGrid
          timetableId={effectiveId}
          onAddEntry={() => {
            setEditingEntry(null);
            setIsEntryModalOpen(true);
          }}
          onEditEntry={(entry) => {
            setEditingEntry(entry);
            setIsEntryModalOpen(true);
          }}
        />
      ) : (
        <div className="p-12 text-center text-slate-500 text-xs">
          No timetables configured in the system.
        </div>
      )}

      {/* Create / Edit Timetable Period Modal */}
      <TimetablePeriodModal
        isOpen={isPeriodModalOpen}
        timetable={editingTimetable}
        onClose={() => {
          setIsPeriodModalOpen(false);
          setEditingTimetable(null);
        }}
      />

      {/* Add / Edit Timetable Entry Slot Modal */}
      <TimetableEntryModal
        isOpen={isEntryModalOpen}
        timetableId={effectiveId}
        entry={editingEntry}
        onClose={() => {
          setIsEntryModalOpen(false);
          setEditingEntry(null);
        }}
      />

      {/* Delete Timetable Confirmation */}
      <ConfirmModal
        isOpen={Boolean(timetableToDelete)}
        title="Delete Academic Timetable"
        message={`Are you sure you want to permanently delete "${timetableToDelete?.name}"? All associated lesson slots will be removed.`}
        confirmLabel="Delete Timetable"
        onConfirm={() => {
          if (timetableToDelete) {
            deleteTimetable(timetableToDelete.id);
            setTimetableToDelete(null);
          }
        }}
        onCancel={() => setTimetableToDelete(null)}
      />
    </div>
  );
};
