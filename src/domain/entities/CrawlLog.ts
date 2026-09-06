export type LogLevel = "info" | "warn" | "error" | "success";

export interface CrawlLog {
  id: string;
  timestamp: string;
  level: LogLevel;
  message: string;
  gameTitle?: string;
  context?: Record<string, unknown>;
}
