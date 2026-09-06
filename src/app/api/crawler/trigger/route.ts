import { NextRequest, NextResponse } from "next/server";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const status = await container.stateRepository.getStatus();
    if (status.state !== "idle" && status.state !== "completed" && status.state !== "error") {
      return NextResponse.json(
        {
          success: false,
          message: "A crawl job is currently already active.",
          status,
        },
        { status: 409 }
      );
    }

    let forceSource: "new-releases" | "browse-all-new" | undefined;
    try {
      const body = await req.json();
      if (body.source === "new-releases" || body.source === "browse-all-new") {
        forceSource = body.source;
      }
    } catch {
      // Empty body is okay
    }

    // Run execution asynchronously or await it
    // To give instantaneous feedback, we start the execution
    const crawlPromise = container.crawlMetacriticUseCase.execute(forceSource);

    // Wait a brief tick to let initial logs emit
    await new Promise((r) => setTimeout(r, 600));

    return NextResponse.json({
      success: true,
      message: "Crawl pipeline triggered successfully.",
      status: await container.stateRepository.getStatus(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to trigger crawl" }, { status: 500 });
  }
}
