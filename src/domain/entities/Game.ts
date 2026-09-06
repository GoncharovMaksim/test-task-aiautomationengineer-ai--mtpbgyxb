export interface PlatformScore {
  platform: string;
  metascore: number | null;
  userscore: number | null;
}

export interface ReviewSummary {
  liked: string[];
  disliked: string[];
  consensus: string;
  sampleCount: number;
  updatedAt: string;
  provider?: string;
  model?: string;
}

export interface LetsPlayAnalysis {
  videoTitle: string;
  videoUrl: string;
  channelName: string;
  viewCount?: string;
  transcriptSnippet?: string;
  summary: string;
  pros: string[];
  cons: string[];
  bloggerVerdict: string;
  analyzedAt: string;
  provider?: string;
  model?: string;
}

export interface RawReview {
  id: string;
  author: string;
  score: number;
  date: string;
  content: string;
  type: "critic" | "user";
}

export interface Game {
  id: string;
  title: string;
  slug: string;
  url: string;
  coverImage: string;
  platforms: PlatformScore[];
  primaryPlatform: string;
  metascore: number | null;
  userscore: number | null;
  developer: string;
  publisher?: string;
  releaseDate: string;
  description: string;
  videoUrl: string;
  genres: string[];
  criticReviewSummary: ReviewSummary | null;
  userReviewSummary: ReviewSummary | null;
  letsPlayAnalysis: LetsPlayAnalysis | null;
  similarGameIds: string[];
  crawledAt: string;
  updatedAt: string;
  crawlSource: "new-releases" | "browse-all-new" | "manual";
}
