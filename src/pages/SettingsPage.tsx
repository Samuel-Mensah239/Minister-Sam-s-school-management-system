import React from 'react';
import {
  Building,
  Shield,
  Layers,
  Database,
  Server,
  Key,
  CheckCircle2,
  FileCode,
  GraduationCap,
} from 'lucide-react';
import { useSchool } from '../context/SchoolContext';

export const SettingsPage: React.FC = () => {
  const { academicYear, currentTerm } = useSchool();

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Academy Profile Card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-4 pb-4 border-b border-slate-100">
          <div className="w-14 h-14 rounded-xl border border-slate-200 overflow-hidden bg-slate-50 shrink-0">
            <img
              src="/src/assets/images/msa_school_crest_1790646026542.jpg"
              alt="MSA Crest"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-extrabold text-slate-900">
              Minister Sam Academy (MSA)
            </h2>
            <p className="text-xs text-slate-500">
              Secondary & Senior Academic Directorate · Established 2018
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Motto</span>
            <span className="font-semibold text-slate-800">"Excellence, Truth & Integrity"</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Campus Location</span>
            <span className="font-semibold text-slate-800">Victoria Hills Campus</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Current Academic Year</span>
            <span className="font-mono font-semibold text-slate-800">{academicYear}</span>
          </div>
          <div>
            <span className="text-slate-500 font-semibold block text-[10px] uppercase">Active Term</span>
            <span className="font-semibold text-slate-800">{currentTerm}</span>
          </div>
        </div>
      </div>

      {/* Role-Based Access Control (RBAC) Architecture Matrix */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-slate-700" />
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            RBAC Permission Matrix (Four Core Roles)
          </h3>
        </div>
        <p className="text-xs text-slate-500 leading-relaxed">
          The application architecture enforces strict role separation. During this frontend iteration, the active role can be switched via the top navigation bar to evaluate user experiences across all four perspectives:
        </p>

        <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Scope & Authorization</th>
                <th className="py-2.5 px-3">Timetable Privileges</th>
                <th className="py-2.5 px-3">Academic Results</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Administrator</td>
                <td className="py-2.5 px-3">Full CRUD over Students, Faculty, Classes, and Announcements</td>
                <td className="py-2.5 px-3 text-emerald-700 font-medium">Create periods, draft/publish/archive</td>
                <td className="py-2.5 px-3">Edit, delete, and audit all student scores</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Teacher (Faculty)</td>
                <td className="py-2.5 px-3">Class attendance roll-call, score entry for assigned courses</td>
                <td className="py-2.5 px-3 text-slate-600">View published master schedule & personal teaching slots</td>
                <td className="py-2.5 px-3">Enter scores and compute terminal grades</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Student</td>
                <td className="py-2.5 px-3">Read-only personal timetable, enrolled classes, and notices</td>
                <td className="py-2.5 px-3 text-slate-600">View active published weekly timetable</td>
                <td className="py-2.5 px-3">View personal exam performance and GPA</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-bold text-slate-900">Parent / Guardian</td>
                <td className="py-2.5 px-3">Read-only ward attendance history and official school circulars</td>
                <td className="py-2.5 px-3 text-slate-600">View ward's weekly lesson timetable</td>
                <td className="py-2.5 px-3">Print official authenticated terminal report card</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Senior Software Engineer Architectural Blueprint for Backend Evolution */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-6 shadow-sm space-y-4 border border-slate-800">
        <div className="flex items-center gap-2">
          <Server className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            Backend Evolution & Persistence Architecture Roadmap
          </h3>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          In alignment with project directives, this iteration cleanly decouples state management (<code className="font-mono text-amber-300 text-[11px]">SchoolContext.tsx</code>) and data models (<code className="font-mono text-amber-300 text-[11px]">src/types/index.ts</code>) from presentation components. When transitioning to full-stack production, replace the local mock state with standard API contracts:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block text-[11px]">RESTful API Route Contracts</span>
            <div className="text-slate-400">GET/POST   /api/v1/students</div>
            <div className="text-slate-400">GET/PUT    /api/v1/students/:id</div>
            <div className="text-slate-400">GET/POST   /api/v1/timetables</div>
            <div className="text-slate-400">POST       /api/v1/timetables/:id/publish</div>
            <div className="text-slate-400">POST       /api/v1/attendance/batch</div>
            <div className="text-slate-400">POST       /api/v1/results/evaluate</div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 space-y-1">
            <span className="text-amber-400 font-bold block text-[11px]">Target Relational Database Schema</span>
            <div className="text-slate-400">TABLE users (id, role, password_hash)</div>
            <div className="text-slate-400">TABLE students (id, student_id, class_id)</div>
            <div className="text-slate-400">TABLE timetables (id, term, status)</div>
            <div className="text-slate-400">TABLE timetable_entries (id, day, start, end)</div>
            <div className="text-slate-400">TABLE exam_results (id, student_id, score)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
