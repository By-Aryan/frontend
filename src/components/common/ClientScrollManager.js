"use client";

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import scrollLockManager from '@/utils/scrollLockManager';

const ClientScrollManager = () => {
  const pathname = usePathname();

  useEffect(() => {
    // Force unlock scroll on every route change
    scrollLockManager.forceUnlock();
  }, [pathname]);

  useEffect(() => {
    // Unlock on mount and cleanup on unmount
    scrollLockManager.forceUnlock();

    return () => {
      scrollLockManager.forceUnlock();
    };
  }, []);

  // Also handle focus events (when user returns to tab)
  useEffect(() => {
    const handleFocus = () => {
      scrollLockManager.forceUnlock();
    };

    window.addEventListener('focus', handleFocus);
    return () => {
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  return null;
};

export default ClientScrollManager;