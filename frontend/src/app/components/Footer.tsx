import React from 'react';

const Footer = () => {
  return (
    <footer 
    className="
    bg-gray-100 mx-auto h-[8rem] flex flex-col 
    justify-center items-center shadow-md px-4 w-[90%] mb-8 rounded-md
    "
    >
      <p className="text-sm mt-1 cursor-default">Your gateway to real-time crypto insights</p>
      <div className="flex gap-4 mt-2 text-sm">
        <a href="#about" className="hover:underline">About</a>
        <a href="#contact" className="hover:underline">Contact</a>
        <a href="#terms" className="hover:underline">Terms</a>
      </div>
      <p className="text-xs mt-2 opacity-80 cursor-default">&copy; {new Date().getFullYear()} CryptoBoard. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
