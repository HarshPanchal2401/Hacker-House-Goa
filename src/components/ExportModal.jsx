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
    const text = `Locked in for Hacker House Goa 2026! 🚀\n\nShip or ship from Oct 28–31 in Goa.\nGenerated my official builder badge using #FrameInGoa @247pmstudio @hhgoa\n\nBuild your badge here:`;
    const url = 'https://hhgoa.com/';
    const tweetIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`;
    window.open(tweetIntentUrl, '_blank', 'noopener,noreferrer');
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

        <div className="text-center mb-5">
          <div className="inline-flex items-center gap-1.5 bg-[#015E39] text-[#FFE500] px-3 py-1 rounded-full text-xs font-mono-tech font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> BADGE GENERATED!
          </div>
          <h2 className="font-serif-display text-2xl text-[#015E39] font-black">
            YOUR HH GOA 2026 BADGE
          </h2>
          <p className="text-xs font-mono-tech text-gray-600 mt-1">
            Download your image and post on X with <span className="font-bold text-[#FF007F]">#FrameInGoa</span>
          </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          <button
            onClick={handleDownload}
            className="w-full py-3.5 px-4 bg-[#015E39] hover:bg-[#004227] text-[#FFE500] font-mono-tech font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD HD PNG</span>
          </button>

          <button
            onClick={handleShareToX}
            className="w-full py-3.5 px-4 bg-black hover:bg-gray-900 text-white font-mono-tech font-bold text-xs rounded-xl shadow flex items-center justify-center gap-2 transition border border-white/20"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
            <span>SHARE TO X (#FrameInGoa)</span>
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono-tech text-gray-600 pt-2 border-t border-gray-300">
          <button
            onClick={handleCopyLink}
            className="flex items-center gap-1 hover:text-[#015E39]"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5 text-[#FF007F]" />}
            <span>{copied ? 'Copied Hashtag!' : 'Copy #FrameInGoa'}</span>
          </button>

          <a
            href="https://forms.gle/jM5hTaGvsrfEfixPA"
            target="_blank"
            rel="noreferrer"
            className="text-[#015E39] font-bold underline hover:text-[#FF007F] flex items-center gap-1"
          >
            Submit Form <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}
