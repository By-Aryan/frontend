import { ApiFetchRequest } from "@/axios/apiRequest";

export const fetchData = async ({ queryKey }) => {

  const [_key, url] = queryKey;
  if (!url) throw new Error("URL is required");

  try {
    const response = await ApiFetchRequest(url);

    if (response.status >= 200 && response.status < 300) {
      return response.data;
    }

    if (response.response?.status === 401) {
      throw {
        response: { status: 401 },
        message: "Authentication error",
        url
      };
    }

    throw response;
  } catch (error) {
    throw error;
  }
};