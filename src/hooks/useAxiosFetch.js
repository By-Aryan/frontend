import { fetchData } from "@/utilis/fetchData";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import api from "@/axios/axios.interceptor";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

function useAxiosFetch(url) {
  const queryClient = useQueryClient();
  const propertyIdsRef = useRef(new Set());

  // List of endpoints that should have shorter cache times (but still cached)
  const dynamicEndpoints = [
    '/property/boosted-properties',
    '/property/analytics/',
    '/property/getProperties',
    '/subscription/',
    '/enhanced-boost/',
    '/requestproperty/pending-driver-request',
    '/requestproperty/accepted-driver-request-byagent',
    '/driver/agent/assignments',
    '/assignments/submissions'
  ];

  const isDynamic = dynamicEndpoints.some(endpoint => url?.includes(endpoint));
  const isPropertyEndpoint = url?.includes('/property/');
  const isDriverRequest = url?.includes('/requestproperty/') || url?.includes('/driver/') || url?.includes('/assignments/');

  const query = useQuery({
    queryKey: ["fetchData", url], // Stable query key - no timestamp
    queryFn: fetchData,
    enabled: !!url, // Only run query if URL is provided
    staleTime: isDynamic ? 1000 * 30 : 1000 * 60 * 5, // 30 seconds for dynamic, 5 min for static
    cacheTime: isDynamic ? 1000 * 60 * 2 : 1000 * 60 * 10, // 2 min cache for dynamic, 10 min for static
    refetchOnWindowFocus: isDynamic, // Refetch dynamic data when window gains focus
    refetchOnMount: isDynamic ? 'always' : true, // Always refetch dynamic data on mount
    refetchInterval: isDriverRequest ? 1000 * 30 : (isDynamic ? 1000 * 60 : false), // Driver requests: 30 seconds, other dynamic: 1 minute
  });

  // Extract property IDs from response data for update polling
  useEffect(() => {
    if (isPropertyEndpoint && query.data?.data) {
      const properties = Array.isArray(query.data.data) ? query.data.data : [query.data.data];
      const newPropertyIds = new Set();
      
      properties.forEach(property => {
        if (property?._id) {
          newPropertyIds.add(property._id);
        }
      });
      
      propertyIdsRef.current = newPropertyIds;
    }
  }, [query.data, isPropertyEndpoint]);

  // Poll for property updates every 30 seconds for property endpoints
  useEffect(() => {
    if (!isPropertyEndpoint || propertyIdsRef.current.size === 0) return;

    const pollForUpdates = async () => {
      try {
        const propertyIds = Array.from(propertyIdsRef.current);
        const response = await api.post('/property/check-property-updates', {
          propertyIds: propertyIds
        });

        if (response.data.success && response.data.hasUpdates) {
          console.log('🔄 Property updates detected, refreshing data...');
          queryClient.invalidateQueries(["fetchData", url]);
        }
      } catch (error) {
        // Silently handle errors to avoid console spam
        if (error.response?.status !== 401) {
          console.log('Update check failed:', error.message);
        }
      }
    };

    const interval = setInterval(pollForUpdates, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [isPropertyEndpoint, queryClient, url]);

  return query;
}
export default useAxiosFetch;
