import type { DefaultSession } from "next-auth";

declare module "next-auth" {
	interface Session {
		accessToken?: string;
		refreshToken?: string;
		expiresIn?: number;
		user: {
			email: string;
		} & DefaultSession["user"];
	}

	interface User {
		id: string;
		email: string;
		tokenType?: string;
		accessToken?: string;
		refreshToken?: string;
		expiresIn?: number;
	}
}

declare module "next-auth/jwt" {
	interface JWT {
		accessToken?: string;
		refreshToken?: string;
		expiresIn?: number;
		tokenType?: string;
	}
}
