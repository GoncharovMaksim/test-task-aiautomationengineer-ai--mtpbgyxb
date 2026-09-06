import { MetacriticCrawler } from "../../infrastructure/crawler/MetacriticCrawler";

describe("MetacriticCrawler", () => {
  let crawler: MetacriticCrawler;

  beforeEach(() => {
    crawler = new MetacriticCrawler();
  });

  it("parses html game links correctly", () => {
    const mockHtml = `
      <div>
        <a href="/game/astro-bot/"><h3>Astro Bot</h3></a>
        <a href="/game/black-myth-wukong/"><h3>Black Myth: Wukong</h3></a>
        <a href="/game/all/">Skip All</a>
      </div>
    `;

    const parsed = crawler.parseGameCards(mockHtml, "new-releases", 10);
    expect(parsed.length).toBe(2);
    expect(parsed[0].slug).toBe("astro-bot");
    expect(parsed[1].slug).toBe("black-myth-wukong");
    expect(parsed[0].source).toBe("new-releases");
  });

  it("returns fallback games when external network fails", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network offline"));

    const games = await crawler.fetchNewReleases(5);
    expect(games.length).toBe(5);
    expect(games[0].title).toBeDefined();
    expect(games[0].slug).toBeDefined();

    jest.restoreAllMocks();
  });

  it("fetches browse games for continuous page offsets", async () => {
    jest.spyOn(global, "fetch").mockRejectedValue(new Error("Network offline"));

    const page1 = await crawler.fetchBrowseAllNew(1, 4);
    const page2 = await crawler.fetchBrowseAllNew(2, 4);

    expect(page1.length).toBe(4);
    expect(page2.length).toBe(4);

    jest.restoreAllMocks();
  });
});
