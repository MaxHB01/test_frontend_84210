"use server";

import axios from "axios";

import { auth, signOut } from "@/auth";
import { Environment } from "@/common/config/environment";
import { logger } from "@/lib/logger";

const apiClient = axios.create({
	baseURL: Environment.API_URL,
	timeout: Environment.TIMEOUT,
	headers: { "Content-Type": "application/json" },
});

// REQUEST INTERCEPTOR
apiClient.interceptors.request.use(
	async config => {
		logger.info("API Request to: " + config.url);
		const session = await auth();
		const token = session?.user?.accessToken;

		if (token) {
			config.headers = config.headers ?? {};
			config.headers.Authorization = `Bearer ${token}`;
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

		// Handle unauthorized → force logout
		if (status === 401) {
			logger.warn("401 detected — signing out user");
			await signOut({ redirectTo: "/login" });
		}

		return Promise.reject(error);
	}
);

export { apiClient };
