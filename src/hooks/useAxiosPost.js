import { ApiPostRequest,} from "@/axios/apiRequest";
import { useMutation } from "@tanstack/react-query";
import { usePost } from "./usePost";
import { data } from "autoprefixer";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;


 function useAxiosPost (url, options = {}) {
  return useMutation({
    mutationFn: async (data) => {
      const response = await ApiPostRequest(url, data);
      return response;
    },
    ...options,
  });
};

export default useAxiosPost;
