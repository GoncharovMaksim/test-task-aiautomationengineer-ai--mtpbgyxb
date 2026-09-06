"use client";

import React, { useState } from "react";
import { WorkerStatus } from "../domain/entities/WorkerStatus";
import { CrawlLog } from "../domain/entities/CrawlLog";
import { Activity, CheckCircle2, AlertCircle, RefreshCw, Terminal, Clock, Database, Layers, Sparkles, X } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

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
  const { t } = useLanguage();
  const [selectedSource, setSelectedSource] = useState<"new-releases" | "browse-all-new">("new-releases");
  const [isExpanded, setIsExpanded] = useState(true);
  const [isTestingAI, setIsTestingAI] = useState(false);
  const [aiTestResult, setAiTestResult] = useState<{
    success: boolean;
    status: string;
    latencyMs?: number;
    model?: string;
    aiResponse?: any;
    error?: string;
    apiKeyMasked?: string;
  } | null>(null);

  const handleTestAI = async () => {
    setIsTestingAI(true);
    try {
      const res = await fetch("/api/ai/test");
      const data = await res.json();
      setAiTestResult(data);
    } catch (err: any) {
      setAiTestResult({
        success: false,
        status: "network_error",
        error: err.message,
      });
    } finally {
      setIsTestingAI(false);
    }
  };

  const isRunning =
    status?.state !== "idle" && status?.state !== "completed" && status?.state !== "error";

  const getStatusBadge = () => {
    if (!status) return null;

    if (isRunning) {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-amber-950/60 text-amber-300 border border-amber-800/80">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
          {t("statusRunning")}
        </span>
      );
    }

    if (status.state === "error") {
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-rose-950/60 text-rose-300 border border-rose-800/80">
          <AlertCircle className="w-3.5 h-3.5" />
          {t("statusError")}
        </span>
      );
    }

    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-950/60 text-emerald-300 border border-emerald-800/80">
        <CheckCircle2 className="w-3.5 h-3.5" />
        {t("statusIdle")}
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
              <h2 className="text-sm font-semibold text-zinc-100">{t("monitorTitle")}</h2>
              {getStatusBadge()}
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              {t("monitorSubtitle")}
            </p>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleTestAI}
            disabled={isTestingAI}
            title="Ping Gemini 2.5 Flash API to verify live generation"
            className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition-colors disabled:opacity-50"
          >
            <Sparkles className={`w-3.5 h-3.5 text-amber-400 ${isTestingAI ? "animate-spin" : ""}`} />
            {isTestingAI ? t("testingAi") : t("testAiBtn")}
          </button>

          <select
            value={selectedSource}
            onChange={(e) => setSelectedSource(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 text-xs text-zinc-300 rounded-lg px-2.5 py-2 focus:outline-none focus:border-zinc-700 cursor-pointer"
          >
            <option value="new-releases">{t("sourceSection1")}</option>
            <option value="browse-all-new">{t("sourceSection2")}</option>
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
            {isRunning ? t("processingBtn") : t("runPipelineBtn")}
          </button>
        </div>
      </div>

      {/* AI Diagnostic Result Banner */}
      {aiTestResult && (
        <div className={`mt-3 p-3 rounded-xl border text-xs font-mono ${
          aiTestResult.success
            ? "bg-emerald-950/40 border-emerald-800/80 text-emerald-200"
            : "bg-rose-950/40 border-rose-800/80 text-rose-200"
        }`}>
          <div className="flex items-center justify-between pb-1.5 border-b border-zinc-800/60 mb-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="font-semibold">{t("diagnosticsTitle")}: {aiTestResult.model || "Google Gemini 2.5 Flash"}</span>
            </div>
            <div className="flex items-center gap-3">
              {aiTestResult.latencyMs !== undefined && (
                <span className="text-[11px] opacity-80">{t("latencyLabel")}: {aiTestResult.latencyMs}ms</span>
              )}
              <button
                onClick={() => setAiTestResult(null)}
                className="text-zinc-400 hover:text-zinc-100 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="space-y-1 text-[11px]">
            <div>{t("statusLabel")}: <span className="font-semibold uppercase">{aiTestResult.status}</span></div>
            {aiTestResult.apiKeyMasked && (
              <div>{t("apiKeyLabel")}: <span>{aiTestResult.apiKeyMasked} ({t("apiKeyEnv")})</span></div>
            )}
            {aiTestResult.aiResponse && (
              <div className="mt-2 p-2.5 rounded-lg bg-zinc-950/70 border border-zinc-800/80 text-zinc-300">
                <span className="text-zinc-500 block mb-1">{t("liveGeminiResponse")}:</span>
                &ldquo;{typeof aiTestResult.aiResponse === "object"
                  ? (aiTestResult.aiResponse.testVerdict || JSON.stringify(aiTestResult.aiResponse))
                  : aiTestResult.aiResponse}&rdquo;
              </div>
            )}
            {aiTestResult.error && (
              <div className="mt-1 text-rose-300">{t("errorLabel")}: {aiTestResult.error}</div>
            )}
          </div>
        </div>
      )}

      {/* Real-time metrics grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-4">
        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Database className="w-3.5 h-3.5 text-zinc-400" />
            {t("metricTotalInDb")}
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 font-mono">
            {status?.totalGamesCount ?? 20}
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            {t("metricProcessedToday")}
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 font-mono">
            {status?.gamesProcessedToday ?? 20}
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            {t("metricCurrentPage")}
          </div>
          <div className="text-lg font-semibold text-zinc-100 mt-1 font-mono">
            {t("pagePrefix")} {status?.currentPage ?? 1}
          </div>
        </div>

        <div className="bg-zinc-950/60 border border-zinc-800/80 rounded-lg p-3">
          <div className="flex items-center gap-1.5 text-[11px] font-mono text-zinc-400">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            {t("metricNextRun")}
          </div>
          <div className="text-xs font-semibold text-zinc-200 mt-2 font-mono truncate">
            {status?.nextRunAt ? new Date(status.nextRunAt).toLocaleTimeString() : t("inMinutesPrefix")}
          </div>
        </div>
      </div>

      {/* Real-time Status message */}
      {status?.currentStepMessage && (
        <div className="bg-zinc-950/40 border border-zinc-800/60 rounded-lg px-3 py-2 text-xs text-zinc-300 font-mono flex items-center justify-between mb-3">
          <span className="truncate">&gt; {status.currentStepMessage}</span>
          {status.lastRunDurationMs > 0 && (
            <span className="text-zinc-500 whitespace-nowrap ml-2">
              {t("lastRunPrefix")}: {(status.lastRunDurationMs / 1000).toFixed(1)}s
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
            {t("activityStreamTitle")} ({logs.length} {t("eventsCount")})
          </button>
          <span className="text-[10px] font-mono text-zinc-500">{t("liveSseActive")}</span>
        </div>

        {isExpanded && (
          <div className="mt-1.5 bg-zinc-950 border border-zinc-800/80 rounded-lg p-3 max-h-44 overflow-y-auto space-y-1.5 font-mono text-xs">
            {logs.length === 0 ? (
              <div className="text-zinc-500 text-center py-2">{t("noEventsRecorded")}</div>
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
