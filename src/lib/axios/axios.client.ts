import axios from "axios";

import { auth } from "@/auth";
import { Environment } from "@/common/config/environment";

import { logger } from "../logger";

export const apiClient = axios.create({
	baseURL: Environment.API_URL,
	timeout: Environment.TIMEOUT,
	headers: { "Content-Type": "application/json" },
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
	async config => {
		logger.info("API Request to: " + config.url);

		if (config.url?.includes("/auth/refresh")) {
			return config;
		}

		const session = await auth();

		if (session?.accessToken) {
			config.headers.Authorization = `Bearer ${session.accessToken}`;
		}

		return config;
	},
	error => Promise.reject(error)
);

// RESPONSE INTERCEPTOR
apiClient.interceptors.response.use(
	response => response,
	async error => {
		const status = error.response?.status;

		// Log all failures
		logger.error("API Request Failed", {
			url: error.config?.url,
			status,
			code: error.code,
		});

		return Promise.reject(error);
	}
);
