import React from 'react'
import CryptoNews from "./CryptoNews";
import Crypto from './Crypto'
import FearGreed from './FearGreed';

const Alignment = () => {
  return (
    <div>
        <div className='m-8 flex gap-8'>
          <Crypto/>
          <FearGreed/>
        </div>
        <CryptoNews/>
    </div>
  )
}

export default Alignment