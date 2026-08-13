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

  const handleShareToX = async () => {
    triggerConfetti();

    const fileName = `HH_Goa_2026_${mode}_${(builderName || 'builder').replace(/\s+/g, '_')}.png`;
    const caption = `I'm attending Hacker House Goa 2026! 🌴🔥\n\nGenerated my official ${mode === 'pfp' ? 'PFP' : 'ID card'} with #FrameInGoa @hhgoa @247pmstudio\n\nMake yours at https://hhgoa.com`;

    // Convert base64 data URL → Blob reliably (fetch(data:) is blocked on some mobile browsers)
    const dataUrlToBlob = (dataUrl) => {
      const [header, base64] = dataUrl.split(',');
      const mime = header.match(/:(.*?);/)[1];
      const binary = atob(base64);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      return new Blob([bytes], { type: mime });
    };

    let imageBlob = null;
    try {
      imageBlob = dataUrlToBlob(imageDataUrl);
    } catch (e) {
      console.warn('Blob conversion failed:', e);
    }

    // 1. Auto-download image file so it's saved in user's gallery/downloads
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

    // 2. Try Native Web Share API with image file (best experience on mobile)
    //    This opens native OS share sheet where user can pick X directly with image attached
    if (imageBlob && navigator.share && navigator.canShare) {
      try {
        const file = new File([imageBlob], fileName, { type: 'image/png' });
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Hacker House Goa 2026 Badge',
            text: caption,
            files: [file],
          });
          setShareStatus('Shared! Select X from the share sheet.');
          return;
        }
      } catch (shareErr) {
        if (shareErr.name !== 'AbortError') {
          console.warn('Native file share skipped:', shareErr);
        } else {
          // User cancelled the share sheet — don't proceed to X
          return;
        }
      }
    }

    // 3. Copy image to clipboard as fallback
    if (imageBlob && navigator.clipboard && window.ClipboardItem) {
      try {
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': imageBlob })]);
        setShareStatus('Image copied! Paste it into your X post.');
      } catch (e) {
        setShareStatus('Badge downloaded! Attach photo to your X post.');
      }
    } else {
      setShareStatus('Badge downloaded! Attach photo to your X post.');
    }

    // 4. Redirect to X post composer (caption pre-filled, user attaches image manually)
    const webUrl = `https://x.com/intent/post?text=${encodeURIComponent(caption)}`;
    const appUrl = `twitter://post?text=${encodeURIComponent(caption)}`;
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const start = Date.now();
      window.location.href = appUrl;
      setTimeout(() => {
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
          <p className="text-[11px] font-mono-tech text-[#015E39] font-bold text-center mt-3 bg-emerald-100/90 p-2 rounded-lg border border-emerald-400 shadow-sm animate-pulse">
            ✨ {shareStatus}
          </p>
        ) : (
          <p className="text-[11px] font-mono-tech text-gray-500 text-center mt-3">
            💡 Badge image auto-downloads & copies so you can attach it directly to your X post!
          </p>
        )}

      </div>

    </div>
  );
}
