import React from 'react'

const convertNum = (num: number): string => {
  if (num >= 1_000_000_000_000) {
    return (num / 1_000_000_000_000).toFixed(2) + "T";
  }else if(num >= 1_000_000_000){
    return (num / 1_000_000_000).toFixed(2) + "B";
  } else if (num >= 1_000_000) {
    return (num / 1_000_000).toFixed(2) + "M";
  } else if (num >= 1_000) {
    return (num / 1_000).toFixed(2) + "K";
  } else {
    return num.toString();
  }
}

interface GlobalData {
  active_cryptocurrencies: number;
  total_market_cap: { usd: number };
  total_volume: { usd: number };
  market_cap_percentage: { btc: number; eth: number };
}

const fetchGlobalData = async (): Promise<GlobalData | null>  => {
  try{
    const res = await fetch("https://api.coingecko.com/api/v3/global", {
      next: {revalidate: 60},
    })
    if (!res.ok) 
      throw new Error("failed to fetch data");

    const data = await res.json();
    return data.data;

  }catch(error){
    console.error("Error fetching global stats...",error);
    return null;
  }
}

const Stats = async () => {
  const stats = await fetchGlobalData();
  if(!stats) <p>failed to load data...</p>;

  const marketCap = convertNum(stats!.total_market_cap.usd);
  const volume24h = convertNum(stats!.total_volume.usd);
  const btcDom = stats!.market_cap_percentage.btc.toFixed(2);
  const ethDom = stats!.market_cap_percentage.eth.toFixed(2);
  return (
    <div className='
    mx-auto h-[4rem] flex flex-col bg-gray-200/40
    justify-center items-center shadow-md px-4 w-[90%] mt-4 rounded-md'
    >
    <div className='flex gap-8 text-[#333]'>
      <p className='border-1 border-blue-600/50 rounded-3xl text-center bg-white px-4 py-2 shadow-md'>{stats!.active_cryptocurrencies} cryptos</p>
      <p className='border-1 border-blue-600/50 rounded-3xl text-center bg-white px-4 py-2 shadow-md'>Market Cap: ${marketCap}</p>
      <p className='border-1 border-blue-600/50 rounded-3xl text-center bg-white px-4 py-2 shadow-md'>24h Volume: ${volume24h}</p>
      <p className='border-1 border-blue-600/50 rounded-3xl text-center bg-white px-4 py-2 shadow-md'>Dominance: BTC-{btcDom}% | ETH-{ethDom}%</p>
    </div>

    </div>
  )
}

export default Stats