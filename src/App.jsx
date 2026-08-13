import React, { useState, useCallback, useEffect, useRef } from 'react';
import Header from './components/Header';
import BadgeCanvas from './components/BadgeCanvas';
import ControlPanel from './components/ControlPanel';
import ExportModal from './components/ExportModal';
import GuideModal from './components/GuideModal';
import { Download, Share2, Sparkles } from 'lucide-react';
import { warmUpDetector, detectFace } from './utils/faceDetection';
import { computePhotoPlacement } from './utils/photoEngine';
import { generateBuilderTitle } from './utils/builderTitleGenerator';

export default function App() {
  const [showPreview, setShowPreview] = useState(false);
  const [mode, setMode] = useState('idcard'); // 'idcard' | 'pfp'

  // Attendee profile data
  const [photo, setPhoto] = useState(null);
  const [builderName, setBuilderName] = useState('');
  const [stackRole, setStackRole] = useState('');
  const [teamName, setTeamName] = useState('');
  const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);


  // Auto-computed photo framing (from face detection)
  const [zoom, setZoom] = useState(1.0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);

  // Face detection state
  const [faceResult, setFaceResult] = useState(null);
  const [isDetecting, setIsDetecting] = useState(false);
  const loadedImgRef = useRef(null); // stores the loaded HTMLImageElement for recompute-on-mode-change

  // Export Data
  const [imageDataUrl, setImageDataUrl] = useState('');
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [formError, setFormError] = useState('');


  // Warm up MediaPipe model on mount so it's ready when user picks a photo
  useEffect(() => { warmUpDetector(); }, []);

  // Recompute placement when mode changes (ID card ↔ PFP have different frame dims)
  useEffect(() => {
    if (!faceResult || !loadedImgRef.current) return;
    const img = loadedImgRef.current;
    const placement = computePhotoPlacement({
      imgWidth: img.naturalWidth,
      imgHeight: img.naturalHeight,
      mode,
      faceResult,
    });
    setZoom(placement.zoom);
    setPanX(placement.panX);
    setPanY(placement.panY);
  }, [mode, faceResult]);

  const handleCanvasReady = useCallback((dataUrl) => {
    setImageDataUrl(dataUrl);
  }, []);

  /**
   * Full upload pipeline:
   *  1. HEIC → JPEG conversion (for iOS Camera Roll photos)
   *  2. Set photo immediately (so Generate button is usable right away)
   *  3. Run face detection
   *  4. Compute smart zoom/pan placement
   */
  const handleFileSelect = async (file) => {
    if (!file) return;
    setIsDetecting(true);
    setFaceResult(null);

    try {
      let blob = file;

      // ── HEIC/HEIF conversion (iOS Camera Roll) ──────────────────────────
      const isHeic =
        file.type === 'image/heic' ||
        file.type === 'image/heif' ||
        /\.(heic|heif)$/i.test(file.name);

      if (isHeic) {
        try {
          const heic2any = (await import('heic2any')).default;
          const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.88 });
          blob = Array.isArray(converted) ? converted[0] : converted;
        } catch (heicErr) {
          console.warn('HEIC conversion failed, trying original:', heicErr);
        }
      }

      // ── Set photo immediately for UI feedback ───────────────────────────
      const objectUrl = URL.createObjectURL(blob);
      setPhoto(objectUrl);

      // ── Load image element ───────────────────────────────────────────────
      const img = new Image();
      img.onload = async () => {
        loadedImgRef.current = img;

        // ── Face detection ─────────────────────────────────────────────────
        const face = await detectFace(img);
        setFaceResult(face);

        // ── Compute smart placement ────────────────────────────────────────
        const placement = computePhotoPlacement({
          imgWidth: img.naturalWidth,
          imgHeight: img.naturalHeight,
          mode,
          faceResult: face,
        });

        setZoom(placement.zoom);
        setPanX(placement.panX);
        setPanY(placement.panY);
        setIsDetecting(false);
      };

      img.onerror = () => {
        console.error('Failed to load image');
        setIsDetecting(false);
      };

      img.src = objectUrl;
      setFormError('');

    } catch (err) {
      console.error('Photo processing error:', err);
      setIsDetecting(false);
    }
  };

  const handleGenerate = async () => {
    const missing = [];
    if (!photo) missing.push('Photo');
    if (mode === 'idcard') {
      if (!builderName || !builderName.trim()) missing.push('Name');
      if (!stackRole || !stackRole.trim()) missing.push('Role');
    }

    if (missing.length > 0) {
      setFormError(`All fields are required! Please fill in: ${missing.join(', ')}`);
      setShowPreview(false);
      return;
    }

    setFormError('');

    // Auto-generate title for ID card mode
    if (mode === 'idcard') {
      setIsGeneratingTitle(true);
      try {
        const apiKey = import.meta.env.VITE_GROQ_API_KEY || import.meta.env.VITE_GEMINI_API_KEY || '';
        const { title } = await generateBuilderTitle(stackRole, apiKey);
        setTeamName(title);
      } catch (err) {
        console.error('Failed to generate title via LLM:', err);
      } finally {
        setIsGeneratingTitle(false);
      }
    }


    setShowPreview(true);
    setTimeout(() => {
      document.getElementById('card-preview')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };



  return (
    <div className="min-h-screen bg-hh-emerald flex flex-col font-sans selection:bg-[#f7c515] selection:text-[#004d3a]">
      {/* Header */}
      <Header onOpenInfo={() => setIsGuideOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Page Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h1 className="font-serif-display text-2xl sm:text-4xl md:text-5xl text-[#f7c515] font-black tracking-tight mb-2 uppercase px-1">
            MAKE YOUR <span className="text-[#ed1765]">CARD</span> & <span className="text-[#ed1765]">PFP</span> HERE
          </h1>
        </div>

        {/* Main Content Layout: Form First, Preview Below after Generate */}

        <div className="max-w-md mx-auto space-y-6">
          {/* TOP: Enter Details Form */}
          <div>
            <ControlPanel
              mode={mode}
              setMode={setMode}
              builderName={builderName}
              setBuilderName={setBuilderName}
              stackRole={stackRole}
              setStackRole={setStackRole}
              photo={photo}
              onFileSelect={handleFileSelect}
              isDetecting={isDetecting}
              isGeneratingTitle={isGeneratingTitle}
              faceDetected={!!faceResult}
              formError={formError}
              setFormError={setFormError}
              onGenerate={handleGenerate}
            />


          </div>

          {/* BOTTOM: Generated ID Card & PFP Preview (Rendered after clicking Generate) */}
          {showPreview && (
            <div id="card-preview" className="scroll-mt-6 animate-fade-in">
              <div className="bg-[#003c2d]/90 p-4 sm:p-6 rounded-2xl border-2 border-[#f7c515]/30 shadow-2xl space-y-4">
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

                {/* Action Button */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsExportOpen(true)}
                    className="w-full py-4 px-6 bg-[#f7c515] hover:bg-[#f7c515]/90 text-[#004d3a] font-serif-display font-black text-sm sm:text-base rounded-xl shadow-xl flex items-center justify-center transition border-2 border-dashed border-[#ed1765] uppercase tracking-wider active:scale-98"
                  >
                    <span>{mode === 'pfp' ? 'GET YOUR PFP' : 'GET YOUR ID CARD'}</span>
                  </button>


                </div>


              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#f7c515]/20 bg-[#002d22] py-4 px-4 text-center text-xs font-mono-tech text-emerald-100/70">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>HACKER HOUSE GOA 2026 • 28 – 31 OCT 2026</span>
          <a href="https://hhgoa.com/" target="_blank" rel="noreferrer" className="text-[#f7c515] hover:underline font-bold">
            Official Hacker House Goa Web ↗
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

