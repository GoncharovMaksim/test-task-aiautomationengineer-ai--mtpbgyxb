import fs from "fs";
import path from "path";
import { CrawlMetacriticUseCase } from "../../application/use-cases/CrawlMetacriticUseCase";
import { SqliteOrJsonGameRepository } from "../../infrastructure/repositories/SqliteOrJsonGameRepository";
import { CrawlStateRepository } from "../../infrastructure/repositories/CrawlStateRepository";
import { MetacriticCrawler } from "../../infrastructure/crawler/MetacriticCrawler";
import { AISummarizerService } from "../../infrastructure/ai/AISummarizerService";
import { YouTubeService } from "../../infrastructure/youtube/YouTubeService";

describe("CrawlMetacriticUseCase", () => {
  const testDb = path.join(__dirname, "test-crawl-games.json");
  let gameRepo: SqliteOrJsonGameRepository;
  let stateRepo: CrawlStateRepository;
  let crawler: MetacriticCrawler;
  let ai: AISummarizerService;
  let yt: YouTubeService;
  let useCase: CrawlMetacriticUseCase;

  beforeEach(() => {
    if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
    gameRepo = new SqliteOrJsonGameRepository(testDb);
    stateRepo = new CrawlStateRepository();
    crawler = new MetacriticCrawler();
    ai = new AISummarizerService();
    yt = new YouTubeService();

    // Mock network fetch to avoid external rate limits and timeouts
    jest.spyOn(global, "fetch").mockImplementation(async (url: any) => {
      if (typeof url === "string" && url.includes("hackernoon")) {
        return { ok: true, text: async () => "Game commentary transcript text" } as any;
      }
      return { ok: false, status: 502 } as any;
    });

    useCase = new CrawlMetacriticUseCase(gameRepo, stateRepo, crawler, ai, yt);
  });

  afterEach(() => {
    if (fs.existsSync(testDb)) fs.unlinkSync(testDb);
    jest.restoreAllMocks();
  });

  it("executes full crawl cycle and updates worker status", async () => {
    const result = await useCase.execute("new-releases");

    expect(result.success).toBe(true);
    expect(result.batchCount).toBe(20);
    expect(result.durationMs).toBeGreaterThan(0);

    const status = await stateRepo.getStatus();
    expect(status.state).toBe("idle");
    expect(status.lastRunAt).toBeDefined();
    expect(status.gamesProcessedToday).toBeGreaterThanOrEqual(20);

    const logs = await stateRepo.getLogs();
    expect(logs.length).toBeGreaterThan(0);
    expect(logs.some((l) => l.level === "success")).toBe(true);
  });

  it("uses browse-all-new source on subsequent runs", async () => {
    const result = await useCase.execute("browse-all-new");
    expect(result.success).toBe(true);
    expect(result.source).toBe("browse-all-new");
  });
});
