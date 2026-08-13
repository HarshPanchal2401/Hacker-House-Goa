import React, { useState } from 'react';
import { Download, Check, Sparkles, X, Copy, ExternalLink, Loader2 } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function ExportModal({ isOpen, onClose, imageDataUrl, mode, builderName, handle }) {
  const [copied, setCopied] = useState(false);
  const [shareStatus, setShareStatus] = useState('');

  if (!isOpen) return null;

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

    // Step 1: Auto-download the badge image to phone gallery / PC downloads
    try {
      const link = document.createElement('a');
      link.download = fileName;
      link.href = imageDataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error('Download failed:', e);
    }

    // Step 2: Tell user what's happening
    setShareStatus('📥 Badge saved! Opening X — attach the saved image to your post.');

    // Step 3: Open X directly — native app if installed, browser otherwise
    const webUrl = `https://x.com/intent/post?text=${encodeURIComponent(caption)}`;
    const appUrl = `twitter://post?message=${encodeURIComponent(caption)}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      // Try opening native X app first; fallback to browser after 800ms if app not installed
      window.location.href = appUrl;
      setTimeout(() => {
        window.open(webUrl, '_blank', 'noopener,noreferrer');
      }, 800);
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
        <div className="relative rounded-xl overflow-hidden shadow-lg border-2 border-[#015E39]/40 bg-[#002d22] mb-5 max-h-[42vh] min-h-[220px] flex items-center justify-center">
          {imageDataUrl ? (
            <img
              src={imageDataUrl}
              alt="HH Goa Generated Graphic"
              className="w-full h-full object-contain max-h-[40vh]"
            />
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <Loader2 className="w-8 h-8 animate-spin text-[#FFE500] mb-2" />
              <p className="font-mono-tech text-xs font-bold text-emerald-100">Preparing your badge image…</p>
            </div>
          )}
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

        {shareStatus ? (
          <div className="mt-3 bg-emerald-50 border border-emerald-400 rounded-xl p-3 text-center shadow-sm">
            <p className="text-[11px] font-mono-tech text-[#015E39] font-bold">{shareStatus}</p>
            <p className="text-[10px] font-mono-tech text-gray-600 mt-1">In X, tap the 📎 photo icon to attach your saved badge</p>
          </div>
        ) : (
          <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-[10px] font-mono-tech text-gray-500">
              📥 Badge auto-saves to your phone gallery / PC downloads
            </p>
            <p className="text-[10px] font-mono-tech text-gray-500 mt-0.5">
              Then tap 📎 in X to attach it to your post!
            </p>
          </div>
        )}


      </div>

    </div>
  );
}
