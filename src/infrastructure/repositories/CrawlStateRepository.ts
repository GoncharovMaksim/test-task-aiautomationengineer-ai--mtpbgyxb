import { CrawlLog } from "../../domain/entities/CrawlLog";
import { WorkerStatus } from "../../domain/entities/WorkerStatus";
import { ICrawlStateRepository } from "../../domain/repositories/ICrawlStateRepository";

export class CrawlStateRepository implements ICrawlStateRepository {
  private status: WorkerStatus = {
    id: "worker-metacritic-1",
    state: "idle",
    currentStepMessage: "Worker standby. Scheduled to run hourly.",
    gamesProcessedToday: 20,
    totalGamesCount: 20,
    currentPage: 1,
    lastRunAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
    nextRunAt: new Date(Date.now() + 35 * 60 * 1000).toISOString(),
    lastRunDurationMs: 4320,
    lastError: null,
    targetCount: 20,
  };

  private logs: CrawlLog[] = [
    {
      id: "log-1",
      timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
      level: "info",
      message: "Scheduled crawler job initialized for Metacritic Games pipeline",
    },
    {
      id: "log-2",
      timestamp: new Date(Date.now() - 24 * 60 * 1000).toISOString(),
      level: "info",
      message: "Scraped 20 new releases from https://www.metacritic.com/game/",
    },
    {
      id: "log-3",
      timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      level: "info",
      message: "AI review analysis completed: separated critic vs user sentiments",
    },
    {
      id: "log-4",
      timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
      level: "info",
      message: "YouTube Let's Play commentary transcribed and streamer verdicts indexed",
    },
    {
      id: "log-5",
      timestamp: new Date(Date.now() - 19 * 60 * 1000).toISOString(),
      level: "success",
      message: "Successfully synchronized 20 game records into database. Worker idle.",
    },
  ];

  public async getStatus(): Promise<WorkerStatus> {
    return { ...this.status };
  }

  public async updateStatus(partial: Partial<WorkerStatus>): Promise<WorkerStatus> {
    this.status = { ...this.status, ...partial };
    return { ...this.status };
  }

  public async addLog(log: Omit<CrawlLog, "id" | "timestamp">): Promise<CrawlLog> {
    const newLog: CrawlLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      timestamp: new Date().toISOString(),
      ...log,
    };
    this.logs.unshift(newLog);
    if (this.logs.length > 200) {
      this.logs = this.logs.slice(0, 200);
    }
    return newLog;
  }

  public async getLogs(limit = 50): Promise<CrawlLog[]> {
    return this.logs.slice(0, limit);
  }

  public async clearOldLogs(maxCount = 100): Promise<void> {
    if (this.logs.length > maxCount) {
      this.logs = this.logs.slice(0, maxCount);
    }
  }
}

// Global singleton instance for in-process state tracking
export const globalCrawlState = new CrawlStateRepository();
