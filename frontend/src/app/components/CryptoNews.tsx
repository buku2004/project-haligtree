"use client";
import React, { useEffect, useState } from "react";

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  thumb_2x: string;
  created_at: string;
  author: string;
}

// Define the type for CryptoCompare API response
interface CryptoCompareArticle {
  title: string;
  body: string;
  categories: string;
  url: string;
  imageurl: string;
  published_on: number;
  source: string;
  source_info?: {
    name: string;
  };
}

const CryptoNews = () => {
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        
        // CryptoCompare News API
        const APIkey = process.env.CRYPTOCOMPARE_API_KEY;
        
        const response = await fetch(
          'https://min-api.cryptocompare.com/data/v2/news/?lang=EN&sortOrder=latest&limit=16',
          {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'authorization': `Apikey ${APIkey}`
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();

        // Transform CryptoCompare data to match our interface
        if (data && data.Data && Array.isArray(data.Data)) {
          const transformedData: NewsArticle[] = data.Data.map((article: CryptoCompareArticle) => ({
            title: article.title,
            description: article.body || article.categories,
            url: article.url,
            thumb_2x: article.imageurl || "https://via.placeholder.com/300",
            created_at: new Date(article.published_on * 1000).toISOString(),
            author: article.source || article.source_info?.name || "CryptoCompare"
          }));
          
          setNews(transformedData);
          setLastUpdated(new Date());
        } else {
          throw new Error('Invalid data format received');
        }
      } catch (err) {
        console.error('Error fetching crypto news:', err);
        setError(err instanceof Error ? err.message : 'Failed to load crypto news');
      } finally {
        setLoading(false);
      }
    };

    // Fetch news immediately
    fetchNews();

    // Refresh news every 15 minutes
    const intervalId = setInterval(fetchNews, 15 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  if (error) {
    return (
      <div className="p-6 bg-gray-100 rounded-lg shadow-md w-full">
        <h1 className="text-2xl font-bold mb-4">Crypto News</h1>
        <div className="p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md w-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Crypto News</h1>
        {lastUpdated && (
          <span className="text-xs text-gray-500">
            Updated: {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>
      
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white p-4 rounded-lg">
              <div className="h-32 bg-gray-200 rounded mb-3"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-h-[800px] overflow-y-auto">
          {news.slice(0, 16).map((article, index) => (
            <div key={index} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col h-[400px]">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="block h-full">
                <div className="h-40 overflow-hidden rounded-t-lg">
                  <img 
                    src={article.thumb_2x} 
                    alt={article.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h2 className="font-semibold text-lg mb-2 text-blue-600 hover:text-blue-800 line-clamp-2">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 flex-grow line-clamp-3">
                    {article.description}
                  </p>
                  <div className="flex justify-between text-xs text-gray-500 mt-auto">
                    <span className="truncate mr-2">{article.author}</span>
                    <span>{new Date(article.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CryptoNews;