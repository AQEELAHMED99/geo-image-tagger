import React, { useRef, useState } from 'react';
import { UploadCloud, FolderUp, Loader2 } from 'lucide-react';

export default function Dropzone({ onFilesSelected, isUploading, uploadProgress }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      e.target.value = ''; // Reset input to allow selecting same files again
    }
  };

  return (
    <div className="w-full flex flex-col gap-2">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/jpeg,image/png,image/webp,image/jpg"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Main Gradient Dropzone matching screenshot */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative w-full h-[320px] sm:h-[360px] md:h-[390px] rounded-xl p-4 sm:p-5 cursor-pointer transition-all duration-300 shadow-2xl flex items-center justify-center overflow-hidden group ${
          isDragOver
            ? 'scale-[1.01] brightness-110 shadow-sky-500/50'
            : 'hover:brightness-105'
        }`}
        style={{
          background: 'linear-gradient(135deg, #00a4ff 0%, #0284c7 45%, #2563eb 85%, #1d4ed8 100%)',
        }}
      >
        {/* Subtle decorative background wave/glow overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-white/10 pointer-events-none" />

        {/* Dashed white inner border matching screenshot */}
        <div className="relative w-full h-full border-2 border-dashed border-white/60 rounded-xl flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Cloud Upload Icon Badge */}
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white flex items-center justify-center shadow-xl text-[#0284c7] mb-3 transform group-hover:scale-110 transition-transform duration-200">
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-[#0284c7]" />
            ) : (
              <UploadCloud className="w-8 h-8 text-[#0284c7] stroke-[2.2]" />
            )}
          </div>

          {/* Heading */}
          <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-sm mb-1">
            Drop Images Here
          </h3>

          {/* Formats subtitle */}
          <p className="text-white/80 text-xs sm:text-sm font-medium tracking-wide mb-2">
            JPG / JPEG / PNG / WebP
          </p>

          {/* "or" separator */}
          <span className="text-white/70 text-xs font-normal mb-3">or</span>

          {/* Click to Upload Button matching screenshot */}
          <button
            type="button"
            className="flex items-center gap-2 px-5 py-2 rounded-lg bg-white/15 hover:bg-white/25 active:bg-white/30 border border-white text-white text-xs sm:text-sm font-semibold tracking-wide backdrop-blur-sm transition-all duration-200 shadow-sm"
          >
            <FolderUp className="w-4 h-4 text-white" />
            <span>Click to Upload</span>
          </button>
        </div>
      </div>

      {/* Progress / Track Line beneath dropzone matching screenshot */}
      <div className="w-full h-2.5 bg-[#0f1b33] rounded-full overflow-hidden border border-[#16274a]">
        <div
          className="h-full bg-gradient-to-r from-[#00a4ff] to-[#2563eb] transition-all duration-300 rounded-full"
          style={{ width: `${uploadProgress > 0 ? uploadProgress : 0}%` }}
        />
      </div>
    </div>
  );
}
