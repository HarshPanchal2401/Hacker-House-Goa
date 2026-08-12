import React from 'react';
import { User, Briefcase, Users, Anchor } from 'lucide-react';

/**
 * HackerGoaCard - Official Hacker Goa House Event ID-Card Component
 * 
 * Reusable data-driven DOM component using the template background image.
 * Accepts `data` object: { name, role, team, photo }
 */
export default function HackerGoaCard({
  data = {
    name: 'HARSH PANCHAL',
    role: 'AI/ML ENGINEER',
    team: 'CODE SAILOR',
    photo: '/images/profile.jpg'
  },
  zoom = 1.0,
  panX = 0,
  panY = 0,
  className = ''
}) {
  const name = data?.name || 'HARSH PANCHAL';
  const role = data?.role || 'AI/ML ENGINEER';
  const team = data?.team || 'CODE SAILOR';
  const photo = data?.photo || '/images/profile.jpg';

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Main Event ID Badge Body with Template Background Image */}
      <div className="goa-card-container relative w-full max-w-[520px] aspect-[0.66] bg-[url('/images/idcard_template.jpg')] bg-cover bg-center text-white rounded-[36px] shadow-2xl overflow-hidden flex flex-col justify-between p-4 sm:p-5">
        
        {/* Transparent Header Space (Gives room for pre-printed header + date line) */}
        <div className="h-[160px] sm:h-[190px] w-full" />

        {/* --- PROFILE PHOTO SECTION --- */}
        <div className="relative z-10 flex justify-center mb-0 mt-1">
          <div className="relative w-[215px] sm:w-[245px] h-[175px] sm:h-[195px] rounded-[24px] border-[5px] border-[#ed1765] shadow-xl overflow-hidden bg-[#003c2d]">
            {photo ? (
              <img
                src={photo}
                alt={name}
                className="w-full h-full object-cover transition-transform duration-200"
                style={{
                  transform: `scale(${zoom}) translate(${panX}px, ${panY}px)`
                }}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-[#f7c515] font-mono text-xs font-bold p-4 text-center">
                <User className="w-12 h-12 mb-2 text-[#ed1765]" />
                <span>ATTENDEE PHOTO</span>
              </div>
            )}
          </div>
        </div>

        {/* --- INFORMATION PANEL (CREAM CONTAINER) --- */}
        <div className="relative z-10 bg-[#f5ead5] text-[#004d3a] rounded-[24px] p-3.5 sm:p-4 shadow-xl border border-[#e6d5b8] my-1.5 max-w-[410px] mx-auto w-full">
          <div className="grid grid-cols-12 gap-2 items-center">
            
            {/* Left 3 Data Rows */}
            <div className="col-span-8 space-y-1.5">
              
              {/* Row 1: NAME */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#ed1765] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <User className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[11px] font-mono font-extrabold tracking-wider text-[#004d3a] uppercase leading-none mb-0.5">
                    NAME
                  </p>
                  <p className={`text-sm sm:text-base font-serif font-black uppercase tracking-tight leading-tight ${data?.name ? 'text-[#004d3a]' : 'text-[#004d3a]/40'}`}>
                    {data?.name ? data.name : 'YOUR NAME'}
                  </p>
                </div>
              </div>

              <div className="border-b border-dashed border-[#ed1765]/30 my-0.5" />

              {/* Row 2: ROLE */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#ed1765] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Briefcase className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[11px] font-mono font-extrabold tracking-wider text-[#004d3a] uppercase leading-none mb-0.5">
                    ROLE
                  </p>
                  <p className="text-xs sm:text-sm font-mono font-extrabold text-[#ed1765] uppercase tracking-tight leading-tight">
                    {data?.role ? data.role : 'AI/ML ENGINEER'}
                  </p>
                </div>
              </div>

              <div className="border-b border-dashed border-[#ed1765]/30 my-0.5" />

              {/* Row 3: TEAM NAME */}
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-[#ed1765] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Users className="w-3.5 h-3.5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="text-[11px] font-mono font-extrabold tracking-wider text-[#004d3a] uppercase leading-none mb-0.5">
                    TEAM NAME
                  </p>
                  <p className={`text-xs sm:text-sm font-mono font-extrabold uppercase tracking-tight leading-tight ${data?.team ? 'text-[#ed1765]' : 'text-[#ed1765]/50'}`}>
                    {data?.team ? data.team : 'YOUR TEAM NAME'}
                  </p>
                </div>
              </div>
            </div>

            {/* Vertical Pink Dashed Line Divider */}
            <div className="col-span-1 flex justify-center h-full">
              <div className="h-full border-r-2 border-dashed border-[#ed1765]/40" />
            </div>

            {/* Right Graphic Column: Sunset & Anchor */}
            <div className="col-span-3 flex flex-col items-center justify-between h-full py-1">
              {/* Half Sunset Graphic */}
              <div className="relative w-8 h-4 overflow-hidden flex items-end justify-center">
                <div className="w-8 h-8 rounded-full bg-[#f7c515] -mb-4 shadow-sm" />
              </div>

              {/* Anchor Icon */}
              <div className="text-[#ed1765] mt-2">
                <Anchor className="w-5 h-5 stroke-[2.5]" />
              </div>
            </div>

          </div>
        </div>

        {/* Transparent Footer Space (Artwork and Footer are pre-printed in template) */}
        <div className="h-[120px] sm:h-[140px] w-full" />

      </div>
    </div>
  );
}
