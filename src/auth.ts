import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

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
					//It sends the credentials to the backend and returns the response
					const apiUrl = process.env.NEXT_PUBLIC_API_URL;

					if (!apiUrl) {
						throw new Error("API URL is not configured");
					}

					if (!credentials?.email || !credentials?.password) {
						throw new Error("Email and password are required");
					}

					const res = await fetch(`${apiUrl}/login`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							email: credentials.email,
							password: credentials.password,
						}),
					});

					if (!res.ok) {
						throw new Error(`Authentication failed: ${res.status}`);
					}

					//It parses the response as JSON
					const user = await res.json();

					if (user.accessToken) {
						return {
							id: credentials.email as string,
							email: credentials.email as string,
							tokenType: user.tokenType,
							accessToken: user.accessToken,
							refreshToken: user.refreshToken,
							expiresIn: user.expiresIn,
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
