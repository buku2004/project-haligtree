import React from 'react'
import CryptoNews from "./CryptoNews";
import Crypto from './Crypto'
// import FearGreed from './FearGreed';
import Stats from './Stats';
import GainerLoser from './GainerLoser';
import MarketDominance from './MarketDominance';

const Alignment = () => {
  return (
    <div className='inline-flex flex-col'>
      <Stats/>
        <div className='my-8 gap-8 flex mx-auto'>
          <Crypto/>
          <div className='flex flex-col gap-8'>
            {/* <FearGreed/> */}
            <GainerLoser/>
            <MarketDominance/>
          </div>
        </div>
        <CryptoNews/>
    </div>
  )
}

export default Alignment