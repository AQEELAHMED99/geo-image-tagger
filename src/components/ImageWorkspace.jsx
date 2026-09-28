import React, { useState } from 'react';
import {
  Image as ImageIcon,
  MapPin,
  Download,
  Trash2,
  CheckCircle,
  FileArchive,
  Save,
  Tag,
  Clock,
  User,
  Shield,
  FileText,
  Copy,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { decimalToDMS } from '../utils/geoUtils';

export default function ImageWorkspace({
  images,
  activeImageId,
  onSelectImage,
  onRemoveImage,
  onClearAll,
  onUpdateImageMetadata,
  onWriteExif,
  onDownloadSingle,
  onDownloadAllZip,
  onApplyCoordsToAll,
  isProcessing
}) {
  const [copiedCoords, setCopiedCoords] = useState(false);

  // If no images uploaded, show empty state matching screenshot
  if (!images || images.length === 0) {
    return (
      <div className="w-full bg-[#0c1527] border border-[#1a294b] rounded-xl py-3.5 px-6 text-center flex items-center justify-center gap-2.5 text-[#8899b5] text-sm font-medium shadow-md">
        <ImageIcon className="w-4 h-4 text-[#0284c7]" />
        <span>No images uploaded, yet!</span>
      </div>
    );
  }

  const activeImage = images.find((img) => img.id === activeImageId) || images[0];

  const latDms = activeImage?.latitude !== null && activeImage?.latitude !== undefined
    ? decimalToDMS(activeImage.latitude, true).formatted
    : 'Not set';

  const lngDms = activeImage?.longitude !== null && activeImage?.longitude !== undefined
    ? decimalToDMS(activeImage.longitude, false).formatted
    : 'Not set';

  const handleCopyCoords = () => {
    if (activeImage?.latitude && activeImage?.longitude) {
      navigator.clipboard.writeText(`${activeImage.latitude}, ${activeImage.longitude}`);
      setCopiedCoords(true);
      setTimeout(() => setCopiedCoords(false), 2000);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="w-full bg-[#0c1527] border border-[#1a294b] rounded-xl p-4 sm:p-5 shadow-xl flex flex-col gap-5">
      {/* Top Bar: Header, Counts, and Global Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-[#16274a] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-[#142347] text-[#38bdf8]">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Uploaded Images
              <span className="bg-[#16294d] text-sky-400 text-xs px-2 py-0.5 rounded-full font-semibold border border-[#223d70]">
                {images.length}
              </span>
            </h3>
            <p className="text-xs text-[#8899b5]">
              Select an image to preview, inspect metadata, and geotag
            </p>
          </div>
        </div>

        <div className="flex items-center flex-wrap gap-2 w-full sm:w-auto">
          {/* Apply coordinates to all images */}
          <button
            onClick={onApplyCoordsToAll}
            disabled={activeImage?.latitude === null || activeImage?.latitude === undefined}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#142347] hover:bg-[#1a3061] disabled:opacity-50 text-sky-300 border border-[#20396b] text-xs font-semibold rounded-lg transition-all"
            title="Copy current active image coordinates to all uploaded images"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Apply Coords to All</span>
          </button>

          {/* Download all as zip */}
          <button
            onClick={onDownloadAllZip}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#10b981]/20 hover:bg-[#10b981]/30 text-emerald-400 border border-emerald-500/30 text-xs font-semibold rounded-lg transition-all"
            title="Download all processed images as a ZIP archive"
          >
            <FileArchive className="w-3.5 h-3.5" />
            <span>Download All (ZIP)</span>
          </button>

          {/* Clear all */}
          <button
            onClick={onClearAll}
            className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors border border-transparent hover:border-red-500/30"
            title="Remove all uploaded images"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Image Thumbnails Carousel / Strip */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
        {images.map((img) => {
          const isSelected = img.id === activeImageId;
          const hasGps = img.latitude !== null && img.latitude !== undefined;

          return (
            <div
              key={img.id}
              onClick={() => onSelectImage(img.id)}
              className={`relative flex-shrink-0 w-28 sm:w-32 bg-[#101b33] rounded-lg border p-2 cursor-pointer transition-all duration-200 group ${
                isSelected
                  ? 'border-[#0284c7] ring-2 ring-[#0284c7]/40 shadow-lg shadow-sky-500/10'
                  : 'border-[#1a2c4e] hover:border-slate-500'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="w-full h-20 bg-[#080d1a] rounded overflow-hidden relative flex items-center justify-center">
                <img
                  src={img.previewUrl}
                  alt={img.name}
                  className="w-full h-full object-cover"
                />

                {/* GPS Status Indicator */}
                <div
                  className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    hasGps
                      ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 backdrop-blur-sm'
                      : 'bg-amber-950/80 text-amber-300 border border-amber-500/40 backdrop-blur-sm'
                  }`}
                >
                  <MapPin className="w-2.5 h-2.5" />
                  <span>{hasGps ? 'Tagged' : 'No GPS'}</span>
                </div>

                {/* Remove single image button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveImage(img.id);
                  }}
                  className="absolute top-1 right-1 p-1 rounded bg-black/60 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove image"
                >
                  <Trash2 className="w-2.5 h-2.5" />
                </button>
              </div>

              {/* Name & Size */}
              <div className="mt-1.5">
                <p className="text-[11px] font-medium text-slate-200 truncate" title={img.name}>
                  {img.name}
                </p>
                <p className="text-[10px] text-slate-400">
                  {formatFileSize(img.size)} {img.width ? `• ${img.width}x${img.height}` : ''}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Active Image Details & EXIF Editor Panel */}
      {activeImage && (
        <div className="bg-[#0e1930] border border-[#1b2f57] rounded-xl p-4 sm:p-5 flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 border-b border-[#182c52] pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-[#080d1a] border border-[#1b2f57] overflow-hidden flex items-center justify-center flex-shrink-0">
                <img
                  src={activeImage.previewUrl}
                  alt={activeImage.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h4 className="text-sm sm:text-base font-bold text-white truncate max-w-sm sm:max-w-md">
                  {activeImage.name}
                </h4>
                <div className="flex items-center gap-2 text-xs text-[#8899b5] mt-0.5">
                  <span>{formatFileSize(activeImage.size)}</span>
                  <span>•</span>
                  <span>{activeImage.width} × {activeImage.height} px</span>
                  <span>•</span>
                  <span className="uppercase">{activeImage.type ? activeImage.type.split('/')[1] : 'JPG'}</span>
                </div>
              </div>
            </div>

            {/* Main Action Buttons */}
            <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto">
              {/* Step 5: Write EXIF Tags button matching screenshot */}
              <button
                onClick={() => onWriteExif(activeImage.id)}
                disabled={isProcessing}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#2563eb] hover:bg-[#1d4ed8] active:scale-95 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all"
              >
                <Save className="w-4 h-4" />
                <span>Write EXIF Tags</span>
              </button>

              {/* Step 6: Download Geotagged Image */}
              <button
                onClick={() => onDownloadSingle(activeImage.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#10b981] hover:bg-[#059669] active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md shadow-emerald-500/15 transition-all"
              >
                <Download className="w-4 h-4" />
                <span>Download Geotagged Image</span>
              </button>
            </div>
          </div>

          {/* Form Grid: GPS Coordinates on Left, Additional EXIF Tags on Right */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: GPS Location Data */}
            <div className="flex flex-col gap-3.5 bg-[#0b1324] border border-[#182a4d] rounded-lg p-3.5 sm:p-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  GPS Location Data
                </span>
                <button
                  onClick={handleCopyCoords}
                  className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copiedCoords ? 'Copied!' : 'Copy Coords'}</span>
                </button>
              </div>

              {/* Latitude and Longitude */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Latitude (Decimal)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={activeImage.latitude ?? ''}
                    onChange={(e) =>
                      onUpdateImageMetadata(activeImage.id, {
                        latitude: e.target.value === '' ? null : parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g. 37.774929"
                    className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-2 outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block truncate">
                    DMS: {latDms}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Longitude (Decimal)
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={activeImage.longitude ?? ''}
                    onChange={(e) =>
                      onUpdateImageMetadata(activeImage.id, {
                        longitude: e.target.value === '' ? null : parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g. -122.419416"
                    className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-2 outline-none font-mono"
                  />
                  <span className="text-[10px] text-slate-400 mt-1 block truncate">
                    DMS: {lngDms}
                  </span>
                </div>
              </div>

              {/* Altitude & Datetime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Altitude (meters)
                  </label>
                  <input
                    type="number"
                    value={activeImage.altitude ?? ''}
                    onChange={(e) =>
                      onUpdateImageMetadata(activeImage.id, {
                        altitude: e.target.value === '' ? null : parseFloat(e.target.value),
                      })
                    }
                    placeholder="e.g. 15"
                    className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-2 outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Date Taken</span>
                    <button
                      type="button"
                      onClick={() =>
                        onUpdateImageMetadata(activeImage.id, {
                          dateTime: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        })
                      }
                      className="text-[10px] text-sky-400 hover:underline"
                    >
                      Set Now
                    </button>
                  </label>
                  <input
                    type="text"
                    value={activeImage.dateTime || ''}
                    onChange={(e) =>
                      onUpdateImageMetadata(activeImage.id, { dateTime: e.target.value })
                    }
                    placeholder="YYYY:MM:DD HH:MM:SS"
                    className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-2 outline-none font-mono"
                  />
                </div>
              </div>

              <div className="text-[11px] text-slate-400 flex items-start gap-1.5 bg-[#101b33] p-2 rounded border border-[#16274a]">
                <Info className="w-3.5 h-3.5 text-sky-400 mt-0.5 flex-shrink-0" />
                <span>
                  Click anywhere on the map above or search any address to set these coordinates automatically.
                </span>
              </div>
            </div>

            {/* Right: Additional EXIF Tags */}
            <div className="flex flex-col gap-3 bg-[#0b1324] border border-[#182a4d] rounded-lg p-3.5 sm:p-4">
              <span className="text-xs font-bold text-[#38bdf8] uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5" />
                Additional EXIF & Windows XP Tags
              </span>

              {/* Image Title */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Document Title / Headline
                </label>
                <input
                  type="text"
                  value={activeImage.title || ''}
                  onChange={(e) =>
                    onUpdateImageMetadata(activeImage.id, { title: e.target.value })
                  }
                  placeholder="e.g. Golden Gate Bridge Sunset"
                  className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-1.5 outline-none"
                />
              </div>

              {/* Description / Caption */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Description / Caption (XPComment)
                </label>
                <input
                  type="text"
                  value={activeImage.description || ''}
                  onChange={(e) =>
                    onUpdateImageMetadata(activeImage.id, { description: e.target.value })
                  }
                  placeholder="e.g. High resolution scenic photograph for local business profile"
                  className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-1.5 outline-none"
                />
              </div>

              {/* Keywords */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                  Keywords / Tags (comma separated)
                </label>
                <input
                  type="text"
                  value={activeImage.keywords || ''}
                  onChange={(e) =>
                    onUpdateImageMetadata(activeImage.id, { keywords: e.target.value })
                  }
                  placeholder="e.g. travel, california, san francisco, architecture"
                  className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-1.5 outline-none"
                />
              </div>

              {/* Author & Copyright */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Author / Artist
                  </label>
                  <input
                    type="text"
                    value={activeImage.author || ''}
                    onChange={(e) =>
                      onUpdateImageMetadata(activeImage.id, { author: e.target.value })
                    }
                    placeholder="e.g. John Doe Photography"
                    className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-1.5 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1">
                    Copyright Notice
                  </label>
                  <input
                    type="text"
                    value={activeImage.copyright || ''}
                    onChange={(e) =>
                      onUpdateImageMetadata(activeImage.id, { copyright: e.target.value })
                    }
                    placeholder="e.g. © 2026 All Rights Reserved"
                    className="w-full bg-[#111d36] border border-[#1e325c] focus:border-[#38bdf8] text-white text-xs rounded-md px-3 py-1.5 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
