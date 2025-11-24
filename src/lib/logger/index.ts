/* eslint-disable no-console */

type LogLevel = "debug" | "info" | "warn" | "error";

interface LogEntry {
	level: LogLevel;
	message: string;
	context?: Record<string, unknown>;
	timestamp: string;
}

function createLogEntry(
	level: LogLevel,
	message: string,
	context?: Record<string, unknown>
): LogEntry {
	return {
		level,
		message,
		context,
		timestamp: new Date().toISOString(),
	};
}

function printToConsole(entry: LogEntry) {
	const prefix = `[${entry.level.toUpperCase()}][${entry.timestamp}]`;
	const payload = entry.context
		? [prefix, entry.message, entry.context]
		: [prefix, entry.message];

	switch (entry.level) {
		case "debug":
			console.debug(...payload);
			break;
		case "info":
			console.info(...payload);
			break;
		case "warn":
			console.warn(...payload);
			break;
		case "error":
			console.error(...payload);
			break;
	}
}

export const logger = {
	debug: (message: string, context?: Record<string, unknown>): void =>
		printToConsole(createLogEntry("debug", message, context)),
	info: (message: string, context?: Record<string, unknown>): void =>
		printToConsole(createLogEntry("info", message, context)),
	warn: (message: string, context?: Record<string, unknown>): void =>
		printToConsole(createLogEntry("warn", message, context)),
	error: (message: string, context?: Record<string, unknown>): void =>
		printToConsole(createLogEntry("error", message, context)),
};
