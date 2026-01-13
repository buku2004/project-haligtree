import React from 'react'
import CandleChart from './Charts'

const page = () => {
  return (
    <>
    <CandleChart symbol='BTCUSDT' interval="1m"/>
    </>
  )
}

export default page