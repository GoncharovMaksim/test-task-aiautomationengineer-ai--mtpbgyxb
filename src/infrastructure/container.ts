import { CrawlMetacriticUseCase } from "../application/use-cases/CrawlMetacriticUseCase";
import { FindSimilarGamesUseCase } from "../application/use-cases/FindSimilarGamesUseCase";
import { GetGamesUseCase } from "../application/use-cases/GetGamesUseCase";
import { AISummarizerService } from "./ai/AISummarizerService";
import { MetacriticCrawler } from "./crawler/MetacriticCrawler";
import { CrawlStateRepository, globalCrawlState } from "./repositories/CrawlStateRepository";
import { SqliteOrJsonGameRepository } from "./repositories/SqliteOrJsonGameRepository";
import { YouTubeService } from "./youtube/YouTubeService";

// Shared singleton instances for backend runtime
const gameRepository = new SqliteOrJsonGameRepository();
const stateRepository = globalCrawlState;
const metacriticCrawler = new MetacriticCrawler();
const aiSummarizer = new AISummarizerService();
const youtubeService = new YouTubeService();

const crawlMetacriticUseCase = new CrawlMetacriticUseCase(
  gameRepository,
  stateRepository,
  metacriticCrawler,
  aiSummarizer,
  youtubeService
);

const getGamesUseCase = new GetGamesUseCase(gameRepository);
const findSimilarGamesUseCase = new FindSimilarGamesUseCase(gameRepository);

export const container = {
  gameRepository,
  stateRepository,
  metacriticCrawler,
  aiSummarizer,
  youtubeService,
  crawlMetacriticUseCase,
  getGamesUseCase,
  findSimilarGamesUseCase,
};
