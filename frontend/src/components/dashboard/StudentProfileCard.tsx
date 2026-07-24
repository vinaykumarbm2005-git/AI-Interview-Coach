import React, { useState } from 'react';
import { useInterview } from '../../context/InterviewContext';
import { BookOpen, GraduationCap, Hash, CheckCircle2, Edit3, X, Save, Upload, Phone, Building, Award, Code2, Linkedin, Github, Globe, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadProfileAvatar } from '../../lib/supabase';

export const StudentProfileCard: React.FC = () => {
  const { student, updateProfile } = useInterview();

  // Modal & Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form Fields State
  const [formData, setFormData] = useState({
    name: student.name || '',
    usn: student.usn || '',
    phone: student.phone || '',
    college: student.college || 'MSRIT',
    department: student.department || student.branch || 'Computer Science & Engineering',
    semester: student.semester || '7th Semester',
    cgpa: student.cgpa || '8.8',
    skills: student.skills || 'React, TypeScript, Python, Node.js',
    linkedinUrl: student.linkedinUrl || '',
    githubUrl: student.githubUrl || '',
    portfolioUrl: student.portfolioUrl || '',
    avatarUrl: student.avatarUrl || ''
  });

  const handleOpenEdit = () => {
    setFormData({
      name: student.name || '',
      usn: student.usn || '',
      phone: student.phone || '',
      college: student.college || 'MSRIT',
      department: student.department || student.branch || 'Computer Science & Engineering',
      semester: student.semester || '7th Semester',
      cgpa: student.cgpa || '8.8',
      skills: student.skills || 'React, TypeScript, Python, Node.js',
      linkedinUrl: student.linkedinUrl || '',
      githubUrl: student.githubUrl || '',
      portfolioUrl: student.portfolioUrl || '',
      avatarUrl: student.avatarUrl || ''
    });
    setNotification(null);
    setIsEditing(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!student.user_id) {
      setNotification({ type: 'error', message: 'Unable to upload: User not authenticated.' });
      return;
    }

    setUploadingImage(true);
    setNotification(null);

    const { url, error } = await uploadProfileAvatar(student.user_id, file);
    setUploadingImage(false);

    if (error || !url) {
      setNotification({ type: 'error', message: error?.message || 'Failed to upload image' });
    } else {
      setFormData(prev => ({ ...prev, avatarUrl: url }));
      setNotification({ type: 'success', message: 'Profile picture uploaded successfully!' });
    }
  };

  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return 'Full Name is required.';
    }

    if (formData.phone.trim()) {
      const phoneRegex = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s./0-9]{6,14}$/;
      if (!phoneRegex.test(formData.phone.trim())) {
        return 'Please enter a valid phone number.';
      }
    }

    if (formData.linkedinUrl.trim()) {
      if (!formData.linkedinUrl.toLowerCase().includes('linkedin.com') && !formData.linkedinUrl.startsWith('http')) {
        return 'Please enter a valid LinkedIn URL.';
      }
    }

    if (formData.githubUrl.trim()) {
      if (!formData.githubUrl.toLowerCase().includes('github.com') && !formData.githubUrl.startsWith('http')) {
        return 'Please enter a valid GitHub URL.';
      }
    }

    if (formData.portfolioUrl.trim()) {
      try {
        const urlToTest = formData.portfolioUrl.startsWith('http')
          ? formData.portfolioUrl
          : `https://${formData.portfolioUrl}`;
        new URL(urlToTest);
      } catch {
        return 'Please enter a valid Portfolio URL.';
      }
    }

    return null;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotification(null);

    const validationError = validateForm();
    if (validationError) {
      setNotification({ type: 'error', message: validationError });
      return;
    }

    setLoading(true);

    const result = await updateProfile({
      name: formData.name.trim(),
      usn: formData.usn.trim(),
      phone: formData.phone.trim(),
      college: formData.college.trim(),
      department: formData.department.trim(),
      branch: formData.department.trim(),
      semester: formData.semester.trim(),
      cgpa: formData.cgpa.trim(),
      skills: formData.skills.trim(),
      linkedinUrl: formData.linkedinUrl.trim(),
      githubUrl: formData.githubUrl.trim(),
      portfolioUrl: formData.portfolioUrl.trim(),
      avatarUrl: formData.avatarUrl.trim()
    });

    setLoading(false);

    if (result.success) {
      setNotification({ type: 'success', message: 'Profile updated successfully' });
      setTimeout(() => {
        setIsEditing(false);
      }, 900);
    } else {
      setNotification({ type: 'error', message: result.error || 'Unable to save profile. Please try again.' });
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 shadow-soft rounded-2xl p-5 relative overflow-hidden h-full flex flex-col justify-between">
      {/* Soft Top Green Accent Glow */}
      <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-600 to-green-500" />

      {/* Edit Profile Action Button */}
      <button
        onClick={handleOpenEdit}
        title="Edit Profile"
        className="absolute top-4 right-4 p-2 text-slate-400 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl transition-all border border-transparent hover:border-emerald-200"
      >
        <Edit3 className="w-4 h-4" />
      </button>

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

        {/* Details list: USN, Branch/Department, Semester, CGPA */}
        <div className="w-full space-y-3 text-left">
          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <Hash className="w-4 h-4 text-emerald-600" />
              <span>USN</span>
            </div>
            <span className="text-xs font-mono font-bold text-slate-900">{student.usn || 'N/A'}</span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              <span>Department</span>
            </div>
            <span className="text-xs font-semibold text-slate-900 text-right truncate max-w-[140px]">
              {student.department || student.branch || 'CSE'}
            </span>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Semester</span>
            </div>
            <span className="text-xs font-semibold text-slate-900">{student.semester || 'N/A'}</span>
          </div>

          {student.cgpa && (
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                <Award className="w-4 h-4 text-emerald-600" />
                <span>CGPA</span>
              </div>
              <span className="text-xs font-mono font-bold text-slate-900">{student.cgpa}</span>
            </div>
          )}

          {/* Social / Portfolio Links if available */}
          {(student.linkedinUrl || student.githubUrl || student.portfolioUrl) && (
            <div className="flex items-center justify-center gap-3 pt-2">
              {student.linkedinUrl && (
                <a
                  href={student.linkedinUrl.startsWith('http') ? student.linkedinUrl : `https://${student.linkedinUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition-colors border border-slate-200"
                  title="LinkedIn Profile"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
              )}
              {student.githubUrl && (
                <a
                  href={student.githubUrl.startsWith('http') ? student.githubUrl : `https://${student.githubUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition-colors border border-slate-200"
                  title="GitHub Profile"
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              {student.portfolioUrl && (
                <a
                  href={student.portfolioUrl.startsWith('http') ? student.portfolioUrl : `https://${student.portfolioUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-slate-100 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg transition-colors border border-slate-200"
                  title="Portfolio Website"
                >
                  <Globe className="w-4 h-4" />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* EDIT PROFILE MODAL OVERLAY */}
      {isEditing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl w-full max-w-xl max-h-[90vh] overflow-y-auto relative p-6 sm:p-8">
            
            {/* Header Accent & Close */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  <Edit3 className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 tracking-tight">Edit Student Profile</h3>
                  <p className="text-xs text-slate-500 font-medium">Update your details synced with Supabase</p>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification Alert */}
            {notification && (
              <div
                className={`mb-5 p-3.5 rounded-xl border text-xs font-semibold flex items-center gap-2.5 ${
                  notification.type === 'success'
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border-red-200 text-red-700'
                }`}
              >
                {notification.type === 'success' ? (
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                )}
                <span>{notification.message}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4">
              
              {/* Profile Image & Upload */}
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 mb-4">
                <img
                  src={formData.avatarUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=300"}
                  alt="Avatar Preview"
                  className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500 shadow-sm shrink-0"
                />
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-700 block">Profile Picture</label>
                  <div className="flex items-center gap-2">
                    <label className="px-3 py-1.5 bg-white border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold rounded-lg cursor-pointer transition-colors shadow-sm inline-flex items-center gap-1.5">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploadingImage ? 'Uploading...' : 'Upload Photo'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="text"
                    value={formData.avatarUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="Or enter Image URL"
                    className="w-full text-xs p-2 bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Grid Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* USN */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">USN</label>
                  <input
                    type="text"
                    value={formData.usn}
                    onChange={(e) => setFormData(prev => ({ ...prev, usn: e.target.value }))}
                    placeholder="e.g. 1MS21CS042"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-mono font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+91 9876543210"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* College */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">College / Institute</label>
                  <input
                    type="text"
                    value={formData.college}
                    onChange={(e) => setFormData(prev => ({ ...prev, college: e.target.value }))}
                    placeholder="MSRIT"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Department / Branch */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Department / Branch</label>
                  <input
                    type="text"
                    value={formData.department}
                    onChange={(e) => setFormData(prev => ({ ...prev, department: e.target.value }))}
                    placeholder="Computer Science & Engineering"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Semester */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">Semester</label>
                  <input
                    type="text"
                    value={formData.semester}
                    onChange={(e) => setFormData(prev => ({ ...prev, semester: e.target.value }))}
                    placeholder="7th Semester"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* CGPA */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">CGPA</label>
                  <input
                    type="text"
                    value={formData.cgpa}
                    onChange={(e) => setFormData(prev => ({ ...prev, cgpa: e.target.value }))}
                    placeholder="8.8"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Skills */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Skills</label>
                  <input
                    type="text"
                    value={formData.skills}
                    onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                    placeholder="React, TypeScript, Python, Node.js"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* LinkedIn */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">LinkedIn URL</label>
                  <input
                    type="text"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, linkedinUrl: e.target.value }))}
                    placeholder="https://linkedin.com/in/username"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* GitHub */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-700 block">GitHub URL</label>
                  <input
                    type="text"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, githubUrl: e.target.value }))}
                    placeholder="https://github.com/username"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>

                {/* Portfolio */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-slate-700 block">Portfolio URL</label>
                  <input
                    type="text"
                    value={formData.portfolioUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, portfolioUrl: e.target.value }))}
                    placeholder="https://yourportfolio.com"
                    className="w-full text-xs p-2.5 bg-slate-50 border border-slate-200 rounded-xl font-semibold text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4 mt-6">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  <span>{loading ? 'Saving...' : 'Save Changes'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}
    </div>
  );
};
