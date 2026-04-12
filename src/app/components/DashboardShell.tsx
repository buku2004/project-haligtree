"use client";

import { useState } from "react";
import Alignment from "./Alignment";
import Navbar from "./Navbar";

export type Currency = "USD" | "INR";

export default function DashboardShell() {
  const [currency, setCurrency] = useState<Currency>("USD");

  const handleToggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "INR" : "USD"));
  };

  return (
    <>
      <Navbar currency={currency} onToggleCurrency={handleToggleCurrency} />
      <Alignment currency={currency} />
    </>
  );
}
