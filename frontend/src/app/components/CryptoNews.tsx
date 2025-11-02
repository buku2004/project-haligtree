"use client";
import React, { useEffect, useState } from "react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishedDate: string;
  source: string;
}

interface ApiNewsItem {
  title: string;
  body: string;
  categories: string;
  url: string;
  imageurl: string;
  published_on: number;
  source: string;
  source_info?: { name: string };
}

const CryptoNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const APIkey = process.env.CRYPTOCOMPARE_API_KEY;

        const response = await fetch(
          "https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&limit=16",
          {
            headers: {
              Accept: "application/json",
              authorization: `Apikey ${APIkey}`,
            },
          }
        );

        if (!response.ok) throw new Error(`Error: ${response.status}`);

        const data = await response.json();

        if (data?.Data?.length) {
          const articles = data.Data.map((item: ApiNewsItem) => ({
            title: item.title,
            description: item.body || item.categories,
            url: item.url,
            imageUrl: item.imageurl || "https://via.placeholder.com/300",
            publishedDate: new Date(item.published_on * 1000).toLocaleDateString(),
            source: item.source || item.source_info?.name || "Unknown",
          }));

          setNews(articles);
          setLastUpdated(new Date().toLocaleTimeString());
        }
      } catch (err) {
        console.error("Error fetching news:", err);
        setError("Failed to load crypto news");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
    const refreshInterval = setInterval(fetchNews, 15 * 60 * 1000);
    return () => clearInterval(refreshInterval);
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-gray-100 rounded-lg w-full">
        <h1 className="text-xl font-bold mb-2">Crypto News</h1>
        <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-200/40 p-4 rounded-xl shadow-md mx-auto mb-8">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 gap-1 sm:gap-0">
        <h1 className="text-lg sm:text-xl font-bold text-[#333] text-center sm:text-left">
          Latest Crypto News
        </h1>
        {lastUpdated && (
          <span className="text-xs text-gray-700 text-center sm:text-right">
            Updated: {lastUpdated}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded-lg">
              <div className="h-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {news.slice(0, 8).map((article, index) => (
            <a
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/60 rounded-lg shadow hover:shadow-lg transition-transform hover:scale-[1.02] flex flex-col overflow-hidden"
            >
              <div className="h-48 sm:h-40 bg-gray-100">
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3 flex flex-col flex-grow">
                <h2 className="font-semibold text-black/80 hover:text-blue-600 line-clamp-2 text-sm sm:text-base mb-2">
                  {article.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-600 line-clamp-3 mb-2 flex-grow">
                  {article.description}
                </p>
                <div className="flex justify-between text-[10px] sm:text-xs text-gray-500 mt-auto">
                  <span className="truncate max-w-[50%]">{article.source}</span>
                  <span>{article.publishedDate}</span>
                </div>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoNews;
