import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import BadgeCanvas from './components/BadgeCanvas';
import ControlPanel from './components/ControlPanel';
import ExportModal from './components/ExportModal';
import GuideModal from './components/GuideModal';
import { Download, Share2, Sparkles } from 'lucide-react';

export default function App() {
  const [mode, setMode] = useState('idcard'); // 'idcard' | 'pfp'

  // Default Attendee Profile Data matching reference image
  const [photo, setPhoto] = useState(null);
  const [builderName, setBuilderName] = useState('HARSH PANCHAL');
  const [stackRole, setStackRole] = useState('AI/ML ENGINEER');
  const [teamName, setTeamName] = useState('CODE SAILOR');

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
    <div className="min-h-screen bg-hh-emerald flex flex-col font-sans selection:bg-[#f7c515] selection:text-[#004d3a]">
      {/* Header */}
      <Header onOpenInfo={() => setIsGuideOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 bg-[#f7c515] text-[#004d3a] px-3.5 py-1 rounded-full text-xs font-mono-tech font-bold uppercase tracking-wider mb-2 shadow-md">
            <Sparkles className="w-3.5 h-3.5" /> HH GOA 2026 OFFICIAL EVENT BADGE
          </div>
          <h1 className="font-serif-display text-3xl sm:text-5xl text-[#f7c515] font-black tracking-tight mb-2 uppercase">
            HACKER GOA HOUSE ID CARD
          </h1>
          <p className="text-xs sm:text-sm font-mono-tech text-emerald-100/90 max-w-xl mx-auto">
            Official Goa-themed event ID card & profile generator. Customize attendee info and share on X with <span className="text-[#ed1765] font-bold">#FrameInGoa</span>.
          </p>
        </div>

        {/* Workspace Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Badge Canvas Preview */}
          <div className="lg:col-span-7 space-y-4">
            <div className="bg-[#003c2d]/90 p-4 sm:p-6 rounded-2xl border-2 border-[#f7c515]/30 shadow-2xl">
              
              {/* Badge Canvas Render */}
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

              {/* Download & Share Buttons */}
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={() => setIsExportOpen(true)}
                  className="w-full py-3.5 px-4 bg-[#f7c515] hover:bg-[#f7c515]/90 text-[#004d3a] font-mono-tech font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition border-2 border-[#004d3a]"
                >
                  <Download className="w-4 h-4" />
                  <span>DOWNLOAD HD BADGE</span>
                </button>

                <button
                  onClick={() => setIsExportOpen(true)}
                  className="w-full py-3.5 px-4 bg-[#ed1765] hover:bg-[#c40e50] text-white font-mono-tech font-bold text-xs sm:text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition"
                >
                  <Share2 className="w-4 h-4" />
                  <span>SHARE TO X (#FrameInGoa)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column: Configuration Control Panel */}
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
      <footer className="border-t border-[#f7c515]/20 bg-[#002d22] py-4 px-4 text-center text-xs font-mono-tech text-emerald-100/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HACKER GOA HOUSE 2026 • 28 – 31 OCT 2026</span>
          <a href="https://hhgoa.com/" target="_blank" rel="noreferrer" className="text-[#f7c515] hover:underline font-bold">
            Official Hacker Goa House Web ↗
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
