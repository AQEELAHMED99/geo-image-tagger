import React from 'react';
import { X, Check, ShoppingCart, Star } from 'lucide-react';

export default function PricingModal({ isOpen, onClose, onSelectPlan }) {
  if (!isOpen) return null;

  const plans = [
    {
      name: 'Starter',
      price: '$9',
      period: 'per month',
      description: 'Ideal for small local businesses & individual photographers',
      features: [
        'Up to 100 images / month',
        'Standard EXIF GPS embedding',
        'Address & coordinates search',
        'Windows XP tags support',
        'Standard processing speed'
      ],
      popular: false,
      buttonText: 'Get Starter'
    },
    {
      name: 'Professional',
      price: '$24',
      period: 'per month',
      description: 'Best for local SEO agencies, digital marketers & realtors',
      features: [
        'Unlimited photos & batch exports',
        'High-speed batch ZIP downloads',
        'Custom author & copyright branding',
        'Priority geocoding & reverse lookups',
        'Windows Explorer Details compatibility',
        '24/7 dedicated email support'
      ],
      popular: true,
      buttonText: 'Upgrade to Pro'
    },
    {
      name: 'Lifetime',
      price: '$79',
      period: 'one-time payment',
      description: 'Pay once, use forever without recurring monthly fees',
      features: [
        'Everything in Professional',
        'Lifetime access & updates',
        'Commercial agency license',
        'No monthly subscriptions',
        'Direct developer assistance'
      ],
      popular: false,
      buttonText: 'Get Lifetime'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#0c1527] border border-[#1e325c] rounded-2xl p-6 sm:p-8 shadow-2xl my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0284c7]/20 border border-[#0284c7]/30 text-sky-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShoppingCart className="w-3.5 h-3.5" />
            <span>Upgrade to Pro</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Choose the Perfect Plan
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Supercharge your local search rankings with geotagged photography
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-xl p-5 sm:p-6 flex flex-col justify-between border transition-all duration-200 ${
                plan.popular
                  ? 'bg-[#111e38] border-[#0284c7] ring-1 ring-[#0284c7] shadow-xl shadow-sky-500/10'
                  : 'bg-[#0a1222] border-[#18294d] hover:border-slate-600'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0284c7] text-white text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full flex items-center gap-1 shadow-md">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Most Popular</span>
                </div>
              )}

              <div>
                <h3 className="text-base font-bold text-white">{plan.name}</h3>
                <p className="text-[11px] text-slate-400 mt-0.5 min-h-[32px]">{plan.description}</p>

                <div className="my-4 flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-white tracking-tight">{plan.price}</span>
                  <span className="text-xs text-slate-400">/{plan.period}</span>
                </div>

                <div className="space-y-2 border-t border-[#182c52] pt-4 my-2">
                  {plan.features.map((feat, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-[#38bdf8] flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectPlan(plan.name);
                  onClose();
                }}
                className={`mt-6 w-full py-2.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95 ${
                  plan.popular
                    ? 'bg-[#0284c7] hover:bg-[#0369a1] text-white shadow-sky-500/20'
                    : 'bg-[#142347] hover:bg-[#1a3061] text-sky-300 border border-[#203b70]'
                }`}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
