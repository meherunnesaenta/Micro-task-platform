import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/endpoints';
import { useCallback } from 'react';

export const useRefreshUser = () => {
  const { setUser } = useAuth();

  const refreshUser = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      localStorage.setItem('user', JSON.stringify(response));
      setUser(response);
      return response;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  }, [setUser]);

  return refreshUser;
};

