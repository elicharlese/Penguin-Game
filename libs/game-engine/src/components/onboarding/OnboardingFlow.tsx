import React, { useState } from 'react';
import { GameStore } from '../../store/GameStore';

interface OnboardingStep {
  id: number;
  title: string;
  description: string;
  image?: string;
  highlightElement?: string;
}

const OnboardingFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const { setIsPlaying } = GameStore.useStore();
  
  const steps: OnboardingStep[] = [
    {
      id: 1,
      title: "Welcome to Penguin Surf!",
      description: "Learn how to ride the waves and become the ultimate penguin surfer."
    },
    {
      id: 2,
      title: "Basic Controls",
      description: "Use the left and right arrow keys to steer your penguin across the waves."
    },
    {
      id: 3,
      title: "Perform Tricks",
      description: "Press the spacebar to perform tricks and earn extra points when your cooldown is ready."
    },
    {
      id: 4,
      title: "Speed Boosts",
      description: "Press 'B' to activate a speed boost and surf faster for a limited time."
    },
    {
      id: 5,
      title: "Scoring System",
      description: "Score points by riding waves smoothly and performing tricks. Higher waves give more points!"
    },
    {
      id: 6,
      title: "Ready to Surf!",
      description: "You're all set! Dive into the waves and show your penguin surfing skills."
    }
  ];
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      finishOnboarding();
    }
  };
  
  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleSkip = () => {
    finishOnboarding();
  };
  
  const finishOnboarding = () => {
    setIsVisible(false);
    setIsPlaying(true);
  };
  
  if (!isVisible) return null;
  
  const current = steps[currentStep];
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-blue-50 rounded-xl p-8 max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800 mb-2">{current.title}</h2>
          <div className="w-16 h-1 bg-blue-500 rounded-full mx-auto mb-4"></div>
          <p className="text-gray-700">{current.description}</p>
        </div>
        
        <div className="flex justify-between items-center mt-8">
          <button 
            onClick={handleSkip}
            className="text-gray-500 hover:text-gray-700 font-medium"
          >
            Skip Tutorial
          </button>
          
          <div className="flex space-x-4">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-4 py-2 rounded-lg font-medium ${currentStep === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            >
              Previous
            </button>
            
            <button
              onClick={handleNext}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              {currentStep === steps.length - 1 ? 'Start Surfing!' : 'Next'}
            </button>
          </div>
        </div>
        
        <div className="flex justify-center mt-6 space-x-2">
          {steps.map((_, index) => (
            <div 
              key={index}
              className={`w-3 h-3 rounded-full ${index === currentStep ? 'bg-blue-500' : 'bg-gray-300'}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OnboardingFlow;
