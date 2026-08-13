import React from 'react';
import { Globe, Terminal, MapPin, Calendar } from 'lucide-react';

export default function Header({ onOpenInfo }) {
  return (
    <header className="border-b border-[#FFE500]/20 bg-[#026735] sticky top-0 z-50">


      {/* Top Banner Ticker — Infinite Seamless Loop */}
      <div className="bg-[#FFE500] text-[#015E39] font-mono-tech text-xs py-1.5 overflow-hidden font-bold flex select-none">
        <div className="flex animate-marquee">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-8 shrink-0 pr-8">
              <span className="flex items-center gap-1 text-[#FF007F] font-black"><MapPin className="w-3.5 h-3.5" /> GOA, INDIA</span>

              <span>•</span>
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 28 – 31 OCT 2026</span>
              <span>•</span>
              <span className="text-[#FF007F] font-black">LESS NOISE. MORE SIGNAL.</span>
              <span>•</span>
              <span>500 ELITE BUILDERS</span>
              <span>•</span>
              <span className="text-[#FF007F] font-black">#FrameInGoa</span>

              <span>•</span>
              <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> 2:47 PM STUDIO</span>
              <span>•</span>
            </div>
          ))}
        </div>
      </div>



      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-2 sm:px-6 lg:px-8 py-2 sm:py-3.5 flex items-center justify-between gap-1">
        {/* Left: Studio Brand Logo Image */}
        <div className="flex items-center shrink-0">
          <img
            src="/images/studio-logo-header.png"
            alt="2:47PM Studio Logo"
            className="h-6 sm:h-9 md:h-10 w-auto object-contain"
          />
        </div>

        {/* Center: Brand Title Image */}
        <div className="flex items-center justify-center min-w-0">
          <img
            src="/images/hh-logo-header.png"
            alt="Hacker House Goa Logo"
            className="h-6 sm:h-10 md:h-12 w-auto object-contain max-w-[140px] sm:max-w-none"
          />
        </div>

        {/* Right: Apply Devfolio Link */}
        <div className="flex items-center shrink-0">
          <a
            href="https://hacker-house-goa-2026.devfolio.co/overview"
            target="_blank"
            rel="noreferrer"
            className="inline-block transition hover:scale-105 active:scale-95"
            title="Apply for Hacker House Goa 2026"
          >
            <img
              src="/images/apply-button-header.png"
              alt="Apply for Hacker House Goa 2026"
              className="h-6 sm:h-8 md:h-9 w-auto object-contain"
            />
          </a>
        </div>
      </div>
    </header>
  );
}

