import { container } from "../container";

export class CrawlScheduler {
  private static timer: NodeJS.Timeout | null = null;
  private static isRunning = false;

  public static startHourlySchedule(): void {
    if (this.isRunning) return;
    this.isRunning = true;

    console.log("[CrawlScheduler] Starting hourly background crawler scheduler...");

    // Run hourly (3600000 ms)
    const ONE_HOUR = 60 * 60 * 1000;
    this.timer = setInterval(async () => {
      console.log("[CrawlScheduler] Hourly trigger executing...");
      try {
        await container.crawlMetacriticUseCase.execute();
      } catch (err) {
        console.error("[CrawlScheduler] Hourly crawl execution error:", err);
      }
    }, ONE_HOUR);
  }

  public static stop(): void {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
      this.isRunning = false;
      console.log("[CrawlScheduler] Scheduler stopped.");
    }
  }
}
