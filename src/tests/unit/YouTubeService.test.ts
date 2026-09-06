import { YouTubeService } from "../../infrastructure/youtube/YouTubeService";

describe("YouTubeService", () => {
  let service: YouTubeService;

  beforeEach(() => {
    service = new YouTubeService();
  });

  it("extracts let's play commentary and provides structured analysis", async () => {
    // Mock fetch for quick and deterministic test execution
    jest.spyOn(global, "fetch").mockImplementation(async () => {
      return {
        ok: true,
        json: async () => ({}),
        text: async () => `var ytInitialData = {"contents":{"twoColumnSearchResultsRenderer":{"primaryContents":{"sectionListRenderer":{"contents":[{"itemSectionRenderer":{"contents":[{"videoRenderer":{"videoId":"test12345","title":{"runs":[{"text":"Astro Bot - Full Gameplay Walkthrough"}]},"ownerText":{"runs":[{"text":"IGN Walkthroughs"}]},"viewCountText":{"simpleText":"520,000 views"}}}]}}]}}}}};</script>`,
      } as any;
    });

    const analysis = await service.searchAndAnalyzeLetsPlay("Astro Bot");

    expect(analysis).toBeDefined();
    expect(analysis.videoTitle).toContain("Astro Bot");
    expect(analysis.channelName).toBe("IGN Walkthroughs");
    expect(analysis.viewCount).toBe("520,000 views");
    expect(analysis.summary.length).toBeGreaterThan(15);
    expect(analysis.pros.length).toBeGreaterThanOrEqual(1);
    expect(analysis.cons.length).toBeGreaterThanOrEqual(1);
    expect(analysis.bloggerVerdict).toBeDefined();

    jest.restoreAllMocks();
  });
});
