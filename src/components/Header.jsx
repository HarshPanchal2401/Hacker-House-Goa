import React from 'react';
import { Sparkles, Terminal, MapPin, Calendar, HelpCircle } from 'lucide-react';

export default function Header({ onOpenInfo }) {
  return (
    <header className="border-b border-[#FFE500]/20 bg-[#004227]/80 backdrop-blur-md sticky top-0 z-50">
      {/* Top Banner Ticker */}
      <div className="bg-[#FFE500] text-[#015E39] font-mono-tech text-xs py-1 px-4 overflow-hidden font-bold flex items-center">
        <div className="animate-marquee flex items-center space-x-8">
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> GOA, INDIA</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 28 – 31 OCT 2026</span>
          <span>•</span>
          <span className="text-[#FF007F] font-black">LESS NOISE. MORE SIGNAL.</span>
          <span>•</span>
          <span>500 ELITE BUILDERS</span>
          <span>•</span>
          <span>HASHTAG #FrameInGoa</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Terminal className="w-3.5 h-3.5" /> 2:47 PM STUDIO</span>
          <span>•</span>
          {/* Loop repeat */}
          <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> GOA, INDIA</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> 28 – 31 OCT 2026</span>
          <span>•</span>
          <span className="text-[#FF007F] font-black">LESS NOISE. MORE SIGNAL.</span>
          <span>•</span>
          <span>500 ELITE BUILDERS</span>
          <span>•</span>
          <span>HASHTAG #FrameInGoa</span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Left: Studio Brand */}
        <div className="flex items-center space-x-3">
          <div className="bg-[#FFE500] text-[#015E39] px-2.5 py-1 rounded font-mono-tech text-xs font-black border border-[#015E39]">
            2:47<span className="text-[#FF007F]">PM</span> STUDIO
          </div>
          <div className="hidden sm:flex items-center text-xs font-mono-tech text-[#FFE500]/90">
            HH GOA 2026
          </div>
        </div>

        {/* Center: Brand Title */}
        <div className="flex items-center space-x-2">
          <h1 className="font-serif-display text-lg sm:text-2xl text-[#FFE500] uppercase font-black tracking-wide">
            HH GOA <span className="text-white text-sm sm:text-base font-sans font-semibold">2026</span>
          </h1>
          <span className="font-hindi text-xs sm:text-sm bg-[#FF007F] text-white px-2 py-0.5 rounded shadow-sm border border-[#FFE500]">
            गोवा
          </span>
        </div>

        {/* Right: Info & Link */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onOpenInfo}
            className="flex items-center space-x-1 text-xs font-mono-tech bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/15 transition"
            title="Task Details"
          >
            <HelpCircle className="w-3.5 h-3.5 text-[#FFE500]" />
            <span className="hidden sm:inline">GUIDE</span>
          </button>
          <a
            href="https://hhgoa.com/"
            target="_blank"
            rel="noreferrer"
            className="flex items-center space-x-1 text-xs font-mono-tech bg-[#FFE500] text-[#015E39] hover:bg-[#FFE500]/90 px-3.5 py-1.5 rounded-lg font-bold shadow transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HHGOA.COM</span>
          </a>
        </div>
      </div>
    </header>
  );
}
