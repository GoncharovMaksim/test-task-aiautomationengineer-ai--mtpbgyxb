import { GameSimilarityEngine, SimilarityCandidate } from "../../infrastructure/similarity/GameSimilarityEngine";

describe("GameSimilarityEngine", () => {
  const gameA: SimilarityCandidate = {
    id: "game-1",
    title: "Elden Ring",
    genres: ["Action RPG", "Soulslike", "Open World"],
    primaryPlatform: "PC",
    metascore: 96,
    developer: "FromSoftware",
  };

  const gameB: SimilarityCandidate = {
    id: "game-2",
    title: "Dark Souls III",
    genres: ["Action RPG", "Soulslike"],
    primaryPlatform: "PC",
    metascore: 89,
    developer: "FromSoftware",
  };

  const gameC: SimilarityCandidate = {
    id: "game-3",
    title: "Mario Kart 8",
    genres: ["Racing", "Party"],
    primaryPlatform: "Nintendo Switch",
    metascore: 92,
    developer: "Nintendo",
  };

  it("calculates high similarity between games of same genre and developer", () => {
    const similarity = GameSimilarityEngine.calculateSimilarity(gameA, gameB);
    expect(similarity).toBeGreaterThan(50);
  });

  it("calculates low/zero similarity between completely distinct games", () => {
    const similarity = GameSimilarityEngine.calculateSimilarity(gameA, gameC);
    expect(similarity).toBeLessThan(20);
  });

  it("never matches a game with itself", () => {
    const similarity = GameSimilarityEngine.calculateSimilarity(gameA, gameA);
    expect(similarity).toBe(-1);
  });

  it("finds top similar games and excludes target game", () => {
    const candidates = [gameA, gameB, gameC];
    const top = GameSimilarityEngine.findTopSimilar(gameA, candidates, 2);

    expect(top).toContain("game-2");
    expect(top).not.toContain("game-1");
  });
});
