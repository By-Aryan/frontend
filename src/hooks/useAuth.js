"use client";
import { AuthContext } from '@/context/auth/AuthContext';
import { useContext } from 'react';

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthContextProvider');
  }

  return context;
}; 