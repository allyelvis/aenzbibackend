import { env } from "./env"

// Log levels
type LogLevel = "debug" | "info" | "warn" | "error"

// Log level priorities (higher number = higher priority)
const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
}

// Get current log level from environment
const currentLogLevel = env.LOG_LEVEL || "info"

// Check if a log level should be displayed based on current setting
function shouldLog(level: LogLevel): boolean {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[currentLogLevel as LogLevel]
}

// Format the current timestamp
function getTimestamp(): string {
  return new Date().toISOString()
}

// Format a log message
function formatMessage(level: LogLevel, message: string, meta?: any): string {
  const timestamp = getTimestamp()
  const metaStr = meta ? ` ${JSON.stringify(meta)}` : ""
  return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`
}

// Logger implementation
const logger = {
  debug(message: string, meta?: any): void {
    if (shouldLog("debug")) {
      console.debug(formatMessage("debug", message, meta))
    }
  },

  info(message: string, meta?: any): void {
    if (shouldLog("info")) {
      console.info(formatMessage("info", message, meta))
    }
  },

  warn(message: string, meta?: any): void {
    if (shouldLog("warn")) {
      console.warn(formatMessage("warn", message, meta))
    }
  },

  error(message: string, error?: any): void {
    if (shouldLog("error")) {
      console.error(formatMessage("error", message, error))
      if (error instanceof Error) {
        console.error(error.stack)
      }
    }
  },
}

export default logger

