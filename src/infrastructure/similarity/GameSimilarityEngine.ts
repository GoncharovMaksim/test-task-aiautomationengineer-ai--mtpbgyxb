import { Game } from "../../domain/entities/Game";

export interface SimilarityCandidate {
  id: string;
  title: string;
  genres: string[];
  primaryPlatform: string;
  metascore: number | null;
  developer: string;
}

export class GameSimilarityEngine {
  public static calculateSimilarity(game: SimilarityCandidate, candidate: SimilarityCandidate): number {
    if (game.id === candidate.id) return -1;

    let score = 0;

    // 1. Genre Jaccard similarity (0 to 45 points)
    const genresA = new Set(game.genres.map((g) => g.toLowerCase().trim()));
    const genresB = new Set(candidate.genres.map((g) => g.toLowerCase().trim()));
    if (genresA.size > 0 && genresB.size > 0) {
      let intersection = 0;
      genresA.forEach((g) => {
        if (genresB.has(g)) intersection++;
      });
      const union = new Set([...genresA, ...genresB]).size;
      const jaccard = union > 0 ? intersection / union : 0;
      score += jaccard * 45;
    }

    // 2. Developer match (25 points)
    if (
      game.developer &&
      candidate.developer &&
      game.developer.toLowerCase().trim() === candidate.developer.toLowerCase().trim()
    ) {
      score += 25;
    }

    // 3. Platform match (15 points)
    if (
      game.primaryPlatform &&
      candidate.primaryPlatform &&
      game.primaryPlatform.toLowerCase() === candidate.primaryPlatform.toLowerCase()
    ) {
      score += 15;
    }

    // 4. Metascore proximity (up to 15 points)
    if (game.metascore !== null && candidate.metascore !== null) {
      const diff = Math.abs(game.metascore - candidate.metascore);
      if (diff <= 5) score += 15;
      else if (diff <= 15) score += 10;
      else if (diff <= 25) score += 5;
    }

    return score;
  }

  public static findTopSimilar(
    targetGame: SimilarityCandidate,
    allGames: SimilarityCandidate[],
    topK = 4
  ): string[] {
    const scored = allGames
      .filter((candidate) => candidate.id !== targetGame.id)
      .map((candidate) => ({
        id: candidate.id,
        similarity: this.calculateSimilarity(targetGame, candidate),
      }))
      .filter((item) => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity);

    return scored.slice(0, topK).map((item) => item.id);
  }
}
