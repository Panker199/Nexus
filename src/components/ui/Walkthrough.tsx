import React, { useState, useEffect } from 'react';
import { X, ChevronRight, ChevronLeft, Lightbulb } from 'lucide-react';

interface Step {
  title: string;
  description: string;
  selector?: string;
}

interface WalkthroughProps {
  steps: Step[];
  storageKey: string;
}

export const Walkthrough: React.FC<WalkthroughProps> = ({ steps, storageKey }) => {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const dismissed = localStorage.getItem(`walkthrough_${storageKey}`);
    if (!dismissed) {
      const timer = setTimeout(() => setOpen(true), 500);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const dismiss = () => {
    localStorage.setItem(`walkthrough_${storageKey}`, 'true');
    setOpen(false);
  };

  const next = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(p => p + 1);
    } else {
      dismiss();
    }
  };

  const prev = () => {
    if (currentStep > 0) setCurrentStep(p => p - 1);
  };

  if (!open) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm">
      <div className="bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden">
        <div className="bg-primary-600 px-5 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <Lightbulb size={18} />
            <span className="text-sm font-semibold">Quick Tour</span>
          </div>
          <button onClick={dismiss} className="p-0.5 rounded hover:bg-white/20 text-white/80 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>
        <div className="px-5 py-4">
          <div className="flex items-center gap-1.5 mb-3">
            {steps.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i === currentStep ? 'w-6 bg-primary-600' : 'w-1.5 bg-gray-300'}`} />
            ))}
          </div>
          <h3 className="text-sm font-semibold text-gray-900 mb-1">{step.title}</h3>
          <p className="text-xs text-gray-600 leading-relaxed">{step.description}</p>
        </div>
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50 border-t border-gray-100">
          <button
            onClick={dismiss}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            Skip all
          </button>
          <div className="flex gap-2">
            {currentStep > 0 && (
              <button onClick={prev} className="p-1.5 rounded hover:bg-gray-200 text-gray-600 transition-colors">
                <ChevronLeft size={16} />
              </button>
            )}
            <button
              onClick={next}
              className="inline-flex items-center gap-1 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 px-3 py-1.5 rounded transition-colors"
            >
              {currentStep < steps.length - 1 ? <>Next <ChevronRight size={14} /></> : 'Got it!'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
