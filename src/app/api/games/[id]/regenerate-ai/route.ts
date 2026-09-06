import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await container.getGamesUseCase.getById(params.id);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const fullDetails = await container.metacriticCrawler.fetchGameFullDetails({
      title: game.title,
      slug: game.slug,
      url: game.url,
      coverImage: game.coverImage,
      metascore: game.metascore,
      userscore: game.userscore,
      primaryPlatform: game.primaryPlatform,
      source: game.crawlSource === "browse-all-new" ? "browse-all-new" : "new-releases",
    });

    const [criticSummary, userSummary, letsPlay] = await Promise.all([
      container.aiSummarizer.summarizeReviews(game.title, fullDetails.criticReviews, "critic"),
      container.aiSummarizer.summarizeReviews(game.title, fullDetails.userReviews, "user"),
      container.youtubeService.searchAndAnalyzeLetsPlay(game.title),
    ]);

    const updatedGame = {
      ...game,
      criticReviewSummary: criticSummary,
      userReviewSummary: userSummary,
      letsPlayAnalysis: letsPlay,
      updatedAt: new Date().toISOString(),
    };

    await container.gameRepository.upsertMany([updatedGame]);

    return NextResponse.json({
      success: true,
      message: "AI analysis regenerated successfully with live Gemini 2.5 Flash.",
      game: updatedGame,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Failed to regenerate AI analysis" },
      { status: 500 }
    );
  }
}
