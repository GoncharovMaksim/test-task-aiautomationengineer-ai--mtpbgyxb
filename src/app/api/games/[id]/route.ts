import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await container.getGamesUseCase.getById(params.id);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    const similarGames = await container.findSimilarGamesUseCase.execute(game.id, 4);

    return NextResponse.json({
      game,
      similarGames,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch game details" }, { status: 500 });
  }
}
