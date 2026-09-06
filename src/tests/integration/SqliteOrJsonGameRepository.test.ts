import fs from "fs";
import path from "path";
import { SqliteOrJsonGameRepository } from "../../infrastructure/repositories/SqliteOrJsonGameRepository";
import { Game } from "../../domain/entities/Game";

describe("SqliteOrJsonGameRepository", () => {
  const testDbPath = path.join(__dirname, "test-games.json");
  let repo: SqliteOrJsonGameRepository;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
    repo = new SqliteOrJsonGameRepository(testDbPath);
  });

  afterEach(() => {
    if (fs.existsSync(testDbPath)) {
      fs.unlinkSync(testDbPath);
    }
  });

  it("initializes with seed data if storage is empty", async () => {
    const { games, total } = await repo.getAll();
    expect(total).toBeGreaterThanOrEqual(15);
    expect(games.length).toBeGreaterThanOrEqual(15);
  });

  it("filters games by platform correctly", async () => {
    const { games } = await repo.getAll({ platform: "PS5" });
    expect(games.length).toBeGreaterThan(0);
    games.forEach((g) => {
      const hasPlat =
        g.platforms.some((p) => p.platform === "PS5") || g.primaryPlatform === "PS5";
      expect(hasPlat).toBe(true);
    });
  });

  it("searches games by title case-insensitively", async () => {
    const { games } = await repo.getAll({ search: "astro" });
    expect(games.length).toBeGreaterThanOrEqual(1);
    expect(games[0].title.toLowerCase()).toContain("astro");
  });

  it("sorts games by metascore descending", async () => {
    const { games } = await repo.getAll({ sortBy: "metascore", sortOrder: "desc" });
    expect(games.length).toBeGreaterThan(1);
    for (let i = 0; i < games.length - 1; i++) {
      const scoreA = games[i].metascore ?? 0;
      const scoreB = games[i + 1].metascore ?? 0;
      expect(scoreA).toBeGreaterThanOrEqual(scoreB);
    }
  });

  it("upserts and retrieves game by slug", async () => {
    const customGame: Game = {
      id: "custom-1",
      title: "Custom Test Game",
      slug: "custom-test-game",
      url: "https://www.metacritic.com/game/custom-test-game/",
      coverImage: "https://example.com/cover.jpg",
      platforms: [{ platform: "PC", metascore: 90, userscore: 9.0 }],
      primaryPlatform: "PC",
      metascore: 90,
      userscore: 9.0,
      developer: "Test Dev",
      releaseDate: "2024-09-01",
      description: "A test description",
      videoUrl: "https://youtube.com/watch?v=123",
      genres: ["Indie"],
      criticReviewSummary: null,
      userReviewSummary: null,
      letsPlayAnalysis: null,
      similarGameIds: [],
      crawledAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      crawlSource: "manual",
    };

    await repo.upsert(customGame);
    const retrieved = await repo.getBySlug("custom-test-game");
    expect(retrieved).toBeDefined();
    expect(retrieved?.title).toBe("Custom Test Game");
  });
});
