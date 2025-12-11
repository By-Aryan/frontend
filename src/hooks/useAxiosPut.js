import { ApiPutRequest } from "@/axios/apiRequest";
import { useMutation } from "@tanstack/react-query";
import { usePost } from "./usePost";
import { data } from "autoprefixer";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;

function useAxiosPut(baseUrl, options = {}) {
  return useMutation({
    mutationFn: async (id) => {
      const response = await ApiPutRequest(`${baseUrl}${id}`);
      return response;
    },
    ...options,
  });
}

export default useAxiosPut;
