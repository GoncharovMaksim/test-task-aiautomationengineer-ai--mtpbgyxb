"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Game } from "../domain/entities/Game";
import { WorkerStatus } from "../domain/entities/WorkerStatus";
import { CrawlLog } from "../domain/entities/CrawlLog";
import { MonitoringPanel } from "../components/MonitoringPanel";
import { FilterBar } from "../components/FilterBar";
import { GameCard } from "../components/GameCard";
import { GameDetailModal } from "../components/GameDetailModal";
import { Shield, Sparkles, Terminal, RefreshCw } from "lucide-react";

export default function HomePage() {
  const [games, setGames] = useState<Game[]>([]);
  const [totalGames, setTotalGames] = useState(0);
  const [isLoadingGames, setIsLoadingGames] = useState(true);

  // Filters & Sorting
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("All");
  const [sortBy, setSortBy] = useState<"metascore" | "userscore" | "date" | "title">("metascore");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  // Worker Monitoring State
  const [workerStatus, setWorkerStatus] = useState<WorkerStatus | null>(null);
  const [logs, setLogs] = useState<CrawlLog[]>([]);
  const [isTriggering, setIsTriggering] = useState(false);

  // Modal State
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [similarGames, setSimilarGames] = useState<Game[]>([]);

  // Fetch Games
  const fetchGames = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (platform !== "All") params.set("platform", platform);
      if (search.trim()) params.set("search", search.trim());
      params.set("sortBy", sortBy);
      params.set("sortOrder", sortOrder);
      params.set("limit", "100");

      const res = await fetch(`/api/games?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setGames(data.games || []);
        setTotalGames(data.total || 0);
      }
    } catch (err) {
      console.error("Failed to load games:", err);
    } finally {
      setIsLoadingGames(false);
    }
  }, [platform, search, sortBy, sortOrder]);

  // Fetch Status & Logs
  const fetchStatusAndLogs = useCallback(async () => {
    try {
      const res = await fetch("/api/crawler/status");
      if (res.ok) {
        const data = await res.json();
        setWorkerStatus(data.status);
        setLogs(data.logs || []);
      }
    } catch (err) {
      console.error("Failed to fetch crawler status:", err);
    }
  }, []);

  // Open Game Detail Modal & fetch similar games
  const handleOpenGame = async (game: Game) => {
    setSelectedGame(game);
    try {
      const res = await fetch(`/api/games/${game.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedGame(data.game);
        setSimilarGames(data.similarGames || []);
      }
    } catch (err) {
      console.error("Failed to fetch game details:", err);
    }
  };

  // Trigger Manual Crawl
  const handleTriggerCrawl = async (source?: "new-releases" | "browse-all-new") => {
    setIsTriggering(true);
    try {
      const res = await fetch("/api/crawler/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: source || "new-releases" }),
      });
      if (res.ok) {
        await fetchStatusAndLogs();
        setTimeout(fetchGames, 2000);
      }
    } catch (err) {
      console.error("Failed to trigger crawler:", err);
    } finally {
      setIsTriggering(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchGames();
    fetchStatusAndLogs();

    // Poll status every 3 seconds for real-time monitoring
    const timer = setInterval(() => {
      fetchStatusAndLogs();
    }, 3000);

    return () => clearInterval(timer);
  }, [fetchGames, fetchStatusAndLogs]);

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 bg-zinc-950/80 backdrop-blur border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded-md bg-zinc-800 border border-zinc-700 flex items-center justify-center font-mono font-bold text-xs text-zinc-200">
              MC
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-sm font-semibold text-zinc-100">Metacritic AI Pipeline</span>
              <span className="text-[11px] font-mono text-zinc-400 hidden sm:inline">
                v1.0 &bull; Skytec Games Test Task
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono text-zinc-400">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Hourly Worker Active
            </span>
            <a
              href="https://github.com/GoncharovMaksim/test-task-aiautomationengineerинженерпоaiавтоматизации-mtpbgyxb"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
        {/* Real-time Worker Monitoring Dashboard (Дополнительная часть 2) */}
        <MonitoringPanel
          status={workerStatus}
          logs={logs}
          onTrigger={handleTriggerCrawl}
          isTriggering={isTriggering}
        />

        {/* Filter and Search Bar */}
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          selectedPlatform={platform}
          onPlatformChange={setPlatform}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          sortOrder={sortOrder}
          onSortOrderToggle={() => setSortOrder(sortOrder === "desc" ? "asc" : "desc")}
          totalCount={totalGames}
        />

        {/* Games Grid */}
        {isLoadingGames ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="h-80 bg-zinc-900/40 border border-zinc-800/60 rounded-xl animate-pulse"
              />
            ))}
          </div>
        ) : games.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-xl">
            <p className="text-sm text-zinc-400">No games found matching your current filter criteria.</p>
            <button
              onClick={() => {
                setSearch("");
                setPlatform("All");
              }}
              className="mt-3 text-xs text-zinc-300 underline font-mono hover:text-white"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {games.map((game) => (
              <GameCard key={game.id} game={game} onClick={() => handleOpenGame(game)} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/80 py-6 mt-12 text-center text-xs text-zinc-400 font-mono">
        Metacritic AI Automation Service &bull; Production Architecture &bull; Clean Architecture &bull; TypeScript & Next.js
      </footer>

      {/* Modal View for Game Detail (Full info, AI reviews, YouTube Let's Play, Similar Games) */}
      <GameDetailModal
        game={selectedGame}
        similarGames={similarGames}
        onClose={() => setSelectedGame(null)}
        onSelectGame={handleOpenGame}
        onGameUpdated={(updatedGame) => {
          setSelectedGame(updatedGame);
          setGames((prev) => prev.map((g) => (g.id === updatedGame.id ? updatedGame : g)));
        }}
      />
    </main>
  );
}
