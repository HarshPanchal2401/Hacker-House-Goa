import React, { useRef } from 'react';
import { Upload, Shield, Image as ImageIcon, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function ControlPanel({
  mode,
  setMode,
  builderName,
  setBuilderName,
  stackRole,
  setStackRole,
  photo,
  onFileSelect,        // (File) => void  — raw file, App.jsx handles conversion + detection
  isDetecting,        // bool — show spinner while face detection runs
  isGeneratingTitle,  // bool — show spinner while Gemini AI generates title
  faceDetected,       // bool — show checkmark after detection
  formError,
  setFormError,
  onGenerate,
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileSelect(file);
      if (setFormError) setFormError('');
    }
    // Reset input so the same file can be re-selected
    e.target.value = '';
  };

  const isPhotoMissing = formError && !photo;
  const isNameMissing = formError && mode === 'idcard' && !builderName.trim();
  const isRoleMissing = formError && mode === 'idcard' && !stackRole.trim();
  const isLoading = isDetecting || isGeneratingTitle;

  return (
    <div className="space-y-4">
      {/* Format Toggle Bar */}
      <div className="bg-[#003c2d] p-2 rounded-xl border border-[#f7c515]/30 flex gap-2">
        <button
          onClick={() => { setMode('idcard'); if (setFormError) setFormError(''); }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono-tech font-bold transition flex items-center justify-center gap-2 ${
            mode === 'idcard'
              ? 'bg-[#f7c515] text-[#004d3a] shadow-md font-extrabold'
              : 'bg-white/5 hover:bg-white/10 text-white/80'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>BUILDER ID CARD</span>
        </button>

        <button
          onClick={() => { setMode('pfp'); if (setFormError) setFormError(''); }}
          className={`flex-1 py-2 px-3 rounded-lg text-xs font-mono-tech font-bold transition flex items-center justify-center gap-2 ${
            mode === 'pfp'
              ? 'bg-[#f7c515] text-[#004d3a] shadow-md font-extrabold'
              : 'bg-white/5 hover:bg-white/10 text-white/80'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          <span>PFP OVERLAY</span>
        </button>
      </div>

      {/* YOUR DETAILS FORM */}
      <div className="bg-[#003c2d] p-5 sm:p-6 rounded-2xl border-2 border-[#f7c515]/40 shadow-xl space-y-4">
        {/* Panel Header */}
        <div className="text-center">
          <h2 className="font-serif-display text-xl sm:text-2xl text-[#ed1765] font-black uppercase tracking-wide">
            ADD YOUR DETAILS
          </h2>
        </div>


        {/* Validation Alert Banner */}
        {formError && (
          <div className="bg-[#ed1765]/20 border-2 border-[#ed1765] text-white p-3 rounded-xl flex items-center gap-2.5 text-xs font-mono-tech font-bold animate-bounce">
            <AlertCircle className="w-4 h-4 text-[#ed1765] shrink-0" />
            <span className="text-emerald-50">{formError}</span>
          </div>
        )}

        {/* Photo Upload Input */}
        <div>
          <label className="block text-[11px] font-mono-tech font-bold text-emerald-100 uppercase mb-1 flex items-center justify-between">
            <span>
              YOUR PHOTO <span className="text-[#ed1765]">*</span>
            </span>
            <span className="text-[10px] text-[#f7c515]">JPG, PNG, HEIC</span>
          </label>
          <div
            onClick={() => !isLoading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-3 text-center cursor-pointer transition flex items-center justify-center gap-3 min-h-[68px] ${
              isLoading
                ? 'border-[#f7c515] bg-[#003628] cursor-wait'
                : isPhotoMissing
                ? 'border-[#ed1765] bg-[#ed1765]/10'
                : photo
                ? 'border-[#f7c515]/60 hover:border-[#f7c515] bg-[#002d22] hover:bg-[#003628]'
                : 'border-[#f7c515]/40 hover:border-[#f7c515] bg-[#002d22] hover:bg-[#003628]'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={isLoading}
            />


            {/* State: detecting */}
            {isDetecting && (
              <div className="flex items-center gap-3">
                <Loader2 className="w-6 h-6 text-[#f7c515] animate-spin shrink-0" />
                <div className="text-left">
                  <p className="font-mono-tech text-xs font-bold text-[#f7c515]">Detecting face…</p>
                  <p className="text-[10px] font-mono-tech text-emerald-200">Auto-framing your photo</p>
                </div>
              </div>
            )}

            {/* State: photo loaded + face detected */}
            {!isDetecting && photo && (
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden border-2 border-[#ed1765] shrink-0 bg-[#004d3a]">
                  <img
                    src={photo}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                  {faceDetected && (
                    <div className="absolute bottom-0.5 right-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-[#f7c515] drop-shadow" />
                    </div>
                  )}
                </div>
                <div className="text-left">
                  <p className="font-mono-tech text-xs font-bold text-[#f7c515]">
                    {faceDetected ? 'Face detected ✓  Auto-framed!' : 'Photo selected ✓'}
                  </p>
                  <p className="text-[10px] font-mono-tech text-emerald-200">Click to change photo</p>
                </div>
              </div>
            )}

            {/* State: no photo */}
            {!isDetecting && !photo && (
              <div className="py-1">
                <Upload className={`w-5 h-5 mx-auto mb-1 ${isPhotoMissing ? 'text-[#ed1765]' : 'text-[#f7c515]'}`} />
                <p className="font-mono-tech text-xs font-bold text-white">
                  Click to Upload Photo <span className="text-[#ed1765]">*</span>
                </p>
                <p className="text-[10px] font-mono-tech text-emerald-300 mt-0.5">
                  Face auto-detected & framed 🎯
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Name & Stack/Role — only for ID Card mode */}
        {mode === 'idcard' && (
          <>
            {/* Name Input */}
            <div>
              <label className="block text-[11px] font-mono-tech font-bold text-emerald-100 uppercase mb-1">
                NAME <span className="text-[#ed1765]">*</span>
              </label>
              <input
                type="text"
                value={builderName}
                onChange={(e) => {
                  setBuilderName(e.target.value);
                  if (formError && setFormError) setFormError('');
                }}
                placeholder="Your Name (e.g. HARSH PANCHAL)"
                className={`w-full px-3.5 py-2 bg-[#002d22] border rounded-xl text-xs font-mono-tech text-white uppercase placeholder-emerald-400/60 focus:outline-none focus:border-[#f7c515] ${
                  isNameMissing ? 'border-[#ed1765] bg-[#ed1765]/10' : 'border-[#006b51]'
                }`}
              />
            </div>

            {/* Stack / Role Text Input */}
            <div>
              <label className="block text-[11px] font-mono-tech font-bold text-emerald-100 uppercase mb-1">
                STACK / ROLE <span className="text-[#ed1765]">*</span>
              </label>
              <input
                type="text"
                value={stackRole}
                onChange={(e) => {
                  setStackRole(e.target.value);
                  if (formError && setFormError) setFormError('');
                }}
                placeholder="Your Role (e.g. AI/ML ENGINEER)"
                className={`w-full px-3.5 py-2 bg-[#002d22] border rounded-xl text-xs font-mono-tech text-white uppercase placeholder-emerald-400/60 focus:outline-none focus:border-[#f7c515] ${
                  isRoleMissing ? 'border-[#ed1765] bg-[#ed1765]/10' : 'border-[#006b51]'
                }`}
              />
            </div>
          </>
        )}

        {/* Action Button */}
        <div className="pt-2">
          <button
            onClick={onGenerate}
            disabled={isLoading}
            className={`w-full py-3.5 px-4 font-serif-display font-black text-sm uppercase rounded-xl shadow-lg flex items-center justify-center gap-2 transition transform border-2 border-dashed border-[#ed1765] ${
              isLoading
                ? 'bg-[#f7c515]/60 text-[#004d3a]/60 cursor-wait'
                : 'bg-[#f7c515] hover:bg-[#f7c515]/90 text-[#004d3a] active:scale-98'
            }`}
          >
            {isDetecting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>FRAMING PHOTO…</span>
              </>
            ) : isGeneratingTitle ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>AI CREATING BUILDER TITLE… ✨</span>
              </>
            ) : (
                <span>{mode === 'pfp' ? 'GENERATE PFP OVERLAY' : 'GENERATE MY ID CARD'}</span>

            )}
          </button>
        </div>
      </div>
    </div>
  );
}


