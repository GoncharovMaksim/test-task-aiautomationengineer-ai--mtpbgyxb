import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const status = await container.stateRepository.getStatus();
    const logs = await container.stateRepository.getLogs(30);

    return NextResponse.json({
      status,
      logs,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to fetch status" }, { status: 500 });
  }
}
