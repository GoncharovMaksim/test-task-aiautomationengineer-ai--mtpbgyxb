import { Game } from "../entities/Game";

export interface GameFilterParams {
  platform?: string;
  search?: string;
  sortBy?: "metascore" | "userscore" | "date" | "title";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface IGameRepository {
  getAll(filters?: GameFilterParams): Promise<{ games: Game[]; total: number }>;
  getById(id: string): Promise<Game | null>;
  getBySlug(slug: string): Promise<Game | null>;
  upsert(game: Game): Promise<void>;
  upsertMany(games: Game[]): Promise<void>;
  count(): Promise<number>;
  getProcessedTodaySlugs(todayDateStr: string): Promise<Set<string>>;
  getAllGamesForSimilarity(): Promise<Pick<Game, "id" | "title" | "genres" | "primaryPlatform" | "metascore" | "developer">[]>;
}
