import { AISummarizerService } from "../../infrastructure/ai/AISummarizerService";
import { RawReview } from "../../domain/entities/Game";

describe("AISummarizerService", () => {
  let service: AISummarizerService;

  beforeEach(() => {
    service = new AISummarizerService();
  });

  const mockCriticReviews: RawReview[] = [
    {
      id: "c1",
      author: "IGN",
      score: 95,
      date: "2024-09-01",
      content: "Amazing visual fidelity and superb combat feel that rewards precision.",
      type: "critic",
    },
    {
      id: "c2",
      author: "GameSpot",
      score: 60,
      date: "2024-09-02",
      content: "Repetitive pacing and noticeable bugs hinder the later chapters.",
      type: "critic",
    },
  ];

  it("extracts liked and disliked points from reviews", async () => {
    const summary = await service.summarizeReviews("Test Game", mockCriticReviews, "critic");

    expect(summary).toBeDefined();
    expect(summary.liked.length).toBeGreaterThanOrEqual(1);
    expect(summary.disliked.length).toBeGreaterThanOrEqual(1);
    expect(summary.consensus).toContain("Test Game");
    expect(summary.sampleCount).toBe(2);
  });

  it("provides graceful fallback when review list is empty", async () => {
    const summary = await service.summarizeReviews("Empty Review Game", [], "user");

    expect(summary).toBeDefined();
    expect(summary.liked.length).toBeGreaterThan(0);
    expect(summary.disliked.length).toBeGreaterThan(0);
    expect(summary.sampleCount).toBe(0);
  });
});
