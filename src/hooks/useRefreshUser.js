import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/endpoints';
import { useCallback } from 'react';

export const useRefreshUser = () => {
  const { setUser } = useAuth(); // ✅ Now setUser is available

  const refreshUser = useCallback(async () => {
    try {
      const response = await authAPI.getProfile();
      if (response && response.data) {
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData); // ✅ This will work now
        return userData;
      }
      return null;
    } catch (error) {
      console.error('Failed to refresh user:', error);
      return null;
    }
  }, [setUser]);

  return refreshUser;
};