import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/" 
      className="flex items-center gap-2.5 group transition-all duration-200 hover:opacity-80"
    >
      {/* Icon - clean solid design */}
      <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-sm">
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 32 32" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          className="text-primary-content"
        >
          {/* Outer circle */}
          <circle cx="16" cy="16" r="14" stroke="currentColor" strokeWidth="1.8" fill="none"/>
          {/* Checkmark */}
          <path 
            d="M10 16L14 20L22 12" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            fill="none"
          />
          {/* Coin dots */}
          <circle cx="22" cy="22" r="1.5" fill="currentColor"/>
          <circle cx="8" cy="22" r="1" fill="currentColor" opacity="0.6"/>
          <circle cx="24" cy="10" r="1" fill="currentColor" opacity="0.4"/>
        </svg>
      </div>
      
      {/* Text Section */}
      <div className="flex flex-col">
        <span className="text-lg font-bold text-base-content tracking-tight">
          TaskEarn
        </span>
        <span className="text-[9px] font-medium text-base-content/40 -mt-0.5">
          Micro-Task Platform
        </span>
      </div>
    </Link>
  );
};

export default Logo;