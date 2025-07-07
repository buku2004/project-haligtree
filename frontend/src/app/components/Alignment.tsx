import React from 'react'
import CryptoNews from "./CryptoNews";
import Crypto from './Crypto'
import FearGreed from './FearGreed';
import Stats from './Stats';
import Box1 from './Box1';
import Box2 from './Box2';

const Alignment = () => {
  return (
    <div className='inline-flex flex-col'>
      <Stats/>
        <div className='my-8 gap-8 flex mx-auto'>
          <Crypto/>
          <div className='flex flex-col gap-8'>
            <FearGreed/>
            <Box1/>
            <Box2/>
          </div>
        </div>
        <CryptoNews/>
    </div>
  )
}

export default Alignment