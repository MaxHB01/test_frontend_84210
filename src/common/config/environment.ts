export const Environment = {
	API_URL: process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL,
	CHAT_HUB_URL:
		process.env.NEXT_PUBLIC_CHAT_HUB_URL ??
		process.env.CHAT_HUB_URL ??
		(process.env.NEXT_PUBLIC_API_URL || process.env.API_URL
			? `${process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL}/chatHub`
			: undefined),
	TIMEOUT: Number(process.env.TIMEOUT) || 5000,
};
