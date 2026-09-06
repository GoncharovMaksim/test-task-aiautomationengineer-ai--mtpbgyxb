import { WorkerStatus } from "../entities/WorkerStatus";
import { CrawlLog } from "../entities/CrawlLog";

export interface ICrawlStateRepository {
  getStatus(): Promise<WorkerStatus>;
  updateStatus(partial: Partial<WorkerStatus>): Promise<WorkerStatus>;
  addLog(log: Omit<CrawlLog, "id" | "timestamp">): Promise<CrawlLog>;
  getLogs(limit?: number): Promise<CrawlLog[]>;
  clearOldLogs(maxCount?: number): Promise<void>;
}
