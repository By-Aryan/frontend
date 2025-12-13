import { useMutation } from "@tanstack/react-query";
import smartApi from "@/axios/dualBackendApi";

export const usePost = (url, options = {}) => {
  return useMutation({
    mutationFn: async (data) => {
      const response = await smartApi.post(url, data);
      return response.data;
    },
    ...options,
  });
};
