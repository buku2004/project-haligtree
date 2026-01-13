"use client";
import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  CandlestickData,
} from "lightweight-charts";

interface Props{
    symbol: string;
    interval: string;
}

export default function CandleChart({ symbol, interval }: Props) {
  // hold a refernce to empty div as chart need a div to render on
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // check if div exists
    if (!chartContainerRef.current) return;

    const chart = createChart(chartContainerRef.current, {
      height: 400,
      width: 1000,
      layout: {
        background: { color: "#0f172a" },
        textColor: "#e5e7eb",
      },
    });

    // data layer for, like how charts look for stocks/crpyto
    const candleSeries = chart.addSeries(CandlestickSeries);

    fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/klines?symbol=${symbol}&interval=${interval}`
    )
      .then((res) => res.json())
      .then((data: CandlestickData[]) => {
        candleSeries.setData(data);
      });

    return () => chart.remove();
  }, [symbol, interval]);

  return (
    <div ref={chartContainerRef} className="m-4">
      BTCUSDT 1m Interval
    </div>
  )

}
