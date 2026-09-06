import { Game } from "../../domain/entities/Game";
import { ICrawlStateRepository } from "../../domain/repositories/ICrawlStateRepository";
import { IGameRepository } from "../../domain/repositories/IGameRepository";
import { AISummarizerService } from "../../infrastructure/ai/AISummarizerService";
import { DiscoveredGameSummary, MetacriticCrawler } from "../../infrastructure/crawler/MetacriticCrawler";
import { GameSimilarityEngine } from "../../infrastructure/similarity/GameSimilarityEngine";
import { YouTubeService } from "../../infrastructure/youtube/YouTubeService";

export interface CrawlExecutionResult {
  success: boolean;
  batchCount: number;
  newGamesAdded: number;
  updatedGamesCount: number;
  durationMs: number;
  source: "new-releases" | "browse-all-new";
  message: string;
}

export class CrawlMetacriticUseCase {
  constructor(
    private gameRepo: IGameRepository,
    private stateRepo: ICrawlStateRepository,
    private crawler: MetacriticCrawler,
    private aiSummarizer: AISummarizerService,
    private youtubeService: YouTubeService
  ) {}

  public async execute(forceSource?: "new-releases" | "browse-all-new"): Promise<CrawlExecutionResult> {
    const startTime = Date.now();
    const todayStr = new Date().toISOString().split("T")[0];

    await this.stateRepo.updateStatus({
      state: "fetching_metacritic",
      currentStepMessage: "Querying Metacritic for 20 unprocessed games...",
      lastError: null,
    });

    await this.stateRepo.addLog({
      level: "info",
      message: `Starting crawl cycle for date ${todayStr}. Checking unprocessed records.`,
    });

    try {
      const processedTodaySlugs = await this.gameRepo.getProcessedTodaySlugs(todayStr);
      const state = await this.stateRepo.getStatus();

      // Determine source:
      // If today is a new day or no games processed today -> Item 1 (/game/ New Releases)
      // Otherwise -> Item 2 (/browse/game/all/all/all-time/new/?page=N)
      let source: "new-releases" | "browse-all-new" = forceSource || "new-releases";
      let targetPage = 1;

      if (!forceSource) {
        if (processedTodaySlugs.size === 0) {
          source = "new-releases";
          targetPage = 1;
        } else {
          source = "browse-all-new";
          targetPage = (state.currentPage || 1) + 1;
        }
      }

      await this.stateRepo.addLog({
        level: "info",
        message: `Crawl source selected: ${source} (Page ${targetPage}). Target: 20 games not yet processed today.`,
      });

      // 1. Fetch games from Metacritic
      let discovered: DiscoveredGameSummary[] = [];
      if (source === "new-releases") {
        discovered = await this.crawler.fetchNewReleases(30);
      } else {
        discovered = await this.crawler.fetchBrowseAllNew(targetPage, 30);
      }

      // Filter out games that were already processed today
      let candidates = discovered.filter((g) => !processedTodaySlugs.has(g.slug));

      // If all were processed today (or small batch), take up to 20 to refresh or crawl next page
      if (candidates.length < 20 && source === "browse-all-new") {
        const nextBatch = await this.crawler.fetchBrowseAllNew(targetPage + 1, 30);
        candidates = [...candidates, ...nextBatch.filter((g) => !processedTodaySlugs.has(g.slug))];
        targetPage += 1;
      }

      const batchToProcess = (candidates.length > 0 ? candidates : discovered).slice(0, 20);

      await this.stateRepo.updateStatus({
        state: "analyzing_reviews",
        currentStepMessage: `Processing ${batchToProcess.length} games: scraping details & generating AI review summaries...`,
      });

      const processedGames: Game[] = [];
      let newCount = 0;
      let updateCount = 0;

      for (let i = 0; i < batchToProcess.length; i++) {
        const summary = batchToProcess[i];
        const existing = await this.gameRepo.getBySlug(summary.slug);

        await this.stateRepo.addLog({
          level: "info",
          message: `[${i + 1}/${batchToProcess.length}] Extracting details & reviews for "${summary.title}"`,
          gameTitle: summary.title,
        });

        const fullDetails = await this.crawler.fetchGameFullDetails(summary);

        // 2. Generate Separate AI Summaries for Critics and Users
        const criticSummary = await this.aiSummarizer.summarizeReviews(
          summary.title,
          fullDetails.criticReviews,
          "critic"
        );

        const userSummary = await this.aiSummarizer.summarizeReviews(
          summary.title,
          fullDetails.userReviews,
          "user"
        );

        // 3. YouTube Let's Play Analysis (Extra Task 1)
        let letsPlay = existing?.letsPlayAnalysis || null;
        if (!letsPlay || Math.random() > 0.4) {
          await this.stateRepo.addLog({
            level: "info",
            message: `Analyzing popular YouTube Let's Play & blogger commentary for "${summary.title}"`,
            gameTitle: summary.title,
          });
          letsPlay = await this.youtubeService.searchAndAnalyzeLetsPlay(summary.title);
        }

        const id = existing ? existing.id : `game-${Date.now()}-${i + 1}`;
        const gameEntity: Game = {
          id,
          title: summary.title,
          slug: summary.slug,
          url: summary.url,
          coverImage: summary.coverImage,
          platforms: fullDetails.platforms,
          primaryPlatform: fullDetails.platforms[0]?.platform || "PC",
          metascore: fullDetails.platforms[0]?.metascore ?? summary.metascore,
          userscore: fullDetails.platforms[0]?.userscore ?? summary.userscore,
          developer: fullDetails.developer,
          publisher: fullDetails.developer,
          releaseDate: existing?.releaseDate || new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
          description: fullDetails.description,
          videoUrl: fullDetails.videoUrl,
          genres: fullDetails.genres,
          criticReviewSummary: criticSummary,
          userReviewSummary: userSummary,
          letsPlayAnalysis: letsPlay,
          similarGameIds: existing?.similarGameIds || [],
          crawledAt: existing?.crawledAt || new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          crawlSource: source,
        };

        processedGames.push(gameEntity);
        if (existing) updateCount++;
        else newCount++;
      }

      // 4. Save to Repository and update Similar Games
      await this.stateRepo.updateStatus({
        state: "updating_db",
        currentStepMessage: "Synchronizing game records and updating similarity graph...",
      });

      await this.gameRepo.upsertMany(processedGames);

      const durationMs = Date.now() - startTime;
      const totalInDb = await this.gameRepo.count();
      const updatedProcessedToday = (await this.gameRepo.getProcessedTodaySlugs(todayStr)).size;

      await this.stateRepo.updateStatus({
        state: "idle",
        currentStepMessage: `Finished processing 20 games successfully. Duration: ${(durationMs / 1000).toFixed(1)}s.`,
        gamesProcessedToday: updatedProcessedToday,
        totalGamesCount: totalInDb,
        currentPage: targetPage,
        lastRunAt: new Date().toISOString(),
        nextRunAt: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        lastRunDurationMs: durationMs,
        lastError: null,
      });

      await this.stateRepo.addLog({
        level: "success",
        message: `Pipeline completed: ${newCount} added, ${updateCount} updated (${batchToProcess.length} total). Total in DB: ${totalInDb}.`,
      });

      return {
        success: true,
        batchCount: batchToProcess.length,
        newGamesAdded: newCount,
        updatedGamesCount: updateCount,
        durationMs,
        source,
        message: `Successfully processed ${batchToProcess.length} games from Metacritic (${source}).`,
      };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const durationMs = Date.now() - startTime;

      await this.stateRepo.updateStatus({
        state: "error",
        currentStepMessage: `Crawl failed: ${errorMsg}`,
        lastError: errorMsg,
      });

      await this.stateRepo.addLog({
        level: "error",
        message: `Crawl pipeline failed: ${errorMsg}`,
      });

      return {
        success: false,
        batchCount: 0,
        newGamesAdded: 0,
        updatedGamesCount: 0,
        durationMs,
        source: "new-releases",
        message: `Crawl failed: ${errorMsg}`,
      };
    }
  }
}
