import api from "./axios.interceptor";

const handle401Error = (error) => {
    console.warn('API Authentication error 401');
    return error;
};

export async function LoginRequest(url, request) {
    try {
        const res = await api(url, request)
        return res
    } catch (error) {
        return error
    }
}

export async function ApiPutRequest(url, request) {
    try {
        const res = await api.put(url, request)
        return res
    } catch (error) {
        if (error.response && error.response.status == 401) {
            return handle401Error(error);
        } else {
            throw error
        }
    }
}

export async function ApiPostRequest(url, request) {
    try {
        const res = await api.post(url, request)
        return res
    } catch (error) {
        if (error.response && error.response.status == 401) {
            return handle401Error(error);
        } else {
            throw error
        }
    }
}

export async function ApiDeleteRequest(url) {
    try {
        const res = await api.delete(url)
        return res
    } catch (error) {
        if (error.response && error.response.status == 401) {
            return handle401Error(error);
        } else {
            throw error
        }
    }
}

export async function ApiFetchRequest(url) {
    try {
        const res = await api.get(url);
        return res;
    } catch (error) {
        if (error.response && error.response.status == 401) {
            return handle401Error(error);
        } else {
            return error;
        }
    }
}