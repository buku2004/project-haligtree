// import { NextResponse } from "next/server";

// export async function GET() {
//   try {
//     const res = await fetch("https://api.coingecko.com/api/v3/global", {
//       next: { revalidate: 60 },
//     });

//     if (!res.ok) throw new Error("Failed to fetch data");

//     const data = await res.json();

//     const dominance = data.data.market_cap_percentage;
//     const globalStats = {
//       btc: dominance.btc,
//       eth: dominance.eth,
//       usdt: dominance.usdt,
//       others: 100 - (dominance.btc + dominance.eth + dominance.usdt),
//       totalMarketCap: data.data.total_market_cap.usd,
//       volume24h: data.data.total_volume.usd,
//       activeCrypto: data.data.active_cryptocurrencies,
//     };

//     return NextResponse.json(globalStats);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Error fetching dominance data" }, { status: 500 });
//   }
// }
