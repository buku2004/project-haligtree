import React from 'react'
import FearGreedGauge from '@/components/ui/FearGreedGauge';

const fetchFG = async () => {
  try {
    const res = await fetch("https://api.alternative.me/fng/?limit=1", {
      next: { revalidate: 3600 },
    });

    if (!res.ok) 
      throw new Error("Failed to fetch Fear & Greed data");

    const data = await res.json();
    return data.data[0];

  } catch (error) {
    console.error("Error fetching Fear & Greed Index:", error);
    return null;
  }
}

const FearGreed = async () => {
  const fgData = await fetchFG();

  if (!fgData) return <div>Loading...</div>;

  return (
    <div className="bg-gray-200/40
    w-[18rem] h-[14rem] mr-auto rounded-lg shadow-md p-4 text-[#333] text-xl"
    >
      <h1 className='text-center font-bold'> Fear & Greed Index</h1>
      <FearGreedGauge
      value={fgData.value}
      label={fgData.value_classification}
      />
    </div>
  )
}

export default FearGreed;