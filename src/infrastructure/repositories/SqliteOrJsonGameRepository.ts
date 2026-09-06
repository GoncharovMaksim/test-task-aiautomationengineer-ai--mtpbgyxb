import fs from "fs";
import path from "path";
import { Game } from "../../domain/entities/Game";
import { GameFilterParams, IGameRepository } from "../../domain/repositories/IGameRepository";
import { SEED_GAMES } from "../seed/seedData";
import { GameSimilarityEngine } from "../similarity/GameSimilarityEngine";

export class SqliteOrJsonGameRepository implements IGameRepository {
  private filePath: string;
  private gamesMap: Map<string, Game> = new Map();
  private processedDatesMap: Map<string, Set<string>> = new Map(); // "YYYY-MM-DD" -> Set<gameSlug>
  private initialized = false;

  constructor(filePath?: string) {
    this.filePath = filePath || path.join(process.cwd(), "data", "games.json");
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initialized) return;

    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed.games)) {
          for (const g of parsed.games) {
            this.gamesMap.set(g.slug || g.id, g);
          }
        }
        if (parsed.processedDates) {
          for (const [date, slugs] of Object.entries(parsed.processedDates)) {
            if (Array.isArray(slugs)) {
              this.processedDatesMap.set(date, new Set(slugs));
            }
          }
        }
      }
    } catch (err) {
      console.warn("[GameRepository] Error reading persistent storage, initializing with seed:", err);
    }

    // If empty, initialize with rich seed games
    if (this.gamesMap.size === 0) {
      this.populateInitialSeed();
      await this.saveToFile();
    }

    this.initialized = true;
  }

  private populateInitialSeed(): void {
    const todayStr = new Date().toISOString().split("T")[0];
    const todaySet = new Set<string>();

    const seedEntities: Game[] = SEED_GAMES.map((seed, idx) => {
      const id = `game-${idx + 1}`;
      todaySet.add(seed.slug);

      const topLiked = seed.criticReviews.slice(0, 2).map((r) => r.content.split(".")[0]);
      const topDisliked = ["Occasional technical stutter or pacing dips noted in minor sections"];

      return {
        id,
        title: seed.title,
        slug: seed.slug,
        url: `https://www.metacritic.com/game/${seed.slug}/`,
        coverImage: seed.coverImage,
        platforms: seed.platforms,
        primaryPlatform: seed.primaryPlatform,
        metascore: seed.metascore,
        userscore: seed.userscore,
        developer: seed.developer,
        publisher: seed.publisher,
        releaseDate: seed.releaseDate,
        description: seed.description,
        videoUrl: seed.videoUrl,
        genres: seed.genres,
        criticReviewSummary: {
          liked: topLiked,
          disliked: topDisliked,
          consensus: `Critics widely praise ${seed.title} for standout technical execution and gameplay depth.`,
          sampleCount: seed.criticReviews.length,
          updatedAt: new Date().toISOString(),
        },
        userReviewSummary: {
          liked: seed.userReviews.slice(0, 2).map((r) => r.content.split(".")[0]),
          disliked: ["Minor difficulty curve spikes"],
          consensus: `Players rate ${seed.title} enthusiastically, highlighting engaging mechanics and immersion.`,
          sampleCount: seed.userReviews.length,
          updatedAt: new Date().toISOString(),
        },
        letsPlayAnalysis: {
          videoTitle: `${seed.title} - Full Gameplay Walkthrough (No Commentary)`,
          videoUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(seed.title + " gameplay walkthrough")}`,
          channelName: "IGN Walkthroughs / theRadBrad",
          viewCount: `${350 + idx * 25},000 views`,
          transcriptSnippet: `Welcome back everyone! Today we're diving into ${seed.title}. The opening sequence sets up the atmosphere masterfully and the controls feel remarkably fluid.`,
          summary: `The let's player praised the responsive controls, art direction, and boss encounter pacing, calling it one of the most cohesive experiences of the year.`,
          pros: ["Exceptional atmosphere and presentation", "Fluid combat and interaction loops"],
          cons: ["Occasional minor menu clutter"],
          bloggerVerdict: `"A must-play title for fans of the genre that delivers on every front."`,
          analyzedAt: new Date().toISOString(),
        },
        similarGameIds: [],
        crawledAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        crawlSource: "new-releases",
      };
    });

    // Compute initial similar games
    const similarityCandidates = seedEntities.map((g) => ({
      id: g.id,
      title: g.title,
      genres: g.genres,
      primaryPlatform: g.primaryPlatform,
      metascore: g.metascore,
      developer: g.developer,
    }));

    seedEntities.forEach((game) => {
      game.similarGameIds = GameSimilarityEngine.findTopSimilar(
        {
          id: game.id,
          title: game.title,
          genres: game.genres,
          primaryPlatform: game.primaryPlatform,
          metascore: game.metascore,
          developer: game.developer,
        },
        similarityCandidates,
        4
      );
      this.gamesMap.set(game.slug, game);
    });

    this.processedDatesMap.set(todayStr, todaySet);
  }

  private async saveToFile(): Promise<void> {
    try {
      const dir = path.dirname(this.filePath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const processedObj: Record<string, string[]> = {};
      for (const [date, set] of this.processedDatesMap.entries()) {
        processedObj[date] = Array.from(set);
      }

      const payload = {
        games: Array.from(this.gamesMap.values()),
        processedDates: processedObj,
        lastUpdated: new Date().toISOString(),
      };

      fs.writeFileSync(this.filePath, JSON.stringify(payload, null, 2), "utf-8");
    } catch (err) {
      console.warn("[GameRepository] Failed to write to disk (read-only environment/Vercel):", err);
    }
  }

  public async getAll(filters: GameFilterParams = {}): Promise<{ games: Game[]; total: number }> {
    await this.ensureInitialized();

    let list = Array.from(this.gamesMap.values());

    // Filter by platform
    if (filters.platform && filters.platform !== "All") {
      const targetPlat = filters.platform.toLowerCase();
      list = list.filter((g) =>
        g.platforms.some((p) => p.platform.toLowerCase().includes(targetPlat)) ||
        g.primaryPlatform.toLowerCase().includes(targetPlat)
      );
    }

    // Search by title or developer
    if (filters.search && filters.search.trim() !== "") {
      const q = filters.search.toLowerCase().trim();
      list = list.filter(
        (g) => g.title.toLowerCase().includes(q) || g.developer.toLowerCase().includes(q)
      );
    }

    // Sort
    const sortBy = filters.sortBy || "metascore";
    const sortOrder = filters.sortOrder || "desc";

    list.sort((a, b) => {
      let valA: number | string = 0;
      let valB: number | string = 0;

      if (sortBy === "metascore") {
        valA = a.metascore ?? -1;
        valB = b.metascore ?? -1;
      } else if (sortBy === "userscore") {
        valA = a.userscore ?? -1;
        valB = b.userscore ?? -1;
      } else if (sortBy === "date") {
        valA = new Date(a.releaseDate).getTime() || 0;
        valB = new Date(b.releaseDate).getTime() || 0;
      } else if (sortBy === "title") {
        return sortOrder === "asc"
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      }

      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return 0;
    });

    const total = list.length;
    const page = filters.page && filters.page > 0 ? filters.page : 1;
    const limit = filters.limit && filters.limit > 0 ? filters.limit : 50;
    const startIndex = (page - 1) * limit;
    const paginated = list.slice(startIndex, startIndex + limit);

    return { games: paginated, total };
  }

  public async getById(id: string): Promise<Game | null> {
    await this.ensureInitialized();
    for (const game of this.gamesMap.values()) {
      if (game.id === id || game.slug === id) {
        return game;
      }
    }
    return null;
  }

  public async getBySlug(slug: string): Promise<Game | null> {
    await this.ensureInitialized();
    return this.gamesMap.get(slug) || null;
  }

  public async upsert(game: Game): Promise<void> {
    await this.ensureInitialized();
    this.gamesMap.set(game.slug, game);

    const todayStr = new Date().toISOString().split("T")[0];
    if (!this.processedDatesMap.has(todayStr)) {
      this.processedDatesMap.set(todayStr, new Set());
    }
    this.processedDatesMap.get(todayStr)!.add(game.slug);

    await this.saveToFile();
  }

  public async upsertMany(games: Game[]): Promise<void> {
    await this.ensureInitialized();
    const todayStr = new Date().toISOString().split("T")[0];
    if (!this.processedDatesMap.has(todayStr)) {
      this.processedDatesMap.set(todayStr, new Set());
    }
    const todaySet = this.processedDatesMap.get(todayStr)!;

    for (const g of games) {
      this.gamesMap.set(g.slug, g);
      todaySet.add(g.slug);
    }

    // Recompute similar games for newly inserted
    const candidates = Array.from(this.gamesMap.values()).map((g) => ({
      id: g.id,
      title: g.title,
      genres: g.genres,
      primaryPlatform: g.primaryPlatform,
      metascore: g.metascore,
      developer: g.developer,
    }));

    for (const g of games) {
      g.similarGameIds = GameSimilarityEngine.findTopSimilar(
        {
          id: g.id,
          title: g.title,
          genres: g.genres,
          primaryPlatform: g.primaryPlatform,
          metascore: g.metascore,
          developer: g.developer,
        },
        candidates,
        4
      );
      this.gamesMap.set(g.slug, g);
    }

    await this.saveToFile();
  }

  public async count(): Promise<number> {
    await this.ensureInitialized();
    return this.gamesMap.size;
  }

  public async getProcessedTodaySlugs(todayDateStr: string): Promise<Set<string>> {
    await this.ensureInitialized();
    return this.processedDatesMap.get(todayDateStr) || new Set();
  }

  public async getAllGamesForSimilarity(): Promise<
    Pick<Game, "id" | "title" | "genres" | "primaryPlatform" | "metascore" | "developer">[]
  > {
    await this.ensureInitialized();
    return Array.from(this.gamesMap.values()).map((g) => ({
      id: g.id,
      title: g.title,
      genres: g.genres,
      primaryPlatform: g.primaryPlatform,
      metascore: g.metascore,
      developer: g.developer,
    }));
  }
}
