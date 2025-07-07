"use client"
import React, { useState, useEffect } from 'react';

const FearGreedMeter = () => {
  const [indexData, setIndexData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.alternative.me/fng/?limit=1&format=json');
        const data = await response.json();
        setIndexData(data.data[0]);
      } catch (err) {
        // Fallback demo data
        setIndexData({
          value: '72',
          value_classification: 'Greed'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getClassificationColor = (classification) => {
    const colors = {
      'Extreme Fear': 'text-red-500',
      'Fear': 'text-orange-500',
      'Neutral': 'text-yellow-500',
      'Greed': 'text-green-400',
      'Extreme Greed': 'text-green-600'
    };
    return colors[classification] || 'text-gray-400';
  };

  if (loading) {
    return (
      <div className="bg-gray-100 rounded-xl p-6 border border-gray-100 w-80">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-100 rounded w-3/4 mb-4 mx-auto"></div>``
        </div>
      </div>
    );
  }

  const value = parseInt(indexData?.value || '50');
  const classification = indexData?.value_classification || 'Neutral';
  const angle = (value / 100) * 180 - 90;

  return (
    <div className="bg-gradient-to-r from-blue-600 to-violet-600
    w-[18rem] h-[14rem] mr-auto rounded-lg">
      <h3 className="text-lg font-bold text-center m-2 p-2 text-white"> 
        Fear & Greed Index
      </h3>
      
      <div className="relative w-64 h-32 mx-auto">
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#dc2626" />
              <stop offset="25%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#eab308" />
              <stop offset="75%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
          </defs>
          
          {/* Background arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="#374151"
            strokeWidth="8"
            className="opacity-30"
          />
          
          {/* Colored arc */}
          <path
            d="M 20 80 A 80 80 0 0 1 180 80"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Needle */}
          <g transform={`rotate(${angle} 100 80)`}>
            <line
              x1="100"
              y1="80"
              x2="100"
              y2="30"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <circle
              cx="100"
              cy="80"
              r="6"
              fill="#ffffff"
            />
          </g>
          
          {/* Scale markers */}
          {[0, 25, 50, 75, 100].map((val, idx) => {
            const markerAngle = (val / 100) * 180 - 90;
            const x1 = 100 + 65 * Math.cos((markerAngle * Math.PI) / 180);
            const y1 = 80 + 65 * Math.sin((markerAngle * Math.PI) / 180);
            const x2 = 100 + 75 * Math.cos((markerAngle * Math.PI) / 180);
            const y2 = 80 + 75 * Math.sin((markerAngle * Math.PI) / 180);
            
            return (
              <line
                key={idx}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#6b7280"
                strokeWidth="2"
              />
            );
          })}
        </svg>
        
        {/* Center display */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-3xl font-bold text-white">{value}</div>
          <div className={`text-sm font-medium ${getClassificationColor(classification)}`}>
            {classification}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FearGreedMeter;