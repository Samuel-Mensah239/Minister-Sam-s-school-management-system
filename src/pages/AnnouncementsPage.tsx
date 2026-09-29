import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  CheckCircle,
  Clock,
  Pin,
  Send,
  Archive,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';
import { Announcement } from '../types';
import { SearchInput } from '../components/common/SearchInput';
import { AnnouncementModal } from '../components/announcements/AnnouncementModal';
import { ConfirmModal } from '../components/layout/ConfirmModal';
import { formatDate } from '../utils/formatters';

export const AnnouncementsPage: React.FC = () => {
  const {
    announcements,
    togglePublishAnnouncement,
    deleteAnnouncement,
    activeRole,
  } = useSchool();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterAudience, setFilterAudience] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [detailAnnouncement, setDetailAnnouncement] = useState<Announcement | null>(null);
  const [announcementToDelete, setAnnouncementToDelete] = useState<Announcement | null>(null);

  const isAdministrator = activeRole === 'administrator';

  const filtered = announcements.filter((a) => {
    const matchesSearch =
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.authorName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesAudience = filterAudience === 'all' || a.targetAudience === filterAudience || a.targetAudience === 'all';
    const matchesStatus = filterStatus === 'all' || a.status === filterStatus;

    return matchesSearch && matchesAudience && matchesStatus;
  });

  return (
    <div className="space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/90 rounded-xl p-5 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-slate-900 leading-tight">
            Institutional Notices & Bulletins
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Broadcast official circulars, exam schedules, and policy updates across academy stakeholders.
          </p>
        </div>

        {isAdministrator && (
          <button
            onClick={() => {
              setEditingAnnouncement(null);
              setIsModalOpen(true);
            }}
            className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Post New Notice</span>
          </button>
        )}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        <div className="flex-1 max-w-md">
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="Search bulletins and announcements..."
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mr-1">
            <Filter className="w-3.5 h-3.5" />
            <span>Filters:</span>
          </div>

          <select
            value={filterAudience}
            onChange={(e) => setFilterAudience(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Audiences</option>
            <option value="teachers">Faculty Only</option>
            <option value="students">Students Only</option>
            <option value="parents">Parents Only</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="text-xs font-medium text-slate-800 bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-2 focus:ring-1 focus:ring-slate-900 focus:outline-hidden"
          >
            <option value="all">All Statuses</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((announcement) => (
            <div
              key={announcement.id}
              className={`bg-white border rounded-xl p-5 shadow-xs transition-all hover:border-slate-300 ${
                announcement.pinned ? 'border-amber-400/80 bg-amber-50/20' : 'border-slate-200/90'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    {announcement.pinned && (
                      <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded">
                        <Pin className="w-3 h-3 text-amber-700" />
                        Pinned Notice
                      </span>
                    )}

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border ${
                        announcement.status === 'published'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : announcement.status === 'draft'
                          ? 'text-amber-700 bg-amber-50 border-amber-200'
                          : 'text-slate-500 bg-slate-100 border-slate-200'
                      }`}
                    >
                      {announcement.status}
                    </span>

                    <span className="text-[11px] text-slate-500 capitalize">
                      Audience: {announcement.targetAudience}
                    </span>
                    <span aria-hidden="true" className="text-slate-300">·</span>
                    <span className="text-[11px] text-slate-500 font-mono">
                      {formatDate(announcement.date)}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                    {announcement.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed max-w-4xl line-clamp-3">
                    {announcement.content}
                  </p>

                  <div className="text-[11px] text-slate-500 pt-1">
                    Issued by <strong className="text-slate-700">{announcement.authorName}</strong> ({announcement.authorRole})
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1.5 shrink-0 pt-2 sm:pt-0">
                  <button
                    onClick={() => setDetailAnnouncement(announcement)}
                    className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                    title="View full notice"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {isAdministrator && (
                    <>
                      <button
                        onClick={() => {
                          setEditingAnnouncement(announcement);
                          setIsModalOpen(true);
                        }}
                        className="p-1.5 text-slate-500 hover:text-slate-900 rounded-md hover:bg-slate-100"
                        title="Edit notice"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => togglePublishAnnouncement(announcement.id)}
                        className={`p-1.5 rounded-md hover:bg-slate-100 ${
                          announcement.status === 'published'
                            ? 'text-emerald-700 hover:text-amber-700'
                            : 'text-slate-500 hover:text-emerald-700'
                        }`}
                        title={announcement.status === 'published' ? 'Unpublish notice' : 'Publish notice'}
                      >
                        <Send className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setAnnouncementToDelete(announcement)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-md hover:bg-rose-50"
                        title="Delete notice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-500 text-xs">
            No announcements match your search criteria.
          </div>
        )}
      </div>

      {/* Create / Edit Modal */}
      <AnnouncementModal
        isOpen={isModalOpen}
        announcement={editingAnnouncement}
        onClose={() => {
          setIsModalOpen(false);
          setEditingAnnouncement(null);
        }}
      />

      {/* View Detail Modal */}
      {detailAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg bg-white border border-slate-200 rounded-xl shadow-2xl p-6 overflow-hidden animate-in fade-in duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-[11px] font-mono text-slate-500">
                {formatDate(detailAnnouncement.date)}
              </span>
              <span className="text-xs font-semibold text-slate-600 capitalize">
                {detailAnnouncement.targetAudience} Notice
              </span>
            </div>

            <div className="py-4 space-y-3">
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {detailAnnouncement.title}
              </h3>
              <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
                {detailAnnouncement.content}
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span>{detailAnnouncement.authorName} · {detailAnnouncement.authorRole}</span>
              <button
                onClick={() => setDetailAnnouncement(null)}
                className="px-4 py-2 font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={Boolean(announcementToDelete)}
        title="Delete Announcement"
        message={`Are you sure you want to permanently delete the notice "${announcementToDelete?.title}"?`}
        confirmLabel="Delete Notice"
        onConfirm={() => {
          if (announcementToDelete) {
            deleteAnnouncement(announcementToDelete.id);
            setAnnouncementToDelete(null);
          }
        }}
        onCancel={() => setAnnouncementToDelete(null)}
      />
    </div>
  );
};
