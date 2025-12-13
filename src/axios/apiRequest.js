/**
 * API Request Wrapper - Now with Dual Backend Support!
 *
 * This module automatically routes requests to the correct backend:
 * - Server 1: User & Property Management
 * - Server 2: Payments, Admin & Media
 *
 * No changes needed in your components - routing happens automatically!
 */

import smartApi from "./dualBackendApi";

const handle401Error = (error) => {
    console.warn('API Authentication error 401');
    return error;
};

export async function LoginRequest(url, request) {
    try {
        const res = await smartApi.post(url, request)
        return res
    } catch (error) {
        return error
    }
}

export async function ApiPutRequest(url, request) {
    try {
        const res = await smartApi.put(url, request)
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
        const res = await smartApi.post(url, request)
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
        const res = await smartApi.delete(url)
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
        const res = await smartApi.get(url);
        return res;
    } catch (error) {
        if (error.response && error.response.status == 401) {
            return handle401Error(error);
        } else {
            return error;
        }
    }
}

// Export smartApi for direct use if needed
export { smartApi };
export default smartApi;