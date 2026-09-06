import { Game } from "../domain/entities/Game";
import { GAMES_RU } from "./gamesRu";
import { Language } from "./translations";

const GENRE_TRANSLATIONS: Record<string, string> = {
  "Platformer": "Платформер",
  "Action": "Экшен",
  "Action RPG": "Ролевой экшен",
  "Soulslike": "Соулслайк",
  "Fantasy": "Фэнтези",
  "JRPG": "JRPG",
  "Turn-Based": "Пошаговая",
  "Open World": "Открытый мир",
  "Sci-Fi": "Научная фантастика",
  "Roguelike": "Рогалик",
  "Mythology": "Мифология",
  "Deckbuilder": "Колодострой",
  "Strategy": "Стратегия",
  "Metroidvania": "Метроидвания",
  "Puzzle": "Головоломка",
  "Pixel Art": "Пиксель-арт",
  "Fighting": "Файтинг",
  "3D": "3D",
  "Competitive": "Соревновательный",
  "Survival Horror": "Хоррор на выживание",
  "Psychological Horror": "Психологический хоррор",
  "Co-op Shooter": "Кооперативный шутер",
  "Third-Person": "От третьего лица",
  "Third-Person Shooter": "Шутер от третьего лица",
  "Comedy/Crime": "Комедия/Криминал",
  "Post-Apocalyptic": "Постапокалипсис",
  "Action-Adventure": "Приключенческий экшен",
  "City Builder": "Градостроительный симулятор",
  "Survival": "Выживание",
  "Artistic": "Арт-игра",
  "FPS": "Шутер от первого лица",
  "First-Person": "От первого лица",
  "Cinematic": "Кинематографичный",
  "Co-op": "Кооператив",
};

export function localizeGame(game: Game, language: Language): Game {
  if (language === "en") {
    return game;
  }

  const ruData = GAMES_RU[game.slug];

  // Localize genres using explicit map or dictionary
  const localizedGenres = ruData?.genres || game.genres.map((g) => GENRE_TRANSLATIONS[g] || g);

  // Localize critic reviews summary
  const localizedCriticSummary = game.criticReviewSummary
    ? {
        ...game.criticReviewSummary,
        consensus: ruData?.criticConsensus || game.criticReviewSummary.consensus,
        liked: ruData?.criticLiked || game.criticReviewSummary.liked,
        disliked: ruData?.criticDisliked || game.criticReviewSummary.disliked,
      }
    : null;

  // Localize user reviews summary
  const localizedUserSummary = game.userReviewSummary
    ? {
        ...game.userReviewSummary,
        consensus: ruData?.userConsensus || game.userReviewSummary.consensus,
        liked: ruData?.userLiked || game.userReviewSummary.liked,
        disliked: ruData?.userDisliked || game.userReviewSummary.disliked,
      }
    : null;

  // Localize let's play analysis
  const localizedLetsPlay = game.letsPlayAnalysis
    ? {
        ...game.letsPlayAnalysis,
        videoTitle: ruData?.letsPlayTitle || game.letsPlayAnalysis.videoTitle,
        summary: ruData?.letsPlaySummary || game.letsPlayAnalysis.summary,
        bloggerVerdict: ruData?.bloggerVerdict || game.letsPlayAnalysis.bloggerVerdict,
        pros: ruData?.pros || game.letsPlayAnalysis.pros,
        cons: ruData?.cons || game.letsPlayAnalysis.cons,
      }
    : null;

  return {
    ...game,
    description: ruData?.description || game.description,
    genres: localizedGenres,
    criticReviewSummary: localizedCriticSummary,
    userReviewSummary: localizedUserSummary,
    letsPlayAnalysis: localizedLetsPlay,
  };
}
