import { supabase } from '@/integrations/supabase/client';

export interface UserProfile {
  id: number;
  username: string;
  name: string;
  photo_url: string;
  verified: boolean;
  is_subscribed: boolean;
  has_liked: boolean;
  has_commented: boolean;
}

export interface ProfileStats {
  id?: number;
  abonnements: string;
  abonnes: string;
  jaime: string;
}

// ---- Profiles ----

export async function getUsers(): Promise<UserProfile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: true });
  if (error) {
    console.error('Error fetching profiles:', error);
    return [];
  }
  return data ?? [];
}

export async function addUser(user: Omit<UserProfile, 'id'>): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .insert(user)
    .select()
    .single();
  if (error) {
    console.error('Error adding profile:', error);
    return null;
  }
  return data;
}

export async function updateUser(id: number, fields: Partial<Omit<UserProfile, 'id'>>): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update(fields)
    .eq('id', id);
  if (error) console.error('Error updating profile:', error);
}

export async function removeUser(id: number): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', id);
  if (error) console.error('Error deleting profile:', error);
}

// ---- Stats ----

export async function getStats(): Promise<ProfileStats> {
  const { data, error } = await supabase
    .from('profile_stats')
    .select('*')
    .limit(1)
    .single();
  if (error || !data) {
    return { abonnements: '26', abonnes: '10K', jaime: '32.5K' };
  }
  return data;
}

export async function saveStats(stats: Omit<ProfileStats, 'id'>): Promise<void> {
  // Get the first row id
  const { data } = await supabase
    .from('profile_stats')
    .select('id')
    .limit(1)
    .single();
  if (data) {
    await supabase
      .from('profile_stats')
      .update(stats)
      .eq('id', data.id);
  }
}

// ---- Photo upload ----

export async function uploadProfilePhoto(file: File): Promise<string | null> {
  const ext = file.name.split('.').pop();
  const fileName = `${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('profile-photos')
    .upload(fileName, file);
  if (error) {
    console.error('Error uploading photo:', error);
    return null;
  }
  const { data: urlData } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(fileName);
  return urlData.publicUrl;
}
