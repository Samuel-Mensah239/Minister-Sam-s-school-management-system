import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import { Timetable, TimetableStatus } from '../../types';
import { useSchool } from '../../context/SchoolContext';

interface TimetablePeriodModalProps {
  isOpen: boolean;
  timetable?: Timetable | null;
  onClose: () => void;
}

export const TimetablePeriodModal: React.FC<TimetablePeriodModalProps> = ({
  isOpen,
  timetable,
  onClose,
}) => {
  const { createTimetable, updateTimetable, academicYear } = useSchool();
  const isEditing = Boolean(timetable);

  const [formData, setFormData] = useState({
    academicYear: academicYear,
    term: 'First Term' as Timetable['term'],
    name: '',
    effectiveDate: new Date().toISOString().split('T')[0],
    status: 'draft' as TimetableStatus,
    description: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (timetable) {
      setFormData({
        academicYear: timetable.academicYear,
        term: timetable.term,
        name: timetable.name,
        effectiveDate: timetable.effectiveDate,
        status: timetable.status,
        description: timetable.description || '',
      });
    } else {
      setFormData({
        academicYear: '2026/2027',
        term: 'First Term',
        name: '2026/2027 First Term Master Academic Timetable',
        effectiveDate: new Date().toISOString().split('T')[0],
        status: 'draft',
        description: 'New academic timetable schedule.',
      });
    }
    setErrors({});
  }, [timetable, isOpen, academicYear]);

  if (!isOpen) return null;

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Timetable name is required';
    if (!formData.effectiveDate) errs.effectiveDate = 'Effective date is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (isEditing && timetable) {
      updateTimetable(timetable.id, formData);
    } else {
      createTimetable(formData);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl overflow-hidden animate-in fade-in duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-slate-700" />
            <h2 className="text-base font-bold text-slate-900">
              {isEditing ? 'Configure Academic Timetable' : 'Create New Timetable Period'}
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Timetable Title *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. 2026/2027 Term 1 Master Schedule"
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
            {errors.name && <p className="text-xs text-rose-600 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Academic Session
              </label>
              <input
                type="text"
                value={formData.academicYear}
                onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                placeholder="2026/2027"
                className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Term / Semester
              </label>
              <select
                value={formData.term}
                onChange={(e) => setFormData({ ...formData, term: e.target.value as Timetable['term'] })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              >
                <option value="First Term">First Term</option>
                <option value="Second Term">Second Term</option>
                <option value="Third Term">Third Term</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Effective Commencement Date
              </label>
              <input
                type="date"
                value={formData.effectiveDate}
                onChange={(e) => setFormData({ ...formData, effectiveDate: e.target.value })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
              />
              {errors.effectiveDate && <p className="text-xs text-rose-600 mt-1">{errors.effectiveDate}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Lifecycle Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as TimetableStatus })}
                className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden font-semibold"
              >
                <option value="draft">Draft (Under Review)</option>
                <option value="published">Published (Active Institutional)</option>
                <option value="archived">Archived (Historical)</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Internal Notes / Administrative Brief
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline schedule directives, room allocation guidelines, or revision comments..."
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-900 focus:outline-hidden"
            />
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-lg text-xs text-amber-900 leading-relaxed">
            <span className="font-semibold block mb-0.5">Policy Notice:</span>
            Only a timetable in the <strong>Published</strong> state becomes the authoritative active schedule for students and faculty.
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
              {isEditing ? 'Save Changes' : 'Create Timetable'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
