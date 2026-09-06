import React from "react";
import { Game } from "../domain/entities/Game";
import { COVER_IMAGE_MAP } from "../infrastructure/seed/seedData";
import { ScoreBadge } from "./ScoreBadge";
import { PlatformTag } from "./PlatformTag";
import { Video, Bot, PlayCircle } from "lucide-react";

interface GameCardProps {
  game: Game;
  onClick: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onClick }) => {
  const coverSrc = COVER_IMAGE_MAP[game.slug] || game.coverImage;

  return (
    <div
      onClick={onClick}
      className="group relative bg-zinc-900/60 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 rounded-xl overflow-hidden cursor-pointer transition-all duration-200 flex flex-col justify-between"
    >
      <div>
        {/* Cover Image */}
        <div className="relative aspect-[16/9] w-full bg-zinc-950 overflow-hidden border-b border-zinc-800/80">
          <img
            src={coverSrc}
            alt={game.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const fallbackMapped = COVER_IMAGE_MAP[game.slug];
              if (fallbackMapped && !target.src.includes(fallbackMapped)) {
                target.src = fallbackMapped;
              } else {
                target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80";
              }
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent opacity-80" />

          {/* Top badges */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5">
            {game.letsPlayAnalysis && (
              <span
                title="YouTube Let's Play Transcribed & Analyzed"
                className="bg-zinc-950/80 backdrop-blur border border-zinc-800 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"
              >
                <PlayCircle className="w-3 h-3 text-red-400" />
                Let's Play
              </span>
            )}
            {game.criticReviewSummary && (
              <span
                title="AI Review Synthesis Available"
                className="bg-zinc-950/80 backdrop-blur border border-zinc-800 text-zinc-300 text-[10px] px-1.5 py-0.5 rounded flex items-center gap-1"
              >
                <Bot className="w-3 h-3 text-zinc-300" />
                AI Summary
              </span>
            )}
          </div>

          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
            <span className="text-[11px] font-mono text-zinc-400 truncate drop-shadow-sm">
              {game.developer}
            </span>
            <span className="text-[11px] font-mono text-zinc-500 whitespace-nowrap">
              {game.releaseDate}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 space-y-3">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white line-clamp-1">
              {game.title}
            </h3>
            <p className="text-xs text-zinc-400 line-clamp-2 mt-1 leading-relaxed">
              {game.description}
            </p>
          </div>

          {/* Platforms */}
          <div className="flex flex-wrap gap-1">
            {game.platforms.slice(0, 3).map((p) => (
              <PlatformTag key={p.platform} platform={p.platform} />
            ))}
            {game.platforms.length > 3 && (
              <span className="text-[10px] font-mono text-zinc-500 self-center">
                +{game.platforms.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Footer Scores */}
      <div className="px-4 py-3 bg-zinc-950/40 border-t border-zinc-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ScoreBadge score={game.metascore} type="metascore" size="sm" />
          <ScoreBadge score={game.userscore} type="userscore" size="sm" />
        </div>
        <span className="text-xs text-zinc-400 group-hover:text-zinc-200 transition-colors">
          View details &rarr;
        </span>
      </div>
    </div>
  );
};
