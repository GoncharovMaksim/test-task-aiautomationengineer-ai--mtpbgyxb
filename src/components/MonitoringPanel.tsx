"use client";

import React, { useState } from "react";
import { WorkerStatus } from "../domain/entities/WorkerStatus";
import { CrawlLog } from "../domain/entities/CrawlLog";
import { Play, Activity, CheckCircle2, AlertCircle, RefreshCw, Terminal, Clock, Database, Layers } from "lucide-react";

interface MonitoringPanelProps {
  status: WorkerStatus | null;
  logs: CrawlLog[];
  onTrigger: (source?: "new-releases" | "browse-all-new") => Promise<void>;
  isTriggering: boolean;
}

export const MonitoringPanel: React.FC<MonitoringPanelProps> = ({
  status,
  logs,
  onTrigger,
  isTriggering,
}) => {
  const [selectedSource, setSelectedSource] = useState<"new-releases" | "browse-all-new">("new-releases");
  const [isExpanded, setIsExpanded] = useState(true);

  const isRunning =
    status?.state !== "idle" && status?.state !== "completed" && status?.state !== "error";

  const getStatusBadge = () => {
    if (!status) return null;

    if (isRunning) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-amber-950/60 text-amber-300 border border-amber-800/80">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          {status.state.toUpperCase().replace(/_/g, " ")}
        </span>
      );
    }

    if (status.state === "error") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-rose-950/60 text-rose-300 border border-rose-800/80">
          <AlertCircle className="w-3.5 h-3.5" />
          ERROR
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
        <CheckCircle2 className="w-3.5 h-3.5" />
        IDLE (READY)
      </span>
    );
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 md:p-5 mb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-zinc-800/70 border border-zinc-700/60 rounded-lg">
            <Activity className="w-5 h-5 text-zinc-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-semibold text-zinc-100">Crawler & Pipeline Monitor</h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Automated 1-hour scheduler &bull; Metacritic scraper &bull; AI review & Let's Play synthesis
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2.5">
          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer"
          >
            <option value="new-releases">Section 1: New Releases (/game/)</option>
            <option value="browse-all-new">Section 2: SEE ALL New (/browse/...)</option>
          </select>

          <button
            onClick={() => onTrigger(selectedSource)}
            disabled={isRunning || isTriggering}
            className={`inline-flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-lg transition-colors ${
              isRunning || isTriggering
                ? "bg-zinc-800 text-zinc-500 cursor-not-allowed border border-zinc-700"
                : "bg-zinc-100 hover:bg-white text-zinc-950 border border-zinc-200 active:scale-[0.98]"
            }`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 ${isRunning || isTriggering ? "animate-spin" : ""}`}
            />
            {isRunning ? "Processing..." : "Run Pipeline Now"}
          </button>
        </div>
      </div>

      {/* Real-time metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            TOTAL IN DB
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 font-mono">
            {status?.totalGamesCount ?? 20}
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            PROCESSED TODAY
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 font-mono">
            {status?.gamesProcessedToday ?? 20}
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            CURRENT PAGE OFFSET
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 font-mono">
            Page {status?.currentPage ?? 1}
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            NEXT SCHEDULED RUN
          </div>
          <div className="text-xs font-semibold text-zinc-200 mt-2 font-mono truncate">
            {status?.nextRunAt ? new Date(status.nextRunAt).toLocaleTimeString() : "In ~35m"}
          </div>
        </div>
      </div>

      {/* Real-time Status message */}
      {status?.currentStepMessage && (
        <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono flex items-center justify-between mb-3">
          <span className="truncate">&gt; {status.currentStepMessage}</span>
          {status.lastRunDurationMs > 0 && (
            <span className="text-zinc-500 whitespace-nowrap ml-2">
              Last run: {(status.lastRunDurationMs / 1000).toFixed(1)}s
            </span>
          )}
        </div>
      )}

      {/* Activity Logs Stream */}
      <div>
        <div className="flex items-center justify-between py-1.5">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5"
          >
            <Terminal className="w-3 h-3 text-zinc-500" />
            Pipeline Activity Stream ({logs.length} events)
          </button>
          <span className="text-[10px] font-mono text-zinc-500">Live SSE Polling Active</span>
        </div>

        {isExpanded && (
          <div className="mt-1.5 bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 max-h-44 overflow-y-auto space-y-1.5 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-zinc-500 text-center py-2">No activity events recorded yet.</div>
            ) : (
              logs.map((log) => {
                let badgeColor = "text-zinc-400";
                if (log.level === "success") badgeColor = "text-emerald-400";
                if (log.level === "error") badgeColor = "text-rose-400";
                if (log.level === "warn") badgeColor = "text-amber-400";

                return (
                  <div key={log.id} className="flex items-start gap-2.5 text-[11px] leading-relaxed">
                    <span className="text-zinc-500 shrink-0">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`uppercase font-bold shrink-0 text-[10px] ${badgeColor}`}>
                      [{log.level}]
                    </span>
                    <span className="text-zinc-300 break-words">{log.message}</span>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
};
