"use client";

import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface CoinVolumeHoverProps {
  volume?: number;
  children: React.ReactNode;
}

const CoinVolumeHover = ({ volume, children }: CoinVolumeHoverProps) => {
  const formattedVolume =
    typeof volume === "number"
      ? volume.toLocaleString(undefined, { maximumFractionDigits: 0 })
      : "N/A";

  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent side="top" sideOffset={8}>
        <p>Volume: {formattedVolume}</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default CoinVolumeHover;
