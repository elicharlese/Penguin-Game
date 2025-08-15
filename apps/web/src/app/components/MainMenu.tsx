import React, { useState } from 'react';
import { GameStore } from '@penguin-surf/game-engine/store/GameStore';

export const MainMenu: React.FC = () => {
  const { setPlayer, setGameMode } = GameStore.useStore();
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);

  const handleStartGame = () => {
    if (!showNameInput) {
      setShowNameInput(true);
      return;
    }
    
    const name = playerName.trim() || 'Surfer Penguin';
    const player = GameStore.createDefaultPlayer(name);
    setPlayer(player);
    setGameMode('beach');
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Ocean Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-cyan-400 via-blue-500 to-blue-900">
        {/* Animated wave patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-white/20 to-transparent animate-pulse"></div>
          <div className="absolute bottom-8 left-0 w-full h-24 bg-gradient-to-t from-white/10 to-transparent animate-pulse" style={{ animationDelay: '1s' }}></div>
          <div className="absolute bottom-16 left-0 w-full h-16 bg-gradient-to-t from-white/5 to-transparent animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 text-6xl animate-bounce" style={{ animationDelay: '0s' }}>🐧</div>
        <div className="absolute top-32 right-20 text-4xl animate-bounce" style={{ animationDelay: '1s' }}>🏄</div>
        <div className="absolute bottom-40 left-20 text-5xl animate-bounce" style={{ animationDelay: '2s' }}>🌊</div>
        <div className="absolute top-60 right-10 text-3xl animate-bounce" style={{ animationDelay: '0.5s' }}>⭐</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center mb-8">
          <h1 className="text-8xl font-black text-white mb-4 drop-shadow-2xl tracking-wider">
            PENGUIN
          </h1>
          <h2 className="text-6xl font-bold text-cyan-200 mb-8 drop-shadow-xl">
            SURF
          </h2>
          <p className="text-2xl text-white/90 font-light tracking-wide drop-shadow-lg">
            Ride the Ultimate Wave Adventure
          </p>
        </div>

        {/* Game Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-white/20 max-w-md w-full">
          {!showNameInput ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-white/80 text-lg leading-relaxed">
                  Customize your penguin, master epic waves, and become the ultimate surf champion!
                </p>
              </div>
              
              <button 
                onClick={handleStartGame}
                className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl text-lg"
              >
                <span className="flex items-center justify-center space-x-2">
                  <span>🏄‍♂️</span>
                  <span>Start Your Adventure</span>
                </span>
              </button>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => alert('VR mode coming soon!')}
                  className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-1">
                    <span>🥽</span>
                    <span>VR Mode</span>
                  </span>
                </button>
                
                <button 
                  onClick={() => alert('Settings coming soon!')}
                  className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  <span className="flex items-center justify-center space-x-1">
                    <span>⚙️</span>
                    <span>Settings</span>
                  </span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Create Your Penguin</h3>
                <p className="text-white/80 mb-6">What should we call your surfing penguin?</p>
              </div>
              
              <input
                type="text"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="Enter penguin name..."
                className="w-full bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
                autoFocus
                onKeyPress={(e) => e.key === 'Enter' && handleStartGame()}
              />
              
              <div className="flex space-x-3">
                <button 
                  onClick={handleStartGame}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-4 rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Let's Surf! 🌊
                </button>
                <button 
                  onClick={() => setShowNameInput(false)}
                  className="px-4 py-3 bg-white/20 hover:bg-white/30 text-white rounded-xl transition-all duration-300"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Controls Info */}
        <div className="mt-8 bg-black/20 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
          <div className="text-white/80 text-sm space-y-1 text-center">
            <p><span className="font-semibold">🎮 Movement:</span> WASD or Arrow Keys</p>
            <p><span className="font-semibold">🚀 Jump:</span> Spacebar</p>
            <p><span className="font-semibold">👀 Look Around:</span> Mouse</p>
          </div>
        </div>
      </div>
    </div>
  );
};
