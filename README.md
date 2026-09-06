# Metacritic AI Pipeline & Analytics Service

## Live Demo
- Production URL: https://test-task-aiautomationengineer-mtpb.vercel.app
- Alternative Alias: https://test-task-aiautomationengineer-mtpbgyxb-a2rxwdplk-max112.vercel.app

## Overview

Automated data ingestion and AI analytics service for video game releases based on Metacritic. The system performs scheduled hourly crawling, parses game metadata and multi-platform review scores, derives distinct AI syntheses for critic and player sentiment, transcribes popular YouTube Let's Play commentary to produce gameplay verdicts, computes cross-game content similarities, and provides a real-time monitoring web dashboard with manual execution controls.

## Architecture

The project follows Clean Architecture principles with decoupled boundaries:

```
src/
├── domain/                      # Enterprise Business Rules & Entities
│   ├── entities/                # Game, PlatformScore, ReviewSummary, WorkerStatus, CrawlLog
│   └── repositories/            # IGameRepository, ICrawlStateRepository
├── application/                 # Application Business Rules
│   └── use-cases/               # CrawlMetacriticUseCase, GetGamesUseCase, FindSimilarGamesUseCase
├── infrastructure/              # Frameworks, Drivers & External Services
│   ├── crawler/                 # MetacriticCrawler (HTML scraping & fallback mirrors)
│   ├── ai/                      # AISummarizerService (Gemini API, Groq Llama-3, heuristic fallback)
│   ├── youtube/                 # YouTubeService (Walkthrough search, captions & commentary synthesis)
│   ├── similarity/              # GameSimilarityEngine (Jaccard + platform/developer/score proximity)
│   ├── repositories/            # SqliteOrJsonGameRepository, CrawlStateRepository
│   └── scheduler/               # CrawlScheduler (Hourly background cron loop)
└── presentation/                # UI & API Layer (Next.js 14 App Router, Tailwind CSS, SSE Stream)
```

### Crawl Lifecycle & Selection Algorithm
1. **Frequency**: Scheduled hourly (60-minute interval) via background worker and `/api/cron` endpoint.
2. **Game Selection**:
   - Initial run of each calendar day: Scrapes the first 20 games from `https://www.metacritic.com/game/` (New Releases).
   - Subsequent runs during the same day: Advances through consecutive pages from `https://www.metacritic.com/browse/game/all/all/all-time/new/?page=N`.
   - Day reset: When date changes, crawl cycles reset back to New Releases.
   - Deduplication: Keeps an in-memory & persisted registry of games processed on the current calendar day to prevent re-processing identical releases within 24 hours while updating score shifts.
3. **Data Extracted**:
   - Title, Slug, Canonical Metacritic URL
   - Cover Image
   - Platforms, Metascore, User Score (e.g. PS5, PC, Xbox Series X, Nintendo Switch)
   - Developer and Publisher
   - Release Date & Overview Description
   - Video / Official Trailer URL
4. **AI Review Summarization**:
   - Evaluates review excerpts independently across two distinct channels:
     - Critic Reviews: Structured consensus, praised elements (liked), critical complaints (disliked).
     - User Reviews: Structured consensus, player highlights (liked), player grievances (disliked).
5. **YouTube Let's Play Analysis**:
   - Searches top-viewed gameplay walkthroughs for the target game.
   - Extracts video metadata, view count, channel name, and transcript commentary.
   - Generates an AI summary of blogger feedback, pro/con observations, and an authoritative streamer verdict quote.
6. **Similarity Engine**:
   - Multi-factor scoring algorithm weighting genre Jaccard similarity (45%), developer match (25%), platform compatibility (15%), and Metascore proximity (15%).
   - Surfaces interactive cards for similar games with click-through navigation.
7. **Real-time Monitoring & Dashboard**:
   - Worker state indicator (`idle`, `fetching_metacritic`, `analyzing_reviews`, `updating_db`, `error`).
   - Key operational metrics: Total games in DB, games processed today, current pagination offset, next scheduled run time.
   - Real-time activity log stream (via Server-Sent Events / live polling).
   - Manual execution trigger allowing on-demand crawl runs.

## Tech Stack

- **Runtime**: Node.js 20+ / 22+
- **Language**: TypeScript 5.6 (strict mode)
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS (Minimalist neutral palette, Zinc/Slate, dark mode)
- **Icons**: Lucide React
- **Scraping**: Cheerio
- **Testing**: Jest 29, ts-jest
- **Containerization**: Docker, Docker Compose
- **Hosting / CI**: Vercel

## Environment Variables

Create a `.env` file in the root directory (see `.env.example`):

```env
# Optional: Google Gemini API key for live LLM review and let's play synthesis
GEMINI_API_KEY=

# Optional: Groq API key for Llama-3 inference
GROQ_API_KEY=

# Optional: OpenRouter API key
OPENROUTER_API_KEY=

PORT=3000
NODE_ENV=production
```

> Note: If API keys are omitted or rate-limited, the system automatically falls back to its deterministic NLP heuristic extraction pipeline, ensuring full testability and zero downtime offline.

## Running the Project

### Option A: Local Development (npm)

1. Install dependencies:
```bash
npm install
```

2. Run automated test suite:
```bash
npm test
```

3. Start development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

4. Production build:
```bash
npm run build
npm run start
```

### Option B: Docker Compose

Build and launch the containerized service:

```bash
docker compose up --build -d
```

Check container status and logs:
```bash
docker compose ps
docker compose logs -f metacritic-ai-service
```

Stop the container:
```bash
docker compose down
```

## API Reference

### 1. Games Directory
- `GET /api/games`
  - Parameters:
    - `platform` (string, optional): e.g. `PS5`, `PC`, `Xbox Series X`, `Nintendo Switch`
    - `search` (string, optional): case-insensitive substring search by game title or developer
    - `sortBy` (string, optional): `metascore` | `userscore` | `date` | `title` (default: `metascore`)
    - `sortOrder` (string, optional): `desc` | `asc` (default: `desc`)
    - `page` (number, optional, default: 1)
    - `limit` (number, optional, default: 50)
  - Example:
```bash
curl "http://localhost:3000/api/games?platform=PS5&sortBy=metascore&sortOrder=desc"
```

### 2. Game Details & Similar Games
- `GET /api/games/:id`
  - Retrieves full game entity including critic review summary, user review summary, YouTube let's play analysis, and 4 most similar games.
  - Example:
```bash
curl "http://localhost:3000/api/games/astro-bot"
```

### 3. Worker Status & Activity Stream
- `GET /api/crawler/status`
  - Returns current worker state, processed counts, and recent execution logs.
  - Example:
```bash
curl "http://localhost:3000/api/crawler/status"
```

- `GET /api/crawler/stream`
  - Server-Sent Events (SSE) endpoint emitting live JSON snapshots of worker state and logs every 2 seconds.

### 4. Manual Crawl Trigger
- `POST /api/crawler/trigger`
  - Manually initiates a crawl pass.
  - Request body (JSON, optional):
```json
{
  "source": "new-releases"
}
```
  - Example:
```bash
curl -X POST http://localhost:3000/api/crawler/trigger \
  -H "Content-Type: application/json" \
  -d '{"source": "new-releases"}'
```

### 5. Automated Cron Trigger
- `GET /api/cron`
  - Intended for Vercel Cron or external schedulers to trigger hourly ingestion.

## Automated Test Results

Jest test suite covers:
- Similarity scoring logic, Jaccard genre overlap, and candidate ranking (`GameSimilarityEngine.test.ts`).
- Review sentiment synthesis, pros/cons extraction, and fallback rules (`AISummarizerService.test.ts`).
- HTML parsing, slug filtering, and pagination handling (`MetacriticCrawler.test.ts`).
- YouTube let's play candidate selection and commentary synthesis (`YouTubeService.test.ts`).
- In-memory/JSON repository queries, multi-platform filters, text search, and upserting (`SqliteOrJsonGameRepository.test.ts`).
- Complete crawl use case execution, worker lifecycle state transitions, and daily page reset (`CrawlMetacriticUseCase.test.ts`).

Run all tests:
```bash
npm test
```
Result: 6 test suites passed, 17 tests passed (100% pass rate).
