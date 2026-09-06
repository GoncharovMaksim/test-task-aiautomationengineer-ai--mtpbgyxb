import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const result = await container.crawlMetacriticUseCase.execute();
    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      result,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Cron run failed" }, { status: 500 });
  }
}
