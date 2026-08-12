import React from 'react';
import { X, CheckCircle, ExternalLink, Calendar, Shield, Sparkles } from 'lucide-react';

export default function GuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg bg-[#FAF6E9] rounded-2xl p-6 shadow-2xl border-4 border-[#015E39]">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 bg-black/5 hover:bg-black/10 rounded-full p-2 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-4">
          <span className="inline-flex items-center gap-1 bg-[#FF007F] text-white px-3 py-1 rounded-full text-xs font-mono-tech font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5" /> HH GOA 2026 TASK #1
          </span>
          <h2 className="font-serif-display text-2xl text-[#015E39] font-black">
            TASK #1 GUIDE & SPECIFICATION
          </h2>
        </div>

        <div className="space-y-3 text-xs font-mono-tech text-gray-800 mb-6">
          <div className="bg-[#015E39]/10 p-3.5 rounded-xl border border-[#015E39]/20">
            <h3 className="font-bold text-[#015E39] mb-1">🎯 TASK OBJECTIVE:</h3>
            <p>Build a web tool where anyone uploads a photo and instantly gets an on-brand HH Goa 2026 graphic ready to download and share on X with #FrameInGoa.</p>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white p-3 rounded-xl border border-gray-300">
              <h4 className="font-bold text-[#015E39] flex items-center gap-1">
                <CheckCircle className="w-3.5 h-3.5 text-green-600" /> FAST & MOBILE
              </h4>
              <p className="text-gray-600 text-[11px] mt-0.5">Works near-instantly on phones & desktop without logins.</p>
            </div>

            <div className="bg-white p-3 rounded-xl border border-gray-300">
              <h4 className="font-bold text-[#015E39] flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-[#FF007F]" /> DEADLINE
              </h4>
              <p className="text-gray-600 text-[11px] mt-0.5">11:59 pm, 13th Aug 2026</p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <a
            href="https://forms.gle/jM5hTaGvsrfEfixPA"
            target="_blank"
            rel="noreferrer"
            className="flex-1 py-3 px-4 bg-[#015E39] hover:bg-[#004227] text-[#FFE500] font-mono-tech font-bold text-xs rounded-xl shadow text-center flex items-center justify-center gap-1 transition"
          >
            <Shield className="w-4 h-4" />
            <span>SUBMISSION FORM</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={onClose}
            className="py-3 px-5 bg-gray-200 hover:bg-gray-300 text-gray-800 font-mono-tech font-bold text-xs rounded-xl transition"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
}
