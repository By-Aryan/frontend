"use client";

import useAxiosFetch from '@/hooks/useAxiosFetch';
import { useAuth } from '@/hooks/useAuth';

export const useSubscription = () => {
  const { isAuthenticated } = useAuth();
  
  const { 
    data: subscriptionData, 
    isLoading, 
    error, 
    refetch 
  } = useAxiosFetch(
    isAuthenticated ? '/subscription/status' : null,
    {
      enabled: isAuthenticated
    }
  );

  return {
    subscriptionStatus: subscriptionData || null,
    isLoading,
    error,
    refetchSubscription: refetch,
    hasActiveSubscription: subscriptionData?.hasActiveSubscription || false,
    remainingContacts: subscriptionData?.remainingContacts || { buy: 0, rent: 0, total: 0 }
  };
};
