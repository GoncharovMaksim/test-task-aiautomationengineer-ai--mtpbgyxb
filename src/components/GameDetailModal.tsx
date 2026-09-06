"use client";

import React, { useState } from "react";
import { Game } from "../domain/entities/Game";
import { COVER_IMAGE_MAP } from "../infrastructure/seed/seedData";
import { ScoreBadge } from "./ScoreBadge";
import { PlatformTag } from "./PlatformTag";
import {
  X,
  ExternalLink,
  Bot,
  PlayCircle,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Calendar,
  Building2,
  Film,
  Video,
  CheckCircle2,
} from "lucide-react";

interface GameDetailModalProps {
  game: Game | null;
  similarGames: Game[];
  onClose: () => void;
  onSelectGame: (game: Game) => void;
  onGameUpdated?: (game: Game) => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({
  game,
  similarGames,
  onClose,
  onSelectGame,
  onGameUpdated,
}) => {
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [regenerateNotice, setRegenerateNotice] = useState<string | null>(null);

  if (!game) return null;

  const handleRegenerateAI = async () => {
    if (!game || isRegenerating) return;
    setIsRegenerating(true);
    setRegenerateNotice(null);
    try {
      const res = await fetch(`/api/games/${game.id}/regenerate-ai`, {
        method: "POST",
      });
      if (res.ok) {
        const data = await res.json();
        if (data.game) {
          onGameUpdated?.(data.game);
          setRegenerateNotice("Successfully regenerated with Google Gemini 2.5 Flash!");
          setTimeout(() => setRegenerateNotice(null), 5000);
        }
      }
    } catch (err) {
      console.error("Failed to regenerate AI:", err);
    } finally {
      setIsRegenerating(false);
    }
  };

  // Extract YouTube video ID if standard format
  const getYouTubeEmbedUrl = (url?: string) => {
    if (!url) return null;
    try {
      const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/);
      return match ? `https://www.youtube.com/embed/${match[1]}?rel=0&modestbranding=1` : null;
    } catch {
      return null;
    }
  };

  const trailerEmbed = getYouTubeEmbedUrl(game.videoUrl);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[90vh] flex flex-col">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-zinc-900/95 backdrop-blur border-b border-zinc-800 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-bold text-zinc-100 truncate">{game.title}</h2>
            <div className="flex items-center gap-2">
              <ScoreBadge score={game.metascore} type="metascore" size="sm" />
              <ScoreBadge score={game.userscore} type="userscore" size="sm" />
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main Hero Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cover Column */}
            <div className="md:col-span-1 space-y-3">
              <div className="aspect-[3/4] rounded-xl overflow-hidden bg-zinc-950 border border-zinc-800">
                <img
                  src={COVER_IMAGE_MAP[game.slug] || game.coverImage}
                  alt={game.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    const fallbackMapped = COVER_IMAGE_MAP[game.slug];
                    if (fallbackMapped && !target.src.includes(fallbackMapped)) {
                      target.src = fallbackMapped;
                    } else {
                      target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=400&q=80";
                    }
                  }}
                />
              </div>

              {/* Meta information */}
              <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-2 text-xs">
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Building2 className="w-3.5 h-3.5" /> Developer:
                  </span>
                  <span className="font-mono text-zinc-200">{game.developer}</span>
                </div>
                <div className="flex items-center justify-between text-zinc-400">
                  <span className="flex items-center gap-1.5 text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" /> Release Date:
                  </span>
                  <span className="font-mono text-zinc-200">{game.releaseDate}</span>
                </div>
                <div className="pt-2 border-t border-zinc-800/60">
                  <span className="text-[11px] text-zinc-500 block mb-1.5">Platforms & Scores:</span>
                  <div className="space-y-1.5">
                    {game.platforms.map((plat) => (
                      <div
                        key={plat.platform}
                        className="flex items-center justify-between bg-zinc-900/60 px-2 py-1 rounded text-[11px]"
                      >
                        <span className="font-mono text-zinc-300">{plat.platform}</span>
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-emerald-400 font-semibold">
                            M: {plat.metascore ?? "tbd"}
                          </span>
                          <span className="text-blue-400 font-semibold">
                            U: {plat.userscore !== null ? plat.userscore.toFixed(1) : "tbd"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href={game.url}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-xs transition-colors font-medium"
                  >
                    View on Metacritic <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                </div>
              </div>
            </div>

            {/* Right Details Column */}
            <div className="md:col-span-2 space-y-6">
              {/* Description */}
              <div>
                <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-mono mb-2">
                  Overview
                </h3>
                <p className="text-sm text-zinc-300 leading-relaxed bg-zinc-950/40 p-3.5 rounded-xl border border-zinc-800/60">
                  {game.description}
                </p>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {game.genres.map((genre) => (
                    <span
                      key={genre}
                      className="px-2 py-0.5 rounded text-[11px] font-mono text-zinc-400 bg-zinc-800/60 border border-zinc-700/50"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              </div>

              {/* Video / Trailer */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs uppercase tracking-wider text-zinc-400 font-mono flex items-center gap-1.5">
                    <Film className="w-3.5 h-3.5 text-zinc-400" /> Official Trailer & Gameplay
                  </h3>
                  <a
                    href={game.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-zinc-400 hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors"
                  >
                    Watch on YouTube <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {trailerEmbed ? (
                  <div className="space-y-2">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-zinc-800 shadow-inner">
                      <iframe
                        src={trailerEmbed}
                        title={`${game.title} trailer`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        className="w-full h-full border-0"
                      />
                    </div>
                    <div className="flex items-center justify-between px-1 text-[11px] text-zinc-500 font-mono">
                      <span>If video shows unavailable (YouTube ISP filter / region):</span>
                      <a
                        href={game.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-amber-400 hover:text-amber-300 underline inline-flex items-center gap-1"
                      >
                        Open directly <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="p-4 rounded-xl bg-zinc-950/60 border border-zinc-800 text-center text-xs text-zinc-400">
                    <p className="mb-2">Official gameplay trailer stream:</p>
                    <a
                      href={game.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(game.title + " trailer")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-mono transition-colors"
                    >
                      <PlayCircle className="w-4 h-4 text-red-400" /> Open Trailer Stream on YouTube
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Review Summaries Section (Separate Critic & User Summaries) */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <div className="flex items-center gap-2">
                <Bot className="w-4 h-4 text-zinc-300" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  AI Review Summaries (Critic vs. User Breakdown)
                </h3>
              </div>
              <button
                onClick={handleRegenerateAI}
                disabled={isRegenerating}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isRegenerating ? "animate-spin" : ""}`} />
                {isRegenerating ? "Synthesizing with Gemini..." : "Regenerate with Gemini 2.5 Flash"}
              </button>
            </div>

            {regenerateNotice && (
              <div className="mb-4 p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{regenerateNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Critic Reviews Summary */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                    Critic Reviews Summary
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      {game.criticReviewSummary?.model || "Google Gemini 2.5 Flash"}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {game.criticReviewSummary?.sampleCount ?? 0} reviews
                    </span>
                  </div>
                </div>

                {game.criticReviewSummary ? (
                  <>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                      &ldquo;{game.criticReviewSummary.consensus}&rdquo;
                    </p>

                    <div className="space-y-2 pt-1">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                          <ThumbsUp className="w-3 h-3" /> What Critics Praise:
                        </div>
                        <ul className="space-y-1 text-xs text-zinc-400 pl-4 list-disc">
                          {game.criticReviewSummary.liked.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-1">
                          <ThumbsDown className="w-3 h-3" /> What Critics Dislike:
                        </div>
                        <ul className="space-y-1 text-xs text-zinc-400 pl-4 list-disc">
                          {game.criticReviewSummary.disliked.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-zinc-500">No critic reviews summarized yet.</p>
                )}
              </div>

              {/* User Reviews Summary */}
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-zinc-800/80">
                  <span className="text-xs font-semibold text-zinc-200 uppercase tracking-wider font-mono">
                    User Reviews Summary
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                      <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                      {game.userReviewSummary?.model || "Google Gemini 2.5 Flash"}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {game.userReviewSummary?.sampleCount ?? 0} reviews
                    </span>
                  </div>
                </div>

                {game.userReviewSummary ? (
                  <>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">
                      &ldquo;{game.userReviewSummary.consensus}&rdquo;
                    </p>

                    <div className="space-y-2 pt-1">
                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium mb-1">
                          <ThumbsUp className="w-3 h-3" /> What Players Praise:
                        </div>
                        <ul className="space-y-1 text-xs text-zinc-400 pl-4 list-disc">
                          {game.userReviewSummary.liked.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 text-xs text-rose-400 font-medium mb-1">
                          <ThumbsDown className="w-3 h-3" /> What Players Dislike:
                        </div>
                        <ul className="space-y-1 text-xs text-zinc-400 pl-4 list-disc">
                          {game.userReviewSummary.disliked.map((item, i) => (
                            <li key={i}>{item}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-zinc-500">No user reviews summarized yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* YouTube Let's Play Analysis Section (Extra Task 1) */}
          <div className="pt-2 border-t border-zinc-800">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <PlayCircle className="w-4 h-4 text-red-400" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  YouTube Let's Play & Streamer Commentary Analysis
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-700 text-zinc-300">
                  <Sparkles className="w-2.5 h-2.5 text-amber-400" />
                  {game.letsPlayAnalysis?.model || "Google Gemini 2.5 Flash"}
                </span>
                {game.letsPlayAnalysis && (
                  <span className="text-[11px] font-mono text-zinc-500">
                    {game.letsPlayAnalysis.viewCount} &bull; {game.letsPlayAnalysis.channelName}
                  </span>
                )}
              </div>
            </div>

            {game.letsPlayAnalysis ? (
              <div className="bg-zinc-950/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-zinc-800/80">
                  <div>
                    <h4 className="text-xs font-semibold text-zinc-200">
                      {game.letsPlayAnalysis.videoTitle}
                    </h4>
                    <span className="text-[11px] text-zinc-500 font-mono">
                      Channel: {game.letsPlayAnalysis.channelName}
                    </span>
                  </div>
                  <a
                    href={game.letsPlayAnalysis.videoUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-zinc-400 hover:text-zinc-200 font-mono shrink-0"
                  >
                    Watch Let's Play <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                {/* Streamer takeaway */}
                <p className="text-xs text-zinc-300 leading-relaxed">
                  {game.letsPlayAnalysis.summary}
                </p>

                {/* Streamer verdict quote */}
                <div className="bg-zinc-900/80 border border-zinc-800 px-3 py-2 rounded-lg text-xs text-zinc-300 font-mono italic">
                  {game.letsPlayAnalysis.bloggerVerdict}
                </div>

                {/* Pros and Cons from commentary */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                      Streamer Positives:
                    </span>
                    <ul className="text-xs text-zinc-400 space-y-0.5 list-disc pl-4">
                      {game.letsPlayAnalysis.pros.map((p, i) => (
                        <li key={i}>{p}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <span className="text-[11px] font-mono text-rose-400 uppercase tracking-wider block mb-1">
                      Streamer Concerns:
                    </span>
                    <ul className="text-xs text-zinc-400 space-y-0.5 list-disc pl-4">
                      {game.letsPlayAnalysis.cons.map((c, i) => (
                        <li key={i}>{c}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">No YouTube let's play analyzed yet.</p>
            )}
          </div>

          {/* Similar Games Section */}
          <div className="pt-2 border-t border-zinc-800">
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">
              Similar Games in Database
            </h3>

            {similarGames.length === 0 ? (
              <p className="text-xs text-zinc-500">No similar games indexed yet.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {similarGames.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => onSelectGame(sim)}
                    className="group bg-zinc-950/60 hover:bg-zinc-900 border border-zinc-800/80 hover:border-zinc-700 p-2.5 rounded-xl cursor-pointer transition-all"
                  >
                    <div className="aspect-[16/9] rounded-lg overflow-hidden bg-black mb-2">
                      <img
                        src={COVER_IMAGE_MAP[sim.slug] || sim.coverImage}
                        alt={sim.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          const fallbackMapped = COVER_IMAGE_MAP[sim.slug];
                          if (fallbackMapped && !target.src.includes(fallbackMapped)) {
                            target.src = fallbackMapped;
                          } else {
                            target.src = "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=300&q=80";
                          }
                        }}
                      />
                    </div>
                    <h4 className="text-xs font-semibold text-zinc-200 group-hover:text-white truncate">
                      {sim.title}
                    </h4>
                    <div className="flex items-center justify-between mt-1 text-[11px] font-mono text-zinc-400">
                      <span className="text-zinc-500">{sim.primaryPlatform}</span>
                      <span className="text-emerald-400">{sim.metascore ?? "-"}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
