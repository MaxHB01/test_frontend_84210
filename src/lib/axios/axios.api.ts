import type { AxiosError } from "axios";

import { apiClient } from "./axios.client";

// Helper to extract Axios error safely
const extractError = (error: unknown) => {
	if (isAxiosError(error) && error.response) {
		return error.response.data;
	}
	return error;
};

// Type guard for AxiosError
function isAxiosError(error: unknown): error is AxiosError {
	return typeof error === "object" && error !== null && "isAxiosError" in error;
}

// GET request (generic)
export const getData = async <T>(endpoint: string): Promise<T> => {
	try {
		const response = await apiClient.get(endpoint);
		return response.data as T;
	} catch (error: unknown) {
		throw extractError(error);
	}
};

// GET request with params (generic)
export const getSpecifiedData = async <T>(endpoint: string, params?: object): Promise<T> => {
	try {
		const response = await apiClient.get(endpoint, { params });
		return response.data as T;
	} catch (error: unknown) {
		throw extractError(error);
	}
};

// POST request (generic)
export const postData = async <T>(endpoint: string, data: unknown): Promise<T> => {
	try {
		const response = await apiClient.post(endpoint, data);
		return response.data as T;
	} catch (error: unknown) {
		throw extractError(error);
	}
};
