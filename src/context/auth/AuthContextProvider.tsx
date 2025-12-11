'use client';
import { getAuthState } from '@/utils/authUtils';
import { useEffect, useState } from 'react';
import { AuthContext } from './AuthContext';

type Auth = {
  accessToken: string;
  refreshToken: string;
  roles: string[];
  user: any;
};

const initialAuth: Auth = {
  accessToken: '',
  refreshToken: '',
  roles: [],
  user: {},
};

const AuthContextProvider = ({ children }: any) => {
  const [auth, setAuth] = useState<Auth>(initialAuth);
  const [persist, setPersist] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [hasApiError, setHasApiError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const persistedAuth = localStorage.getItem('persist');
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');
        const rolesStr = localStorage.getItem('roles');
        const userStr = localStorage.getItem('user');

        if (persistedAuth) {
          setPersist(JSON.parse(persistedAuth));
        }

        if (accessToken && refreshToken) {
          let roles: string[] = [];
          let user = {};

          try {
            if (rolesStr) roles = JSON.parse(rolesStr);
          } catch (e) {
            console.error('Error parsing roles:', e);
          }

          try {
            if (userStr) user = JSON.parse(userStr);
          } catch (e) {
            console.error('Error parsing user data:', e);
          }

          const newAuthState = {
            accessToken,
            refreshToken,
            roles,
            user,
          };
          setAuth(newAuthState);
        } else {
          console.log('No valid tokens found in localStorage');
        }

        getAuthState();

        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing auth state:', error);
        setIsInitialized(true);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const handleStorageChange = () => {
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

        if (!accessToken || !refreshToken) {
          setAuth(initialAuth);
        }
      };

      const interval = setInterval(handleStorageChange, 1000);
      window.addEventListener('storage', handleStorageChange);

      return () => {
        clearInterval(interval);
        window.removeEventListener('storage', handleStorageChange);
      };
    }
  }, []);

  const login = (tokens: { accessToken: string; refreshToken: string }, user: any, roles: string[] = []) => {

    const newAuth = {
      accessToken: tokens.accessToken || '',
      refreshToken: tokens.refreshToken || '',
      roles,
      user,
    };

    setAuth(newAuth);

    if (tokens.accessToken) {
      localStorage.setItem('accessToken', tokens.accessToken);
    }
    if (tokens.refreshToken) {
      localStorage.setItem('refreshToken', tokens.refreshToken);
    }
    localStorage.setItem('roles', JSON.stringify(roles));
    localStorage.setItem('user', JSON.stringify(user));

    getAuthState();

    setHasApiError(false);
  };

  const handleApiError = (error: any) => {
    setHasApiError(true);

    return error;
  };

  const logout = () => {
    setAuth(initialAuth);

    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('roles');
    localStorage.removeItem('user');
    localStorage.removeItem('persist');

    localStorage.removeItem('name');
    localStorage.removeItem('id');
    localStorage.removeItem('loginSuccessfull');
    localStorage.removeItem('isPlanActive');
    localStorage.removeItem('remainingContacts');

    setHasApiError(false);
  };

  const isAuthenticated = !!auth.accessToken && !!auth.refreshToken;

  return (
    <AuthContext.Provider value={{
      auth,
      setAuth,
      persist,
      setPersist,
      login,
      logout,
      isAuthenticated,
      isInitialized,
      hasApiError,
      handleApiError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;