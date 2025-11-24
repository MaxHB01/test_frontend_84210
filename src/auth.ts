import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { apiClient } from "./lib";


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
			async authorize(credentials) {
				try {
					if (!credentials?.email || !credentials?.password) {
						throw new Error("Email and password are required");
					}

					const { status, data } = await apiClient.post("/login", {
						email: credentials.email,
						password: credentials.password,
					});

					if (status !== 200) {
						throw new Error(`Authentication failed: ${status}`);
					}

					if (!data || !data.accessToken) {
						throw new Error("Invalid token response");
					}

					if (data.accessToken) {
						return {
							id: credentials.email as string,
							email: credentials.email as string,
							tokenType: data.tokenType,
							accessToken: data.accessToken,
							refreshToken: data.refreshToken,
							expiresIn: data.expiresIn,
						};
					}

					return null;
				} catch {
					// Return null to indicate authentication failure
					// NextAuth will handle the error appropriately
					return null;
				}
			},
		}),
	],
	callbacks: {
		jwt({ token, user }) {
			if (user) {
				// On sign in, save the access token, refresh token, and expiry time
				token.accessToken = user.accessToken;
				token.refreshToken = user.refreshToken;
				token.expiresIn = user.expiresIn;
				token.tokenType = user.tokenType;
			}
			return token;
		},
		// Session callback: Runs whenever a session is checked
		session({ session, token }) {
			if (session.user) {
				session.user.email = token.email as string;
			}
			session.accessToken = token.accessToken as string | undefined;
			session.refreshToken = token.refreshToken as string | undefined;
			session.expiresIn = token.expiresIn as number | undefined;
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
