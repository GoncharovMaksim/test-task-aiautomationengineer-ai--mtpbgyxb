import { Game } from "../../domain/entities/Game";
import { GameFilterParams, IGameRepository } from "../../domain/repositories/IGameRepository";

export class GetGamesUseCase {
  constructor(private gameRepo: IGameRepository) {}

  public async execute(params: GameFilterParams = {}): Promise<{ games: Game[]; total: number }> {
    return this.gameRepo.getAll(params);
  }

  public async getById(id: string): Promise<Game | null> {
    return this.gameRepo.getById(id);
  }
}
