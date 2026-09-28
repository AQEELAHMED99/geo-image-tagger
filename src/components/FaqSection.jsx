import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0); // Open the first item by default matching screenshot

  const faqItems = [
    {
      question: 'Is Google Stripping Metadata and Geotags from Uploaded Images?',
      answer: (
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            When you upload photos to Google Business Profile (formerly Google My Business), Google Maps, or your own website, Google parses and reads all embedded EXIF GPS tags during ingestion. This geographic data is indexed and used to connect your visual assets directly to your business location and local search queries.
          </p>
          <p>
            While Google may compress or remove public EXIF tags when rendering thumbnail previews to end users (primarily for user privacy and web page bandwidth optimization), the backend ranking algorithm has already indexed the geographical coordinates and metadata associated with your images.
          </p>
        </div>
      ),
    },
    {
      question: 'Why should I geotag photos for Local SEO and Google Business Profile?',
      answer: (
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Geotagging embeds verified latitude, longitude, and descriptive metadata directly into image files. Search engines use this data to confirm your physical business location, service area relevance, and authentic local presence.
          </p>
          <p>
            Photos with accurate location tags improve your ranking in local search results, Google Maps "Local 3-Pack", and image search results for geographically targeted keywords.
          </p>
        </div>
      ),
    },
    {
      question: 'Which image file formats are supported?',
      answer: (
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            Our tool supports all popular web and photography formats: <strong>JPG, JPEG, PNG, and WebP</strong>.
          </p>
          <p>
            When downloading geotagged images, full standard EXIF GPS tags and Windows XP metadata tags are embedded into high-resolution JPG files to ensure 100% compatibility across Windows File Explorer, macOS Finder, Adobe Photoshop, and search engines.
          </p>
        </div>
      ),
    },
    {
      question: 'How can I view geotags on Windows and Mac after downloading?',
      answer: (
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>On Windows:</strong> Right-click the downloaded photo → select <em>Properties</em> → click the <em>Details</em> tab. Scroll down to the <strong>GPS</strong> section to see Latitude, Longitude, and Altitude, as well as Title, Subject, Tags, and Authors.
          </p>
          <p>
            <strong>On Mac:</strong> Open the photo in <em>Preview</em> → press <kbd className="bg-slate-800 px-1 py-0.5 rounded border border-slate-600">Cmd + I</kbd> (Inspector) → click the <em>GPS</em> tab to inspect coordinates on the built-in map.
          </p>
        </div>
      ),
    },
    {
      question: 'Is my data secure? Are images uploaded to your servers?',
      answer: (
        <div className="space-y-2.5 text-xs sm:text-sm text-slate-300 leading-relaxed">
          <p>
            <strong>100% Client-Side Privacy:</strong> All EXIF extraction, parsing, and writing occurs directly inside your web browser using HTML5 Canvas and client-side binary parsers.
          </p>
          <p>
            Your photos are never uploaded to remote servers or stored in any third-party database.
          </p>
        </div>
      ),
    },
  ];

  const toggleItem = (idx) => {
    setOpenIndex(openIndex === idx ? -1 : idx);
  };

  return (
    <div className="w-full bg-[#0c1527] border border-[#1a294b] rounded-xl p-5 sm:p-6 shadow-xl flex flex-col gap-4">
      {/* FAQ Header matching screenshot */}
      <div className="flex items-center gap-3.5 border-b border-[#16274a] pb-4">
        <div className="w-10 h-10 rounded-full bg-[#0284c7] flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-sky-500/20">
          <span className="text-xl font-bold font-serif leading-none">?</span>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
            FAQ
          </h3>
          <p className="text-xs sm:text-sm text-[#8899b5]">
            Understanding Geotagging of Images: Meaning and Benefits
          </p>
        </div>
      </div>

      {/* Accordion List */}
      <div className="flex flex-col gap-2.5">
        {faqItems.map((item, idx) => {
          const isOpen = openIndex === idx;

          return (
            <div
              key={idx}
              className={`rounded-lg border transition-all duration-200 overflow-hidden ${
                isOpen
                  ? 'bg-[#0f1b33] border-[#223d70]'
                  : 'bg-[#0a1222] border-[#16274a] hover:border-[#1e3561]'
              }`}
            >
              <button
                type="button"
                onClick={() => toggleItem(idx)}
                className="w-full px-4 py-3.5 flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white gap-3 select-none"
              >
                <span>{item.question}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                    isOpen ? 'rotate-180 text-[#38bdf8]' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-4 pb-4 pt-1 border-t border-[#16274a]/60 animate-fadeIn">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
