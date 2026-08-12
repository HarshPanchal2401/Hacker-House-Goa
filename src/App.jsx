import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import BadgeCanvas from './components/BadgeCanvas';
import ControlPanel from './components/ControlPanel';
import ExportModal from './components/ExportModal';
import GuideModal from './components/GuideModal';
import { Download, Share2, Sparkles } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('idcard'); // 'idcard' | 'pfp'
  const [photo, setPhoto] = useState(null);

  // Exact Badge Fields matching reference design
  const [builderName, setBuilderName] = useState('Harsh Patil');
  const [stackRole, setStackRole] = useState('AI/ML Engineer');
  const [teamName, setTeamName] = useState('Building intelligent solutions');

  // Photo Framing Controls
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Export Data
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  const handleCanvasReady = useCallback((dataUrl) => {
    setImageDataUrl(dataUrl);
  }, []);

  return (
    <div className="min-h-screen bg-hh-emerald flex flex-col font-sans">
      {/* Header */}
      <Header onOpenInfo={() => setIsGuideOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#FFE500] text-[#015E39] px-3.5 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> HH GOA 2026 OFFICIAL EVENT BADGE
          </div>
          <h1 className="font-serif-display text-3xl sm:text-5xl text-[#FFE500] font-black tracking-tight mb-2">
            HACKER HOUSE GOA BADGE
          </h1>
          <p className="text-xs sm:text-sm font-mono-tech text-emerald-100/90 max-w-xl mx-auto">
            Upload your photo to generate your official HH Goa builder pass and share on X with <span className="text-[#FF007F] font-bold">#FrameInGoa</span>.
          </p>
        </div>

        {/* 2-Column Responsive Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Exact Badge Canvas Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#004227]/90 p-4 sm:p-6 rounded-2xl border-2 border-[#FFE500]/30 shadow-2xl">
              <BadgeCanvas
                mode={mode}
                photo={photo}
                builderName={builderName}
                stackRole={stackRole}
                teamName={teamName}
                zoom={zoom}
                panX={panX}
                panY={panY}
                onCanvasReady={handleCanvasReady}
              />

              {/* Quick Canvas Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="w-full py-3.5 px-4 bg-[#FFE500] hover:bg-[#FFE500]/90 text-[#015E39] font-mono-tech font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition border-2 border-[#015E39]"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD HD BADGE</span>
                </button>

                <button
                  onClick={() => setIsExportOpen(true)}
                  className="w-full py-3.5 px-4 bg-[#FF007F] hover:bg-[#D6006B] text-white font-mono-tech font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>SHARE TO X (#FrameInGoa)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Replicated Side Configuration Panels */}
          <div className="lg:col-span-5">
            <ControlPanel
              mode={mode}
              setMode={setMode}
              builderName={builderName}
              setBuilderName={setBuilderName}
              stackRole={stackRole}
              setStackRole={setStackRole}
              teamName={teamName}
              setTeamName={setTeamName}
              onPhotoUpload={setPhoto}
              zoom={zoom}
              setZoom={setZoom}
              panX={panX}
              setPanX={setPanX}
              panY={panY}
              setPanY={setPanY}
              onTriggerDownload={() => setIsExportOpen(true)}
              onTriggerShare={() => setIsExportOpen(true)}
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#FFE500]/20 bg-[#003620] py-4 px-4 text-center text-xs font-mono-tech text-emerald-100/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HH GOA 2026 • 2:47 PM STUDIO</span>
          <a href="https://forms.gle/jM5hTaGvsrfEfixPA" target="_blank" rel="noreferrer" className="text-[#FFE500] hover:underline font-bold">
            Official Task Submission Form ↗
          </a>
        </div>
      </footer>

      {/* Modals */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        imageDataUrl={imageDataUrl}
        mode={mode}
        builderName={builderName}
        handle={teamName}
      />

      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
