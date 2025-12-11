import { useMutation } from "@tanstack/react-query";
import api from "@/axios/axios.interceptor";

export const usePost = (url, options = {}) => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await api.post(url, data);
      return response.data;
    },
    ...options,
  });
};
