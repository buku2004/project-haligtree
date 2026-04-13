"use client";
import { useEffect, useRef } from "react";
import {
  createChart,
  CandlestickSeries,
  CandlestickData,
} from "lightweight-charts";

interface Props {
  symbol: string;
  interval: string;
  title?: string;
}

export default function CandleChart({ symbol, interval, title }: Props) {
  const chartContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const apiBaseUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

    const chart = createChart(container, {
      height: 320,
      width: container.clientWidth,
      layout: {
        background: { color: "#0f172a" },
        textColor: "#e5e7eb",
      },
      grid: {
        vertLines: { color: "#1f2937" },
        horzLines: { color: "#1f2937" },
      },
      rightPriceScale: {
        borderColor: "#374151",
      },
      timeScale: {
        borderColor: "#374151",
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries);

    fetch(
      `${apiBaseUrl}/api/klines?symbol=${symbol}&interval=${interval}&limit=500`
    )
      .then((res) => res.json())
      .then((data: CandlestickData[]) => {
        candleSeries.setData(data);
        chart.timeScale().fitContent();
      });

    const resizeObserver = new ResizeObserver(() => {
      chart.applyOptions({
        width: container.clientWidth,
      });
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
    };
  }, [symbol, interval]);

  return (
    <div className="rounded-xl border border-slate-700/60 bg-slate-900/80 p-4 shadow-lg">
      <div className="mb-3 text-sm font-semibold tracking-wide text-slate-200">
        {title || symbol} ({interval})
      </div>
      <div ref={chartContainerRef} className="w-full" />
    </div>
  );
}
