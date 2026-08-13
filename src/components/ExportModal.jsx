import React, { useState } from 'react';
import { Download, Check, Sparkles, X, Copy, ExternalLink } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportModal({ isOpen, onClose, imageDataUrl, mode, builderName, handle }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !imageDataUrl) return null;

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#015E39', '#FFE500', '#FF007F', '#FFFFFF']
    });
  };

  const handleDownload = () => {
    triggerConfetti();
    const link = document.createElement('a');
    link.download = `HH_Goa_2026_${mode}_${(builderName || 'builder').replace(/\s+/g, '_')}.png`;
    link.href = imageDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShareToX = () => {
    triggerConfetti();

    const fileName = `HH_Goa_2026_${mode}_${(builderName || 'builder').replace(/\s+/g, '_')}.png`;
    const caption = `I'm attending Hacker House Goa 2026! 🌴🔥\n\nGenerated my official ${mode === 'pfp' ? 'PFP' : 'ID card'} with #FrameInGoa @hhgoa @247pmstudio\n\nMake yours at https://hhgoa.com`;

    // 1. Auto-download image so it's instantly saved in photos/downloads
    try {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = imageDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Auto download failed:', e);
    }

    // 2. Direct launch: Native X App if installed, Browser if uninstalled
    const webUrl = `https://x.com/intent/post?text=${encodeURIComponent(caption)}`;
    const appUrl = `twitter://post?text=${encodeURIComponent(caption)}`;

    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const start = Date.now();
      window.location.href = appUrl;
      setTimeout(() => {
        // If app didn't take over focus within 600ms, open in web browser
        if (Date.now() - start < 1500) {
          window.open(webUrl, '_blank', 'noopener,noreferrer');
        }
      }, 600);
    } else {
      window.open(webUrl, '_blank', 'noopener,noreferrer');
    }
  };





  const handleCopyLink = () => {
    navigator.clipboard.writeText('https://hhgoa.com/#FrameInGoa');
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#FAF6E9] rounded-2xl p-6 shadow-2xl border-4 border-[#015E39]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-black/5 hover:bg-black/10 rounded-full p-2 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-4">
          <h2 className="font-serif-display text-2xl text-[#015E39] font-black uppercase">
            YOUR BADGE IS READY!
          </h2>
        </div>

        {/* Preview */}
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-[#015E39]/30 bg-[#004227] mb-5 max-h-[42vh] flex items-center justify-center">
          <img
            src={imageDataUrl}
            alt="HH Goa Generated Graphic"
            className="w-full h-full object-contain max-h-[40vh]"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-4 bg-[#015E39] hover:bg-[#004227] text-[#FFE500] font-mono-tech font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD</span>
          </button>

          <button
            onClick={handleShareToX}
            className="w-full py-3.5 px-4 bg-black hover:bg-gray-900 text-white font-mono-tech font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition border border-white/20"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>SHARE ON X</span>
          </button>
        </div>

        <p className="text-[11px] font-mono-tech text-gray-500 text-center mt-3">
          💡 Badge image auto-downloads so you can attach it directly to your X post!
        </p>
      </div>

    </div>
  );
}
