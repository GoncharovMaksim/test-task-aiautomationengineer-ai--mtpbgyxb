import React from "react";

interface PlatformTagProps {
  platform: string;
}

export const PlatformTag: React.FC<PlatformTagProps> = ({ platform }) => {
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-mono text-zinc-300 bg-zinc-900 border border-zinc-800 rounded">
      {platform}
    </span>
  );
};
