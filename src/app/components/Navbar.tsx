"use client"
import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Home, Wallet,DollarSign, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type NavItem = {
  icon: React.ElementType;
  label: string;
  href: string;
};


export default function Navbar() {
  const [collapsed, setCollapsed] = useState(true);
  // const [animate, setAnimate] = useState(true);

  const navItems: NavItem[] = [
    { icon: Home, label: "Dashboard", href: "/" },
    { icon: Wallet, label: "Wallet", href: "/charts" },
    { icon: DollarSign, label: "Currency", href: "/" },
    { icon: Settings, label: "Settings", href: "/" }
  ];

  // const handleClick = () => {
  //   setAnimate(false);
  //   setTimeout(() => {
  //       setAnimate(true);
  //   }, 10);
  // }  

  return (
    <div className="overflow-hidden h-screen relative z-[9999] hidden md:inline">
      {/* Sidebar */}
      <div
        className={cn(
          "bg-slate-200/20 border-1 flex flex-col transition-all duration-300 ease-in-out fixed left-0 top-0 bottom-0 shadow-md backdrop-blur-sm",
          collapsed ? "w-[4rem]" : "w-[13rem]"
        )}
      >
        {/* Header */}
        <div 
        // onClick={handleClick}
        className={cn(
          "flex items-center h-14 px-4 border-b transition-all duration-300 ease-in-out",
          collapsed ? "justify-center" : "justify-between",
          // animate ? 'animate__animated animate__wobble' : ''
        )}>
          {!collapsed && (
            <h2 className="font-bold text-xl text-primary transition-opacity duration-200">
              CryptoBoard
            </h2>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 cursor-pointer"
            onClick={() => setCollapsed(!collapsed)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </Button>
        </div>

        {/* Navigation */}
        <div className="flex-1 py-4 ">
          <nav className="px-2 space-y-1 ">
            <TooltipProvider >
              {navItems.map((item, index) => (
                <Tooltip key={index}>
                  <TooltipTrigger asChild>
                    <Link href={item.href} className='block'>
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex transition-all duration-200 ease-in-out cursor-pointer hover:bg-blue-200/20",
                        collapsed ? "justify-center px-2" : "justify-start px-3"
                      )}
                    >
                      <item.icon className={cn("h-5 w-5", collapsed ? "" : "mr-3")} />
                      <span className={cn(
                        "transition-opacity duration-200",
                        collapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100"
                      )}>
                        {item.label}
                      </span>
                    </Button>
                    </Link>
                  </TooltipTrigger>
                  {collapsed && (
                    <TooltipContent side="right">
                      {item.label}
                    </TooltipContent>
                  )}
                </Tooltip>
              ))}
            </TooltipProvider>
          </nav>
        </div>
      </div>
    </div>
  );
}