export type WorkerState =
  | "idle"
  | "fetching_metacritic"
  | "analyzing_reviews"
  | "fetching_youtube"
  | "updating_db"
  | "completed"
  | "error";

export interface WorkerStatus {
  id: string;
  state: WorkerState;
  currentStepMessage: string;
  gamesProcessedToday: number;
  totalGamesCount: number;
  currentPage: number;
  lastRunAt: string | null;
  nextRunAt: string | null;
  lastRunDurationMs: number;
  lastError: string | null;
  targetCount: number;
}

export interface CrawlJobMetrics {
  totalProcessed: number;
  totalErrors: number;
  lastBatchCount: number;
}
