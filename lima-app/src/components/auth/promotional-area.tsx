'use client';

import { useState, useEffect } from 'react';

const promotionalMessages = [
  "Tired of sounding like a bot? Lima learns how you write and sends emails that feel personal — not templated — at scale.",
  "Transform your email outreach with AI that understands your unique voice and writing style.",
  "Scale your personal communication without losing the human touch that makes you stand out.",
  "Join thousands of professionals who've revolutionized their email game with Lima's AI-powered platform."
];

export function PromotionalArea() {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsTransitioning(true);
      
      // Wait for fade out, then change message and fade in
      setTimeout(() => {
        setCurrentMessageIndex((prev) => (prev + 1) % promotionalMessages.length);
        setIsTransitioning(false);
      }, 300); // Half of the transition duration
    }, 5000); // Change message every 5 seconds for smoother experience

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col justify-between h-full p-8 lg:p-12">
      {/* Lima Logo and Branding */}
      <div className="flex flex-col">
        <div className="mb-2">
          <h1 className="text-3xl lg:text-4xl font-bold text-white tracking-tight">
            Lima
          </h1>
        </div>
        <p className="text-orange-400 text-sm lg:text-base font-medium">
          AI Powered Growth OS
        </p>
      </div>

      {/* Promotional Carousel */}
      <div className="relative">
        <div className="min-h-[120px] lg:min-h-[100px] flex items-center">
          <p className={`text-white text-lg lg:text-xl leading-relaxed transition-all duration-700 ease-in-out transform ${
            isTransitioning 
              ? 'opacity-0 translate-y-2' 
              : 'opacity-100 translate-y-0'
          }`}>
            {promotionalMessages[currentMessageIndex]}
          </p>
        </div>
        
        {/* Carousel Indicators */}
        <div className="flex space-x-2 mt-6">
          {promotionalMessages.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                if (index !== currentMessageIndex) {
                  setIsTransitioning(true);
                  setTimeout(() => {
                    setCurrentMessageIndex(index);
                    setIsTransitioning(false);
                  }, 300);
                }
              }}
              className={`w-2 h-2 rounded-full transition-all duration-500 ease-out ${
                index === currentMessageIndex
                  ? 'bg-orange-400 w-8 shadow-lg'
                  : 'bg-white/30 hover:bg-white/50 hover:scale-110'
              }`}
              aria-label={`Go to message ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}