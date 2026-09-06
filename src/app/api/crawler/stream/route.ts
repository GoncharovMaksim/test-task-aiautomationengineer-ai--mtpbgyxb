import { NextRequest } from "next/server";
import { container } from "@/infrastructure/container";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const encoder = new TextEncoder();

  const customStream = new ReadableStream({
    async start(controller) {
      const sendUpdate = async () => {
        try {
          const status = await container.stateRepository.getStatus();
          const logs = await container.stateRepository.getLogs(20);
          const data = JSON.stringify({ status, logs });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
        } catch {
          // ignore stream error
        }
      };

      await sendUpdate();
      const interval = setInterval(sendUpdate, 2000);

      req.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(customStream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}
