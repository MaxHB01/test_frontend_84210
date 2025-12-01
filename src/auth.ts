import axios from "axios";
import NextAuth, { type User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { apiClient, logger } from "./lib";

export const { handlers, signIn, signOut, auth } = NextAuth({
	secret: process.env.NEXTAUTH_SECRET,
	trustHost: true,

	providers: [
		CredentialsProvider({
			name: ".netCredentials",
			credentials: {
				email: { label: "email", type: "email", placeholder: "email" },
				password: { label: "password", type: "password", placeholder: "password" },
			},
			async authorize(
				credentials: Partial<Record<"email" | "password", unknown>>
			): Promise<User | null> {
				try {
					if (!credentials?.email || !credentials?.password) {
						throw new Error("Email and password are required");
					}

					const loginResponse = await apiClient.post("/auth/login", {
						email: credentials.email,
						password: credentials.password,
					});

					const { accessToken, refreshToken } = loginResponse.data;

					const userResponse = await apiClient.get("/user/me", {
						headers: {
							Authorization: `Bearer ${accessToken}`,
						},
					});

					const { id, email, firstName, lastName, roles, expiresIn } = userResponse.data;

					return {
						id,
						email,
						firstName,
						lastName,
						roles,
						emailVerified: null,

						// tokens hier meesturen
						accessToken,
						refreshToken,
						expiresIn,
					} as User;
				} catch (err: unknown) {
					if (axios.isAxiosError(err)) {
						logger.error("[LOGIN FAILED] Axios error");

						const status = err.response?.status;
						const data = err.response?.data;

						if (status !== undefined) {
							logger.error(`[BACKEND STATUS] ${status}`);
						}

						if (data !== undefined) {
							logger.error("[BACKEND DATA]", data);
						}
					} else {
						// Fallback voor onbekende errors
						logger.error("[LOGIN FAILED] Unknown error", {
							err,
						});
					}

					return null;
				}
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.firstName = user.firstName;
				token.lastName = user.lastName;
				token.roles = user.roles;

				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
				token.expiresAt = user.expiresIn;
			}

			return token;
		},
		// Session callback: Runs whenever a session is checked
		session({ session, token }) {
			session.user = {
				id: token.id as string,
				email: token.email as string,
				firstName: token.firstName as string,
				lastName: token.lastName as string,
				roles: token.roles as string[],
				emailVerified: null,
				accessToken: token.accessToken as string,
				refreshToken: token.refreshToken as string,
				expiresIn: token.expiresAt as number,
			};

			session.accessToken = token.accessToken as string;
			session.refreshToken = token.refreshToken as string;
			session.expiresAt = token.expiresAt as number;

			return session;
		},
	},
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/login",
		signOut: "/",
	},
});
