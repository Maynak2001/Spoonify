import { useState } from 'react';

// Username checking is not supported in the current backend
export const useUsername = () => {
  const [isChecking] = useState(false);

  const checkUsernameAvailable = async (_username: string): Promise<boolean> => {
    return true;
  };

  const updateUsername = async (_userId: string, _username: string): Promise<boolean> => {
    return false;
  };

  return { checkUsernameAvailable, updateUsername, isChecking };
};
