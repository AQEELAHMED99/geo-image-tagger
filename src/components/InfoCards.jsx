import React from 'react';
import { Mail, Info } from 'lucide-react';

export default function InfoCards({ onOpenSubscribe }) {
  const steps = [
    { num: 1, text: 'Upload JPG / JPEG / PNG / WebP images' },
    { num: 2, text: 'Existing geotags are shown on the map' },
    { num: 3, text: 'Set the marker or enter the latitude and longitude manually' },
    { num: 4, text: 'Optionally add additional EXIF tags' },
    {
      num: 5,
      text: (
        <span>
          Hit the button{' '}
          <span className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-2 py-0.5 rounded text-xs font-semibold shadow-sm inline-block mx-1">
            Write EXIF Tags
          </span>
        </span>
      ),
    },
    { num: 6, text: 'Download the geotagged image' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 w-full">
      {/* Left Card: How to geotag photos */}
      <div className="bg-[#0c1527] border border-[#1a294b] rounded-xl p-5 sm:p-6 shadow-xl flex items-start gap-4">
        {/* Green Info Badge matching screenshot */}
        <div className="w-12 h-12 rounded-full bg-[#10b981] flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-emerald-500/20">
          <span className="text-xl font-bold font-serif leading-none italic">i</span>
        </div>

        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-3">
            How to geotag photos:
          </h3>

          <ul className="flex flex-col gap-2.5">
            {steps.map((step) => (
              <li key={step.num} className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-300">
                <span className="w-5 h-5 rounded-full bg-[#0284c7] text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                  {step.num}
                </span>
                <span className="leading-snug">{step.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Right Card: Stay Connected */}
      <div className="bg-[#0c1527] border border-[#1a294b] rounded-xl p-5 sm:p-6 shadow-xl flex items-start gap-4">
        {/* Purple Mail Badge matching screenshot */}
        <div className="w-12 h-12 rounded-full bg-[#6366f1] flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-indigo-500/20">
          <Mail className="w-6 h-6 stroke-[2.2]" />
        </div>

        <div className="flex-1">
          <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mb-2.5">
            Stay Connected
          </h3>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-3">
            Let's keep in touch!{' '}
            <button
              onClick={onOpenSubscribe}
              className="text-[#38bdf8] hover:text-sky-300 underline font-medium cursor-pointer transition-colors"
            >
              Subscribe
            </button>{' '}
            to our mailing list to receive emails about special offers and discounts, technical issues and
            announced downtimes, news and product updates.
          </p>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            If you have any questions or experience any issues with this website, please let us know at{' '}
            <a
              href="mailto:info@geoimgr.com"
              className="text-[#38bdf8] hover:text-sky-300 underline font-medium transition-colors"
            >
              info@geoimgr.com
            </a>
            . We will answer immediately.
          </p>
        </div>
      </div>
    </div>
  );
}
