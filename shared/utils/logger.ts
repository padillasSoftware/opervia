type LogLevel = "info" | "warn" | "error" | "debug";

type LoggerMeta = Record<string, unknown>;

export const formatLog = (level: LogLevel, message: string, meta?: LoggerMeta) => {
  return {
    timestamp: new Date().toISOString(),
    level,
    message,
    stage: process.env.STAGE ?? "local",
    meta: meta || {},
  };
};

const serialize = (payload: Record<string, unknown>) => JSON.stringify(payload);

export const logger = {
  info(message: string, meta?: LoggerMeta) {
    console.info(serialize(formatLog("info", message, meta)));
  },
  warn(message: string, meta?: LoggerMeta) {
    console.warn(serialize(formatLog("warn", message, meta)));
  },
  error(message: string, meta?: LoggerMeta) {
    console.error(serialize(formatLog("error", message, meta)));
  },
  debug(message: string, meta?: LoggerMeta) {
    if (process.env.NODE_ENV !== "production") {
      console.debug(serialize(formatLog("debug", message, meta)));
    }
  },
};
