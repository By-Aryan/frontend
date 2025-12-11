import { useState, useEffect } from 'react';
import api from '@/axios/axios.interceptor';

export const useSubscriptionData = () => {
  const [planData, setPlanData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchPlanData = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      // Add cache busting parameter
      const response = await api.get(`/subscription/user-plan?_t=${Date.now()}`);
      setPlanData(response.data);
    } catch (error) {
      console.error('Error fetching plan data:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPlanData();
  }, []);

  return {
    data: planData,
    isLoading,
    isError,
    refetch: fetchPlanData
  };
};

export const usePaymentHistory = (filter = 'all') => {
  const [paymentData, setPaymentData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const fetchPaymentHistory = async () => {
    try {
      setIsLoading(true);
      setIsError(false);

      const params = {
        status: filter === 'all' ? 'all' : filter,
        limit: 100,
        offset: 0,
        _t: Date.now() // Cache busting
      };

      const response = await api.get('/subscription/payment-history', { params });
      setPaymentData(response.data);
    } catch (error) {
      console.error('Error fetching payment history:', error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPaymentHistory();
  }, [filter]);

  return {
    data: paymentData,
    isLoading,
    isError,
    refetch: fetchPaymentHistory
  };
};