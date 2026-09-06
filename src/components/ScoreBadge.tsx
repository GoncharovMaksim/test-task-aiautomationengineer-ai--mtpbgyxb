import React from "react";

interface ScoreBadgeProps {
  score: number | null;
  type: "metascore" | "userscore";
  size?: "sm" | "md" | "lg";
}

export const ScoreBadge: React.FC<ScoreBadgeProps> = ({ score, type, size = "md" }) => {
  if (score === null || score === undefined) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 text-xs font-mono text-zinc-500 bg-zinc-900 border border-zinc-800 rounded">
        tbd
      </span>
    );
  }

  // Normalize score to 100-scale for color determination
  const normalized = type === "userscore" ? score * 10 : score;

  let colorClasses = "bg-emerald-950/80 text-emerald-300 border-emerald-800/60";
  if (normalized < 50) {
    colorClasses = "bg-rose-950/80 text-rose-300 border-rose-800/60";
  } else if (normalized < 75) {
    colorClasses = "bg-amber-950/80 text-amber-300 border-amber-800/60";
  }

  const sizeClasses = {
    sm: "text-xs px-1.5 py-0.5",
    md: "text-xs px-2 py-1 font-semibold",
    lg: "text-sm px-3 py-1.5 font-bold",
  }[size];

  const formattedScore = type === "userscore" ? score.toFixed(1) : Math.round(score);

  return (
    <div className="inline-flex items-center gap-1.5">
      <span
        className={`inline-flex items-center justify-center font-mono border rounded ${colorClasses} ${sizeClasses}`}
      >
        {formattedScore}
      </span>
      <span className="text-[10px] uppercase tracking-wider text-zinc-400 font-medium">
        {type === "metascore" ? "Metascore" : "Users"}
      </span>
    </div>
  );
};
