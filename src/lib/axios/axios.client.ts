import axios from "axios";

import { Environment } from "@/common/config/environment";

export const apiClient = axios.create({
	baseURL: Environment.API_URL,
	timeout: Environment.TIMEOUT,
	headers: {
		"Content-Type": "application/json",
	},
});
