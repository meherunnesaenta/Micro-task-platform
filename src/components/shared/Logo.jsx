import React from 'react';
import { Link } from 'react-router-dom';

const Logo = () => {
  return (
    <Link
      to="/" 
      className="flex items-center gap-3 group"
    >
      {/* Animated Icon Container */}
      <div className="relative">
        {/* Rotating ring background */}
        <div className="absolute -inset-1 bg-primary/20 rounded-2xl animate-spin-slow"></div>
        
        {/* Main icon - Modern shape */}
        <div className="relative w-10 h-10 bg-primary rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 overflow-hidden">
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
          
          {/* Double border animation */}
          <div className="absolute inset-1 rounded-xl border border-white/30 group-hover:border-white/50 transition-all duration-300"></div>
          
          {/* Custom Icon - Modern letter T with coin */}
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 32 32" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="text-white relative z-10 group-hover:scale-110 transition-transform duration-300"
          >
            {/* Letter T */}
            <path 
              d="M8 8H24M16 8V22" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round"
              fill="none"
            />
            {/* Coin circle bottom right */}
            <circle cx="22" cy="22" r="4" stroke="currentColor" strokeWidth="1.8" fill="none"/>
            {/* Dollar sign in coin */}
            <path d="M21 20.5L23 20.5M23 23.5L21 23.5M22 19.5V20M22 24V24.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </div>
        
        {/* Floating dot decoration */}
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-bounce-subtle"></div>
        <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-accent rounded-full animate-pulse"></div>
      </div>
      
      {/* Text Section - Dynamic */}
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          {/* Main brand name with underline animation */}
          <span className="text-xl font-black tracking-tight text-base-content relative group-hover:text-primary transition-colors duration-300">
            TaskEarn
            <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-500 rounded-full"></span>
          </span>
          
          {/* Animated badge */}
          <div className="relative">
            <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full bg-secondary/20 text-secondary inline-block animate-pulse-ring">
              HOT
            </span>
          </div>
        </div>
        
        {/* Tagline with typewriter effect on hover */}
        <div className="flex items-center gap-1 overflow-hidden">
          <span className="text-[9px] font-medium text-base-content/40 tracking-wide group-hover:text-primary/60 transition-colors duration-300">
            Earn • Task • Repeat
          </span>
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" className="group-hover:translate-x-0.5 transition-transform duration-300 text-primary/40">
            <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </Link>
  );
};

export default Logo;