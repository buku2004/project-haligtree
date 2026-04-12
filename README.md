# CryptoBoard

A Next.js crypto dashboard that combines real-time market streaming with API-driven widgets.

Backend repository:
- https://github.com/buku2004/haligtree-backend

The app focuses on:
- live popular coin prices via WebSocket
- top gainers and losers
- market dominance and global stats
- crypto news
- USD and INR display toggle in the sidebar

## Tech Stack

- Next.js (App Router)
- React + TypeScript
- Tailwind CSS
- Lucide icons

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open http://localhost:3000

## Environment And Services

This frontend relies on a separate Express backend repository for all market data.

This repo does not include the backend server implementation.

The frontend expects two backend data channels:

1. REST API base URL:
- env variable: `NEXT_PUBLIC_API_BASE_URL`
- used by widgets like gainers/losers, news, and other API-driven cards
- expected routes on backend:
	- `/api/losers-gainers`
	- `/api/market-dominance`
	- `/api/klines?symbol=BTCUSDT&interval=1m&limit=500`
	- `/api/crypto-news`

2. WebSocket stream from the same backend service:
- default URL placeholder: `ws://localhost`
- used in `Crypto` component
- supports USD and INR values from stream payload
- payload contains coin entries like:
	- `symbol`
	- `price` / `priceUsd`
	- `priceInr`
	- `volume`
	- `priceChangePercent`
	- `timestamp`

Important: start your Express backend repo first, then run this frontend.

## Backend Setup (Required)

In your backend repo (haligtree-backend):

1. Create environment variables:
- `PORT`
- `CRYPTOCOMPARE_API_KEY` (required for `/api/crypto-news`)
- `USD_INR_FALLBACK_RATE` (optional, used if exchange rate fetch fails)

2. Start backend first (from backend repo), then start this frontend.

3. Set frontend env in this repo:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost
```

## Project Structure (Brief)

- `src/app/page.tsx`: entry page, mounts dashboard shell + footer
- `src/app/components/DashboardShell.tsx`: shared client state, flips currency between USD and INR
- `src/app/components/Navbar.tsx`: sidebar navigation; Currency button triggers the USD/INR toggle
- `src/app/components/Alignment.tsx`: main dashboard layout grid
- `src/app/components/Crypto.tsx`: live coin cards from WebSocket, renders INR using `priceInr` (also supports `inrPrice` and `price_inr`) with USD fallback
- `src/app/components/GainerLoser.tsx`: top movers list from API
- `src/app/components/MarketDominance.tsx`: market dominance widget
- `src/app/components/CryptoNews.tsx`: news section
- `src/app/charts/`: chart page and chart components

## Notes

- The project uses both server and client components.
- If the backend WebSocket stream is unavailable, the price panel keeps retrying connection.
- If API endpoints fail, widgets show loading/error-safe fallback UI.
