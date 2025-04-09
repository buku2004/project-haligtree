import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#710193] text-white h-[8rem] flex flex-col justify-center items-center shadow-md px-4">
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
