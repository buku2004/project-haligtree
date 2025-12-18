import { NextResponse } from "next/server";

interface CoinAPIResponse {
  id: string;
  name: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
}

export async function GET() {
  try {
    const res = await fetch(
      "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false",
      {
        next: { revalidate: 3600 },
      }
    );

    if (!res.ok) throw new Error("Failed to fetch data");

    const data: CoinAPIResponse[] = await res.json();

    const stats = data.map((coin) => ({
      id: coin.id,
      name: coin.name,
      image: coin.image,
      current_price: coin.current_price,
      price_change_percentage_24h: coin.price_change_percentage_24h,
    }));

    return NextResponse.json(stats);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error fetching top movers" },
      { status: 500 }
    );
  }
}
