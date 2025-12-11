import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// Global cache to share data across components
let globalCityCache = {
  data: null,
  timestamp: 0,
  loading: false,
  CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
};

// Default fallback data
const DEFAULT_CITIES = [
  { name: "Dubai", count: 120 },
  { name: "Abu Dhabi", count: 85 },
  { name: "Sharjah", count: 45 },
  { name: "Ras Al Khaimah", count: 25 },
  { name: "Ajman", count: 15 },
  { name: "Umm Al Quwain", count: 8 }
];

// Subscribers for cache updates
const subscribers = new Set();

const notifySubscribers = (data) => {
  subscribers.forEach(callback => callback(data));
};

export const useCityData = () => {
  const [cityCounts, setCityCounts] = useState(() => 
    globalCityCache.data || DEFAULT_CITIES
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Subscribe to cache updates
  useEffect(() => {
    const handleCacheUpdate = (data) => {
      setCityCounts(data);
      setIsLoading(false);
    };

    subscribers.add(handleCacheUpdate);
    return () => subscribers.delete(handleCacheUpdate);
  }, []);

  const fetchCityData = useCallback(async (forceRefresh = false) => {
    const now = Date.now();
    
    // Return cached data if available and not expired
    if (!forceRefresh && globalCityCache.data && 
        (now - globalCityCache.timestamp < globalCityCache.CACHE_DURATION)) {
      console.log('📊 useCityData: Using cached data');
      setCityCounts(globalCityCache.data);
      return globalCityCache.data;
    }

    // Prevent multiple simultaneous requests
    if (globalCityCache.loading) {
      console.log('📊 useCityData: Request already in progress');
      return globalCityCache.data || DEFAULT_CITIES;
    }

    globalCityCache.loading = true;
    setIsLoading(true);
    setError(null);

    try {
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://localhost:5001/api/v1';
      
      const response = await Promise.race([
        axios.get(`${API_BASE_URL}/property/header-menu-city-counts`, {
          timeout: 5000,
          headers: {
            'Cache-Control': 'max-age=300',
          }
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        )
      ]);

      if (response.data.success && response.data.data?.headerCities) {
        const cityData = response.data.data.headerCities;
        
        // Update global cache
        globalCityCache.data = cityData;
        globalCityCache.timestamp = now;
        
        console.log('✅ useCityData: Fresh data loaded', cityData.length, 'cities');
        
        // Notify all subscribers
        notifySubscribers(cityData);
        
        return cityData;
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.warn('⚠️ useCityData: Failed to fetch data:', err.message);
      setError(err.message);
      
      // Use fallback data on error
      const fallbackData = globalCityCache.data || DEFAULT_CITIES;
      setCityCounts(fallbackData);
      return fallbackData;
    } finally {
      globalCityCache.loading = false;
      setIsLoading(false);
    }
  }, []);

  // Initial fetch - only run once on mount
  useEffect(() => {
    fetchCityData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    cityCounts,
    isLoading,
    error,
    refetch: () => fetchCityData(true),
    isStale: () => {
      const now = Date.now();
      return !globalCityCache.data || 
             (now - globalCityCache.timestamp > globalCityCache.CACHE_DURATION);
    }
  };
};

export default useCityData;