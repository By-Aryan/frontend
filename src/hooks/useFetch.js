
import { useQuery } from "@tanstack/react-query";
import api from "@/axios/axios.interceptor";

const fetchProperty = async ({ queryKey }) => {
    const [, url] = queryKey; // Extract URL from queryKey
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch data");
    }
  };

  
function useFetch(url) {
  return useQuery({
    queryKey: ["fetchData", url], // Avoid unnecessary cache resets
    queryFn: fetchProperty,
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false, // Prevent refetching when switching tabs
  });
}

export default useFetch
