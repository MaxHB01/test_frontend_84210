import axios from "axios";
import NextAuth, { type Session, type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { apiClient, logger } from "./lib";

interface LoginResponse {
	accessToken: string;
	refreshToken: string;
	expiresIn: number;
}

interface UserProfileResponse {
	id: string;
	email: string;
	firstName: string;
	lastName: string;
	roles: string[];
}

interface ExtendedToken {
	id?: string;
	email?: string;
	firstName?: string;
	lastName?: string;
	roles?: string[] | null;
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
	error?: string;
	[key: string]: unknown;
}

interface ExtendedSession extends Session {
	accessToken?: string;
	refreshToken?: string;
	expiresAt?: number;
	user: {
		id: string;
		email: string;
		firstName: string;
		lastName: string;
		roles: string[];
		emailVerified: null;
	};
}

/* --------------------------------- HELPERS -------------------------------- */

async function loginWithCredentials(email: string, password: string) {
	return apiClient.post<LoginResponse>("/auth/login", { email, password });
}

async function fetchUserProfile(accessToken: string) {
	return apiClient.get<UserProfileResponse>("/user/me", {
		headers: { Authorization: `Bearer ${accessToken}` },
	});
}

async function fetchUserProfileDirect(accessToken: string) {
	const apiUrl = process.env.API_URL;
	if (!apiUrl) {
		throw new Error("API_URL is not configured");
	}

	return axios.get<UserProfileResponse>(`${apiUrl}/user/me`, {
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json",
		},
	});
}

/* ----------------------------- AUTHORIZE USER ----------------------------- */

async function authorizeUser(
	credentials: Partial<Record<"email" | "password", unknown>>
): Promise<User | null> {
	const email = credentials.email as string | undefined;
	const password = credentials.password as string | undefined;

	if (!email || !password) return null;

	try {
		const loginResponse = await loginWithCredentials(email, password);
		if (!loginResponse.data) return null;

		const { accessToken, refreshToken, expiresIn } = loginResponse.data;

		const userRes = await fetchUserProfile(accessToken);
		if (!userRes.data) return null;

		const { id, firstName, lastName, roles } = userRes.data;

		return {
			id,
			email,
			firstName,
			lastName,
			roles,
			accessToken,
			refreshToken,
			expiresIn,
		};
	} catch (err) {
		if (axios.isAxiosError(err)) {
			logger.error("[LOGIN FAILED]", {
				status: err.response?.status,
				data: err.response?.data,
			});
		}
		return null;
	}
}

/* ----------------------------- BUILD TOKEN ----------------------------- */

function buildInitialToken(token: ExtendedToken, user: User): ExtendedToken {
	const now = Date.now();
	const expiresIn = user.expiresIn ?? 500;

	// IMPORTANT FIX: never store empty arrays in JWT!
	const normalizedRoles = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles : null;

	return {
		...token,
		id: user.id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		roles: normalizedRoles,
		accessToken: user.accessToken,
		refreshToken: user.refreshToken,
		expiresAt: now + expiresIn * 1000,
	};
}

function isTokenValid(token: ExtendedToken): boolean {
	return typeof token.expiresAt === "number" && Date.now() < token.expiresAt;
}

/* ------------------------- HANDLE TOKEN UPDATE ------------------------- */

async function handleTokenUpdate(tk: ExtendedToken): Promise<ExtendedToken> {
	try {
		const userRes = await fetchUserProfileDirect(tk.accessToken!);
		if (userRes.data) {
			const { id, firstName, lastName, roles, email } = userRes.data;
			const normalizedRoles = Array.isArray(roles) && roles.length > 0 ? roles : null;
			return {
				...tk,
				id,
				email: email || tk.email,
				firstName,
				lastName,
				roles: normalizedRoles,
			};
		}
	} catch (err) {
		if (axios.isAxiosError(err)) {
			logger.error("[FETCH USER PROFILE FAILED]", {
				status: err.response?.status,
				data: err.response?.data,
				message: err.message,
				url: err.config?.url,
			});
		} else {
			logger.error("[FETCH USER PROFILE FAILED - UNKNOWN ERROR]", { error: err });
		}
	}
	return tk;
}

async function handleMissingRoles(tk: ExtendedToken): Promise<ExtendedToken> {
	try {
		const userRes = await fetchUserProfileDirect(tk.accessToken!);
		if (userRes.data) {
			const { id, firstName, lastName, roles, email } = userRes.data;
			const normalizedRoles = Array.isArray(roles) && roles.length > 0 ? roles : null;
			if (normalizedRoles) {
				return {
					...tk,
					id,
					email: email || tk.email,
					firstName,
					lastName,
					roles: normalizedRoles,
				};
			}
		}
	} catch {
		// Silently fail - user might not have selected a role yet
	}
	return tk;
}

function handleTokenRefresh(tk: ExtendedToken): ExtendedToken | Promise<ExtendedToken> {
	// If refreshToken missing → no refresh ever
	if (!tk.refreshToken) return tk;

	// If refresh previously failed → accept expired token
	if (tk.error === "RefreshFailed") return tk;

	// If still valid → keep it
	if (isTokenValid(tk)) return tk;

	// Otherwise, refresh
	return refreshToken(tk);
}

/* ---------------------------- REFRESH TOKEN ---------------------------- */

async function refreshToken(oldToken: ExtendedToken): Promise<ExtendedToken> {
	try {
		const now = Date.now();

		const response = await apiClient.post<LoginResponse>("/auth/refresh", {
			refreshToken: oldToken.refreshToken,
		});

		const { accessToken, refreshToken, expiresIn } = response.data;

		return {
			...oldToken,
			accessToken,
			refreshToken,
			expiresAt: now + expiresIn * 1000,
		};
	} catch (err: unknown) {
		if (axios.isAxiosError(err)) {
			logger.error("[REFRESH FAILED] Axios error", {
				message: err.message,
				status: err.response?.status,
				data: err.response?.data,
			});
		} else if (err instanceof Error) {
			logger.error("[REFRESH FAILED] Error", {
				name: err.name,
				message: err.message,
				stack: err.stack,
			});
		} else {
			logger.error("[REFRESH FAILED] Unknown error", {
				value: err,
			});
		}

		return {
			...oldToken,
			error: "RefreshFailed",
			expiresAt: 0,
		};
	}
}

/* -------------------------- BUILD SESSION OBJECT -------------------------- */

function buildSession(session: Session, token: ExtendedToken): ExtendedSession {
	const roles = Array.isArray(token.roles) ? token.roles : [];

	return {
		...session,
		user: {
			id: token.id as string,
			email: token.email as string,
			firstName: token.firstName as string,
			lastName: token.lastName as string,
			roles,
			emailVerified: null,
		},
		accessToken: token.accessToken,
		refreshToken: token.refreshToken,
		expiresAt: token.expiresAt,
		expires: new Date(token.expiresAt ?? 0).toISOString(),
	};
}

/* --------------------------------- EXPORT -------------------------------- */

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: process.env.NEXTAUTH_SECRET,
	trustHost: true,

	providers: [
		CredentialsProvider({
			name: ".netCredentials",
			credentials: {
				email: { label: "email", type: "email" },
				password: { label: "password", type: "password" },
			},
			authorize: authorizeUser,
		}),
	],

	callbacks: {
		async jwt({ token, user, trigger }) {
			const tk = token as ExtendedToken;

			// Initial sign in
			if (user) return buildInitialToken(tk, user as User);

			// Handle update trigger
			if (trigger === "update" && tk.accessToken) {
				return await handleTokenUpdate(tk);
			}

			// Handle missing roles
			if (
				tk.accessToken &&
				(!tk.roles || (Array.isArray(tk.roles) && tk.roles.length === 0))
			) {
				return await handleMissingRoles(tk);
			}

			// Handle token refresh
			return handleTokenRefresh(tk);
		},

		session({ session, token }) {
			return buildSession(session, token as ExtendedToken);
		},
	},

	session: {
		strategy: "jwt",
	},

	pages: {
		signIn: "/auth/login",
		signOut: "/auth/login",
	},
});
