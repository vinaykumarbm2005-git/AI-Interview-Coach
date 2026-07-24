import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);

export interface UserProfileRow {
  id?: string;
  user_id: string;
  full_name: string;
  email: string;
  usn?: string;
  phone?: string;
  college?: string;
  department?: string;
  semester?: string;
  cgpa?: string;
  skills?: string;
  linkedin_url?: string;
  github_url?: string;
  portfolio_url?: string;
  profile_image?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const fetchUserProfile = async (userId: string): Promise<UserProfileRow | null> => {
  if (!userId) return null;
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      console.warn('Error fetching profile:', error.message);
    }
    return (data as UserProfileRow) || null;
  } catch (err) {
    console.error('Fetch profile exception:', err);
    return null;
  }
};

export const ensureUserProfile = async (
  user: { id: string; email?: string; user_metadata?: Record<string, any> },
  fullNameOverride?: string
): Promise<UserProfileRow | null> => {
  if (!user || !user.id) return null;

  try {
    const existing = await fetchUserProfile(user.id);
    if (existing) {
      return existing;
    }

    const meta = user.user_metadata || {};
    const email = user.email || meta.email || '';
    const fullName =
      fullNameOverride ||
      meta.full_name ||
      meta.name ||
      (email ? email.split('@')[0] : 'User');
    const avatarUrl = meta.avatar_url || meta.picture || null;

    const profileData: Partial<UserProfileRow> = {
      user_id: user.id,
      full_name: fullName,
      email: email,
      usn: meta.usn || '1MS21CS042',
      department: meta.branch || 'Computer Science & Engineering',
      semester: meta.semester || '7th Semester',
      college: 'MSRIT',
      cgpa: '8.8',
      skills: 'React, TypeScript, Python, Node.js',
      profile_image: avatarUrl
    };

    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select('*')
      .maybeSingle();

    if (insertError) {
      console.warn('Profile creation note:', insertError.message);
      return profileData as UserProfileRow;
    }

    return (inserted as UserProfileRow) || (profileData as UserProfileRow);
  } catch (err) {
    console.error('Error in ensureUserProfile:', err);
    return null;
  }
};

export const updateUserProfile = async (
  userId: string,
  updates: Partial<UserProfileRow>
): Promise<{ data: UserProfileRow | null; error: Error | null }> => {
  if (!userId) return { data: null, error: new Error('User ID required') };

  try {
    const updatePayload = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('user_id', userId)
      .select('*')
      .maybeSingle();

    if (error) {
      return { data: null, error: new Error(error.message) };
    }

    return { data: data as UserProfileRow, error: null };
  } catch (err: any) {
    return { data: null, error: err || new Error('Network error updating profile') };
  }
};

export const uploadProfileAvatar = async (
  userId: string,
  file: File
): Promise<{ url: string | null; error: Error | null }> => {
  try {
    const fileExt = file.name.split('.').pop() || 'png';
    const fileName = `${userId}-${Date.now()}.${fileExt}`;
    const filePath = `avatars/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(filePath, file, { upsert: true });

    if (uploadError) {
      return { url: null, error: new Error(uploadError.message) };
    }

    const { data: publicUrlData } = supabase.storage
      .from('avatars')
      .getPublicUrl(filePath);

    return { url: publicUrlData.publicUrl, error: null };
  } catch (err: any) {
    return { url: null, error: err || new Error('Failed to upload image') };
  }
};