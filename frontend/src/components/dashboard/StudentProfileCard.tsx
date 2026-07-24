import React from 'react';
import { useInterview } from '../../context/InterviewContext';
import { BookOpen, GraduationCap, Hash, CheckCircle2 } from 'lucide-react';

export const StudentProfileCard: React.FC = () => {
  const { student } = useInterview();

  return (
    <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-5 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Soft Top Green Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-green-500" />
      
      <div className="flex flex-col items-center text-center">
        {/* Profile Picture */}
        <div className="relative mb-3 group">
          <img
            src={student.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"}
            alt={student.name || "Student Profile"}
            className="w-24 h-24 rounded-full object-cover border-4 border-emerald-100 shadow-md group-hover:scale-105 transition-transform"
          />
          <div className="absolute bottom-0 right-0 w-6 h-6 bg-emerald-600 border-2 border-white rounded-full flex items-center justify-center text-white shadow">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Student Name & Email */}
        <h2 className="text-lg font-bold text-slate-900 tracking-tight">{student.name || "Student"}</h2>
        {student.email && (
          <p className="text-xs text-slate-500 font-medium truncate max-w-[200px] mt-0.5">{student.email}</p>
        )}
        <p className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full mt-1 border border-emerald-200">
          Verified Student
        </p>

        <div className="w-full border-t border-slate-100 my-4" />

        {/* Details list: USN, Branch, Semester */}
        <div className="w-full space-y-3 text-left">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Hash className="w-4 h-4 text-emerald-600" />
              <span>USN</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">{student.usn}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Branch</span>
            </div>
            <span className="text-xs font-semibold text-slate-900 text-right truncate max-w-[140px]">{student.branch}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Semester</span>
            </div>
            <span className="text-xs font-semibold text-slate-900">{student.semester}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
