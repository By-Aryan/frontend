import { ApiDeleteRequest, ApiPostRequest,} from "@/axios/apiRequest";
import { useMutation } from "@tanstack/react-query";
import { usePost } from "./usePost";
import { data } from "autoprefixer";
const api_url = process.env.NEXT_PUBLIC_API_BASE_URL;


 function useAxiosDelete (url, options = {}) {
  return useMutation({
    mutationFn: async () => {
      const response = await ApiDeleteRequest(url);
      return response;
    },
    ...options,
  });
};

export default useAxiosDelete;
