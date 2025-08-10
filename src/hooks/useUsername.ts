import { useState } from 'react';
import { supabase } from '../utils/supabase';

export const useUsername = () => {
  const [isChecking, setIsChecking] = useState(false);

  const checkUsernameAvailable = async (username: string): Promise<boolean> => {
    if (!username || username.trim().length === 0) return false;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .ilike('username', username.trim())
        .single();

      if (error && error.code === 'PGRST116') {
        // No rows found, username is available
        return true;
      }
      
      // Username exists
      return false;
    } catch (error) {
      console.error('Error checking username:', error);
      return false;
    } finally {
      setIsChecking(false);
    }
  };

  const updateUsername = async (userId: string, username: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ username: username.trim() })
        .eq('id', userId);

      return !error;
    } catch (error) {
      console.error('Error updating username:', error);
      return false;
    }
  };

  return {
    checkUsernameAvailable,
    updateUsername,
    isChecking
  };
};