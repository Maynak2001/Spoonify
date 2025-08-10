import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

let supabaseInstance: SupabaseClient | null = null;

const getSupabaseClient = () => {
  if (!supabaseInstance) {
    supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        storageKey: 'spoonify-auth'
      }
    });
  }
  return supabaseInstance;
};

export const supabase = getSupabaseClient();

// Storage helpers
export const uploadImage = async (file: File, bucket: string = 'recipe-images') => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = fileName;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false
    });

  if (error) {
    console.error('Storage upload error:', error);
    throw error;
  }

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return publicUrl;
};

export const deleteImage = async (url: string, bucket: string = 'recipe-images') => {
  const path = url.split('/').pop();
  if (!path) return;

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
};