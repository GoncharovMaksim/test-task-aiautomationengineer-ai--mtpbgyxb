import { Game } from "../../domain/entities/Game";
import { IGameRepository } from "../../domain/repositories/IGameRepository";
import { GameSimilarityEngine } from "../../infrastructure/similarity/GameSimilarityEngine";

export class FindSimilarGamesUseCase {
  constructor(private gameRepo: IGameRepository) {}

  public async execute(targetGameId: string, limit = 4): Promise<Game[]> {
    const target = await this.gameRepo.getById(targetGameId);
    if (!target) return [];

    if (target.similarGameIds && target.similarGameIds.length > 0) {
      const results: Game[] = [];
      for (const id of target.similarGameIds.slice(0, limit)) {
        const sim = await this.gameRepo.getById(id);
        if (sim) results.push(sim);
      }
      if (results.length > 0) return results;
    }

    const allCandidates = await this.gameRepo.getAllGamesForSimilarity();
    const topIds = GameSimilarityEngine.findTopSimilar(
      {
        id: target.id,
        title: target.title,
        genres: target.genres,
        primaryPlatform: target.primaryPlatform,
        metascore: target.metascore,
        developer: target.developer,
      },
      allCandidates,
      limit
    );

    const found: Game[] = [];
    for (const id of topIds) {
      const g = await this.gameRepo.getById(id);
      if (g) found.push(g);
    }
    return found;
  }
}
