import React, { useRef } from 'react';
import { Upload, Shield, Image as ImageIcon } from 'lucide-react';

const STACK_OPTIONS = [
  'AI/ML ENGINEER',
  'FULLSTACK WIZARD',
  'SOLANA / WEB3 DEV',
  'RUST ENGINEER',
  'UI/UX CRAFTSMAN',
  'PROTOCOL ARCHITECT',
  'PRODUCT SHIPPER'
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
      <div className="bg-[#003c2d] p-3 rounded-2xl border border-[#f7c515]/30 flex gap-2">
        <button
          onClick={() => setMode('idcard')}
          className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-mono-tech font-bold transition flex items-center justify-center gap-2 ${
            mode === 'idcard'
              ? 'bg-[#f7c515] text-[#004d3a] shadow-md font-extrabold'
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
              ? 'bg-[#f7c515] text-[#004d3a] shadow-md font-extrabold'
              : 'bg-white/5 hover:bg-white/10 text-white/80'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          <span>PFP OVERLAY</span>
        </button>
      </div>

      {/* YOUR DETAILS FORM */}
      <div className="bg-[#003c2d] p-6 rounded-2xl border-2 border-[#f7c515]/40 shadow-xl space-y-4">
        {/* Panel Header */}
        <h2 className="font-serif-display text-2xl text-[#ed1765] font-black uppercase tracking-wide">
          YOUR DETAILS
        </h2>

        {/* Photo Upload Input */}
        <div>
          <label className="block text-xs font-mono-tech font-bold text-emerald-100 uppercase mb-1.5 flex items-center justify-between">
            <span>YOUR PHOTO</span>
            <span className="text-[10px] text-[#f7c515]">JPG, PNG, HEIC</span>
          </label>
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-[#f7c515]/40 hover:border-[#f7c515] bg-[#002d22] hover:bg-[#003628] rounded-xl p-3.5 text-center cursor-pointer transition"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <Upload className="w-5 h-5 mx-auto text-[#f7c515] mb-1" />
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
            placeholder="Your Name (e.g. HARSH PANCHAL)"
            className="w-full px-4 py-2.5 bg-[#002d22] border border-[#006b51] rounded-xl text-xs font-mono-tech text-white placeholder-emerald-400/60 focus:outline-none focus:border-[#f7c515]"
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
              className="w-full px-4 py-2.5 bg-[#002d22] border border-[#006b51] rounded-xl text-xs font-mono-tech text-white appearance-none focus:outline-none focus:border-[#f7c515]"
            >
              {STACK_OPTIONS.map((opt) => (
                <option key={opt} value={opt} className="bg-[#003c2d] text-white">
                  {opt}
                </option>
              ))}
            </select>
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-white/70">
              ▼
            </div>
          </div>
        </div>

        {/* Team Name */}
        <div>
          <label className="block text-xs font-mono-tech font-bold text-emerald-100 uppercase mb-1">
            TEAM NAME
          </label>
          <input
            type="text"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="Your Team Name (e.g. CODE SAILOR)"
            className="w-full px-4 py-2.5 bg-[#002d22] border border-[#006b51] rounded-xl text-xs font-mono-tech text-white placeholder-emerald-400/60 focus:outline-none focus:border-[#f7c515]"
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
            className="w-full accent-[#f7c515]"
          />
        </div>

        {/* Yellow Action Button */}
        <div className="pt-2">
          <button
            onClick={onTriggerDownload}
            className="w-full py-3.5 px-4 bg-[#f7c515] hover:bg-[#f7c515]/90 text-[#004d3a] font-serif-display font-black text-sm uppercase rounded-lg shadow-lg flex items-center justify-center gap-2 transition transform active:scale-98 border-4 border-dashed border-[#ed1765]"
          >
            <span>GENERATE MY ID CARD</span>
            <span className="text-base">🪄</span>
          </button>
        </div>
      </div>
    </div>
  );
}
