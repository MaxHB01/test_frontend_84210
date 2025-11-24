"use server";

import { auth } from "@/auth";
import { logger } from "@/lib/";

import { apiClient } from "./axios.client";

apiClient.interceptors.request.use(
	async config => {
		const session = await auth();
		const token = session?.accessToken;

		if (token) {
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${token}`;
		}

		return config;
	},
	error => Promise.reject(error)
);

apiClient.interceptors.response.use(
	response => response,
	error => {
		logger.error("API Request Failed", {
			context: {
				url: error.config?.url,
				code: error.code,
				status: error.response?.status,
			},
		});
	}
);
