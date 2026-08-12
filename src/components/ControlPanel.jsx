import React, { useRef } from 'react';
import { Upload, Download, User, Shield, Image as ImageIcon, Code, Star, Palmtree, IdCard } from 'lucide-react';

const STACK_OPTIONS = [
  'AI/ML Engineer',
  'Fullstack Wizard',
  'Solana / Web3 Dev',
  'Rust Engineer',
  'UI/UX Craftsman',
  'Protocol Architect',
  'Product Shipper'
];

export default function ControlPanel({
  mode,
  setMode,
  builderName,
  setBuilderName,
  stackRole,
  setStackRole,
  teamName,
  setTeamName,
  onPhotoUpload,
  zoom,
  setZoom,
  onTriggerDownload,
  onTriggerShare
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      onPhotoUpload(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-6">
      {/* Format Toggle Bar */}
      <div className="bg-[#043A23] p-3 rounded-2xl border border-[#FFE500]/30 flex gap-2">
        <button
          onClick={() => setMode('idcard')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono-tech font-bold transition flex items-center justify-center gap-2 ${
            mode === 'idcard'
              ? 'bg-[#FFE500] text-[#043A23] shadow-md font-extrabold'
              : 'bg-white/5 hover:bg-white/10 text-white/80'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>BUILDER ID CARD</span>
        </button>

        <button
          onClick={() => setMode('pfp')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono-tech font-bold transition flex items-center justify-center gap-2 ${
            mode === 'pfp'
              ? 'bg-[#FFE500] text-[#043A23] shadow-md font-extrabold'
              : 'bg-white/5 hover:bg-white/10 text-white/80'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>PFP OVERLAY</span>
        </button>
      </div>

      {/* PANEL 1: YOUR DETAILS FORM */}
      <div className="bg-[#043A23] p-6 rounded-2xl border-2 border-[#C4A600]/60 shadow-xl space-y-4">
        {/* Panel Header */}
        <h2 className="font-serif-display text-2xl text-[#FF007F] font-black uppercase tracking-wide">
          YOUR DETAILS
        </h2>

        {/* Photo Upload Input */}
        <div>
          <label className="block text-xs font-mono-tech font-bold text-emerald-100 uppercase mb-1.5 flex items-center justify-between">
            <span>YOUR PHOTO</span>
            <span className="text-[10px] text-[#FFE500]">JPG, PNG, HEIC</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#FFE500]/40 hover:border-[#FFE500] bg-[#022A19] hover:bg-[#03331F] rounded-xl p-3.5 text-center cursor-pointer transition"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="w-5 h-5 mx-auto text-[#FFE500] mb-1" />
            <p className="font-mono-tech text-xs font-bold text-white">
              Click to Upload Photo
            </p>
          </div>
        </div>

        {/* Name Input */}
        <div>
          <label className="block text-xs font-mono-tech font-bold text-emerald-100 uppercase mb-1">
            NAME
          </label>
          <input
            type="text"
            value={builderName}
            onChange={(e) => setBuilderName(e.target.value)}
            placeholder="Harsh Patil"
            className="w-full px-4 py-2.5 bg-[#022A19] border border-[#06633C] rounded-xl text-xs font-mono-tech text-white placeholder-gray-500 focus:outline-none focus:border-[#FFE500]"
          />
        </div>

        {/* Stack / Role Dropdown */}
        <div>
          <label className="block text-xs font-mono-tech font-bold text-emerald-100 uppercase mb-1">
            STACK / ROLE
          </label>
          <div className="relative">
            <select
              value={stackRole}
              onChange={(e) => setStackRole(e.target.value)}
              className="w-full px-4 py-2.5 bg-[#022A19] border border-[#06633C] rounded-xl text-xs font-mono-tech text-white appearance-none focus:outline-none focus:border-[#FFE500]"
            >
              {STACK_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#043A23] text-white">
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              ▼
            </div>
          </div>
        </div>

        {/* Your Vibe / Team Name */}
        <div>
          <label className="block text-xs font-mono-tech font-bold text-emerald-100 uppercase mb-1">
            YOUR VIBE / TEAM NAME (OPTIONAL)
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Building intelligent solutions"
            className="w-full px-4 py-2.5 bg-[#022A19] border border-[#06633C] rounded-xl text-xs font-mono-tech text-white placeholder-gray-500 focus:outline-none focus:border-[#FFE500]"
          />
        </div>

        {/* Photo Zoom Slider */}
        <div className="pt-1">
          <div className="flex justify-between text-[11px] font-mono-tech text-emerald-200 mb-1">
            <span>PHOTO ZOOM</span>
            <span>{zoom.toFixed(1)}x</span>
          </div>
          <input
            type="range"
            min="0.5"
            max="2.5"
            step="0.05"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full accent-[#FFE500]"
          />
        </div>

        {/* Yellow Action Button with Patterned Border */}
        <div className="pt-2">
          <button
            onClick={onTriggerDownload}
            className="w-full py-3.5 px-4 bg-[#FFE500] hover:bg-[#FFE500]/90 text-[#043A23] font-serif-display font-black text-sm uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 transition transform active:scale-98 border-4 border-dashed border-[#B21E1E]"
          >
            <span>GENERATE MY ID CARD</span>
            <span className="text-base">🪄</span>
          </button>
        </div>
      </div>

      {/* PANEL 2: IN YOUR ID CARD FEATURE SUMMARY & ACTIONS */}
      <div className="bg-[#043A23] p-6 rounded-2xl border-2 border-[#C4A600]/60 shadow-xl space-y-4">
        {/* Panel Header */}
        <h2 className="font-serif-display text-xl text-[#FF007F] font-black uppercase tracking-wide">
          IN YOUR ID CARD
        </h2>

        {/* Checklist */}
        <div className="space-y-3 font-mono-tech text-xs text-white">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-[#FFE500]" />
            <span>Your Photo</span>
          </div>

          <div className="flex items-center gap-3">
            <IdCard className="w-5 h-5 text-[#FFE500]" />
            <span>Your Name</span>
          </div>

          <div className="flex items-center gap-3">
            <Code className="w-5 h-5 text-[#FFE500]" />
            <span>Your Stack / Role</span>
          </div>

          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-[#FFE500]" />
            <span>Your Builder Class</span>
          </div>

          <div className="flex items-center gap-3">
            <Palmtree className="w-5 h-5 text-[#FFE500]" />
            <span>Event Branding</span>
          </div>
        </div>

        {/* Primary Hot Pink Download Button */}
        <div className="pt-3 space-y-2.5">
          <button
            onClick={onTriggerDownload}
            className="w-full py-3.5 px-4 bg-[#FF007F] hover:bg-[#D6006B] text-white font-mono-tech font-bold text-xs uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform active:scale-98"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD ID CARD</span>
          </button>

          {/* Secondary Share to X Button */}
          <button
            onClick={onTriggerShare}
            className="w-full py-3.5 px-4 bg-transparent hover:bg-white/5 text-white font-mono-tech font-bold text-xs uppercase rounded-xl border border-white/40 flex items-center justify-center gap-2 transition"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>SHARE TO X</span>
          </button>
        </div>
      </div>
    </div>
  );
}
