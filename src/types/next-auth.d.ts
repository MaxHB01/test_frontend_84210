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
		id?: string;
		email?: string;
		firstName?: string;
		lastName?: string;
		roles?: string[];
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
