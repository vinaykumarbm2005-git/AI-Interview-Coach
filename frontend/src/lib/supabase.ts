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
  avatar_url?: string | null;
  created_at?: string;
}

export const ensureUserProfile = async (
  user: { id: string; email?: string; user_metadata?: Record<string, any> },
  fullNameOverride?: string
): Promise<UserProfileRow | null> => {
  if (!user || !user.id) return null;

  try {
    // Check if profile row exists for this user_id
    const { data: existing, error: selectError } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (selectError && selectError.code !== 'PGRST116') {
      console.warn('Profile fetch note:', selectError.message);
    }

    if (existing) {
      return existing as UserProfileRow;
    }

    // Insert new profile if none exists
    const meta = user.user_metadata || {};
    const email = user.email || meta.email || '';
    const fullName =
      fullNameOverride ||
      meta.full_name ||
      meta.name ||
      (email ? email.split('@')[0] : 'User');
    const avatarUrl = meta.avatar_url || meta.picture || null;

    const profileData = {
      user_id: user.id,
      full_name: fullName,
      email: email,
      avatar_url: avatarUrl
    };

    const { data: inserted, error: insertError } = await supabase
      .from('profiles')
      .insert([profileData])
      .select('*')
      .maybeSingle();

    if (insertError) {
      console.warn('Profile creation note:', insertError.message);
      return profileData;
    }

    return (inserted as UserProfileRow) || profileData;
  } catch (err) {
    console.error('Error in ensureUserProfile:', err);
    return null;
  }
};