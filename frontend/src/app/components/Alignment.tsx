import React from "react";
import CryptoNews from "./CryptoNews";
import Crypto from "./Crypto";
import GainerLoser from "./GainerLoser";
import MarketDominance from "./MarketDominance";

const Alignment = () => {
  return (
    <div className="flex flex-col items-center w-full">
      <div className="w-[80%] mx-auto my-8 space-y-8">

        <div
          className="
            grid gap-8
            md:grid-cols-1   /* single column on medium */
            lg:grid-cols-[2fr_1fr] /* two columns on large */
            
          "
        >
          <Crypto />
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
            <GainerLoser />
            <MarketDominance />
          </div>
        </div>
        <CryptoNews />
      </div>
    </div>
  );
};

export default Alignment;
