import React, { useState, useEffect } from 'react';
import JSZip from 'jszip';
import Header from './components/Header';
import GlobalMap from './components/GlobalMap';
import InteractiveMap from './components/InteractiveMap';
import Dropzone from './components/Dropzone';
import ImageWorkspace from './components/ImageWorkspace';
import InfoCards from './components/InfoCards';
import FaqSection from './components/FaqSection';
import LicenseModal from './components/LicenseModal';
import ActivateModal from './components/ActivateModal';
import PricingModal from './components/PricingModal';
import SignInModal from './components/SignInModal';
import SubscribeModal from './components/SubscribeModal';
import { readImageMetadata, writeExifToImage } from './utils/exifService';
import { reverseGeocode } from './utils/geoUtils';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function App() {
  const [images, setImages] = useState([]);
  const [activeImageId, setActiveImageId] = useState(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [isInteractiveMap, setIsInteractiveMap] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  // User and subscription state
  const [user, setUser] = useState(null);
  const [isPro, setIsPro] = useState(false);

  // Modals
  const [activeModal, setActiveModal] = useState(null); // 'license' | 'activate' | 'pricing' | 'signin' | 'subscribe' | null

  // Toast notifications
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync selected coordinates when active image changes
  useEffect(() => {
    if (!activeImageId) return;
    const active = images.find((img) => img.id === activeImageId);
    if (active && active.latitude !== null && active.longitude !== null) {
      setSelectedCoordinates({ lat: active.latitude, lng: active.longitude });
    }
  }, [activeImageId]);

  // Handle files selected or dropped
  const handleFilesSelected = async (files) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setUploadProgress(15);

    try {
      const parsedImages = [];
      const total = files.length;

      for (let i = 0; i < total; i++) {
        const file = files[i];
        const meta = await readImageMetadata(file);
        parsedImages.push(meta);
        setUploadProgress(Math.round(((i + 1) / total) * 85) + 15);
      }

      setImages((prev) => {
        const newImages = [...prev, ...parsedImages];
        if (!activeImageId && newImages.length > 0) {
          setActiveImageId(newImages[0].id);
          if (newImages[0].latitude !== null && newImages[0].longitude !== null) {
            setSelectedCoordinates({
              lat: newImages[0].latitude,
              lng: newImages[0].longitude,
            });
          }
        }
        return newImages;
      });

      showToast(`Successfully added ${parsedImages.length} image(s)!`);
    } catch (err) {
      console.error('Error reading image files:', err);
      showToast('Error parsing image files.', 'error');
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
    }
  };

  // Handle setting coordinates from map or search
  const handleSelectCoordinates = async (lat, lng) => {
    setSelectedCoordinates({ lat, lng });

    if (activeImageId) {
      setImages((prev) =>
        prev.map((img) =>
          img.id === activeImageId
            ? { ...img, latitude: lat, longitude: lng, hasGeotag: true }
            : img
        )
      );
    }
  };

  // Update specific metadata fields for an image
  const handleUpdateImageMetadata = (id, fields) => {
    setImages((prev) =>
      prev.map((img) => {
        if (img.id === id) {
          const updated = { ...img, ...fields };
          if (fields.latitude !== undefined || fields.longitude !== undefined) {
            updated.hasGeotag = updated.latitude !== null && updated.longitude !== null;
            if (id === activeImageId && updated.latitude && updated.longitude) {
              setSelectedCoordinates({ lat: updated.latitude, lng: updated.longitude });
            }
          }
          return updated;
        }
        return img;
      })
    );
  };

  // Write EXIF tags for single image
  const handleWriteExif = async (id) => {
    const targetImage = images.find((img) => img.id === id);
    if (!targetImage) return;

    setIsProcessing(true);
    try {
      const result = await writeExifToImage(targetImage);

      setImages((prev) =>
        prev.map((img) =>
          img.id === id
            ? {
                ...img,
                isProcessed: true,
                processedBlob: result.blob,
                processedUrl: result.url,
                fileName: result.fileName,
              }
            : img
        )
      );

      showToast(`EXIF GPS & Metadata successfully embedded into ${targetImage.name}!`);
    } catch (err) {
      console.error('Failed to write EXIF tags:', err);
      showToast('Failed to write EXIF tags. Please verify file integrity.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Download single image
  const handleDownloadSingle = async (id) => {
    let target = images.find((img) => img.id === id);
    if (!target) return;

    try {
      let downloadUrl = target.processedUrl;
      let downloadName = target.fileName;

      // If not yet written, write EXIF on the fly
      if (!downloadUrl) {
        setIsProcessing(true);
        const result = await writeExifToImage(target);
        downloadUrl = result.url;
        downloadName = result.fileName;

        setImages((prev) =>
          prev.map((img) =>
            img.id === id
              ? {
                  ...img,
                  isProcessed: true,
                  processedBlob: result.blob,
                  processedUrl: result.url,
                  fileName: result.fileName,
                }
              : img
          )
        );
        setIsProcessing(false);
      }

      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = downloadName || `${target.name.replace(/\.[^/.]+$/, '')}_geotagged.jpg`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      showToast(`Downloaded ${downloadName || 'geotagged image'}!`);
    } catch (err) {
      console.error('Download error:', err);
      showToast('Error preparing image for download.', 'error');
      setIsProcessing(false);
    }
  };

  // Batch download all images as ZIP
  const handleDownloadAllZip = async () => {
    if (images.length === 0) return;
    setIsProcessing(true);

    try {
      const zip = new JSZip();
      const folder = zip.folder('geotagged_images');

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        let blob = img.processedBlob;
        let name = img.fileName;

        if (!blob) {
          const result = await writeExifToImage(img);
          blob = result.blob;
          name = result.fileName;
        }

        folder.file(name || `image_${i + 1}_geotagged.jpg`, blob);
      }

      const content = await zip.generateAsync({ type: 'blob' });
      const zipUrl = URL.createObjectURL(content);

      const a = document.createElement('a');
      a.href = zipUrl;
      a.download = `geotagged_images_${Date.now()}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(zipUrl);

      showToast(`Successfully packaged and downloaded ${images.length} images as ZIP!`);
    } catch (err) {
      console.error('ZIP creation error:', err);
      showToast('Error generating ZIP archive.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  // Bulk copy coordinates of active image to all images
  const handleApplyCoordsToAll = () => {
    const active = images.find((img) => img.id === activeImageId);
    if (!active || active.latitude === null || active.longitude === null) {
      showToast('Please set coordinates for the active image first.', 'error');
      return;
    }

    setImages((prev) =>
      prev.map((img) => ({
        ...img,
        latitude: active.latitude,
        longitude: active.longitude,
        altitude: active.altitude,
        hasGeotag: true,
      }))
    );

    showToast(`Applied coordinates (${active.latitude}, ${active.longitude}) to all ${images.length} images!`);
  };

  // Remove single image
  const handleRemoveImage = (id) => {
    setImages((prev) => {
      const next = prev.filter((img) => img.id !== id);
      if (activeImageId === id) {
        setActiveImageId(next.length > 0 ? next[0].id : null);
      }
      return next;
    });
  };

  // Clear all
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to remove all uploaded images?')) {
      setImages([]);
      setActiveImageId(null);
      setSelectedCoordinates(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#070b16] text-slate-100 flex flex-col justify-between selection:bg-[#0284c7] selection:text-white">
      {/* Header */}
      <Header
        onOpenLicense={() => setActiveModal('license')}
        onOpenActivate={() => setActiveModal('activate')}
        onOpenPricing={() => setActiveModal('pricing')}
        onOpenSignIn={() => setActiveModal('signin')}
        user={user}
        onSignOut={() => {
          setUser(null);
          showToast('Signed out successfully.');
        }}
        isPro={isPro}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-6 flex flex-col gap-6">
        {/* Top Two-Column Grid: Map on Left, Dropzone on Right */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-6 items-start">
          {/* Left Column: Map */}
          <div>
            {isInteractiveMap ? (
              <InteractiveMap
                selectedLocation={selectedCoordinates}
                onSelectCoordinates={handleSelectCoordinates}
                onCloseInteractive={() => setIsInteractiveMap(false)}
              />
            ) : (
              <GlobalMap
                selectedLocation={selectedCoordinates}
                onSelectCoordinates={handleSelectCoordinates}
                onToggleInteractiveMap={() => setIsInteractiveMap(true)}
                activeImage={images.find((img) => img.id === activeImageId)}
              />
            )}
          </div>

          {/* Right Column: Dropzone */}
          <div>
            <Dropzone
              onFilesSelected={handleFilesSelected}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />
          </div>
        </section>

        {/* Middle Section: Image Workspace / Status Bar */}
        <section>
          <ImageWorkspace
            images={images}
            activeImageId={activeImageId}
            onSelectImage={setActiveImageId}
            onRemoveImage={handleRemoveImage}
            onClearAll={handleClearAll}
            onUpdateImageMetadata={handleUpdateImageMetadata}
            onWriteExif={handleWriteExif}
            onDownloadSingle={handleDownloadSingle}
            onDownloadAllZip={handleDownloadAllZip}
            onApplyCoordsToAll={handleApplyCoordsToAll}
            isProcessing={isProcessing}
          />
        </section>

        {/* Bottom Section: Info Cards */}
        <section>
          <InfoCards onOpenSubscribe={() => setActiveModal('subscribe')} />
        </section>

        {/* FAQ Accordion Section */}
        <section>
          <FaqSection />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full bg-[#050811] border-t border-[#121c30] py-6 px-4 text-center text-xs text-[#6e7f9e]">
        <div className="max-w-[1600px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© {new Date().getFullYear()} GeoTagging Images Tool. All rights reserved.</p>
          <p className="flex items-center gap-4">
            <span className="text-[#38bdf8]">Client-side EXIF Engine</span>
            <span>•</span>
            <span>Zero server uploads</span>
            <span>•</span>
            <span>Windows & Mac compatible</span>
          </p>
        </div>
      </footer>

      {/* Modals */}
      <LicenseModal
        isOpen={activeModal === 'license'}
        onClose={() => setActiveModal(null)}
        onApplyLicense={(key) => {
          setIsPro(true);
          showToast(`License ${key} applied! Pro features unlocked.`);
        }}
      />

      <ActivateModal
        isOpen={activeModal === 'activate'}
        onClose={() => setActiveModal(null)}
        onActivateFreeTrial={() => {
          setIsPro(true);
          showToast('Pro features activated successfully!');
        }}
      />

      <PricingModal
        isOpen={activeModal === 'pricing'}
        onClose={() => setActiveModal(null)}
        onSelectPlan={(plan) => {
          setIsPro(true);
          showToast(`Selected ${plan} plan! Pro features unlocked.`);
        }}
      />

      <SignInModal
        isOpen={activeModal === 'signin'}
        onClose={() => setActiveModal(null)}
        onSignIn={(userInfo) => {
          setUser(userInfo);
          showToast(`Welcome back, ${userInfo.name}!`);
        }}
      />

      <SubscribeModal
        isOpen={activeModal === 'subscribe'}
        onClose={() => setActiveModal(null)}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div
            className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl border text-xs sm:text-sm font-semibold backdrop-blur-md ${
              toast.type === 'error'
                ? 'bg-red-950/90 text-red-200 border-red-500/40 shadow-red-500/10'
                : 'bg-[#0f2442]/95 text-sky-200 border-[#0284c7]/50 shadow-sky-500/20'
            }`}
          >
            {toast.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-red-400" />
            ) : (
              <CheckCircle2 className="w-4 h-4 text-[#38bdf8]" />
            )}
            <span>{toast.message}</span>
          </div>
        </div>
      )}
    </div>
  );
}
