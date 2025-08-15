import React from 'react';
import { GameStore } from '../store/GameStore';

interface GameUIProps {
  gameMode: 'surfing' | 'beach' | 'competition';
  playerId: string;
}

export const GameUI: React.FC<GameUIProps> = ({ gameMode, playerId }) => {
  const { player, currentWave, performTrick, activateSpeedBoost, toggleCustomization, toggleShop, toggleLeaderboard, setGameMode } = GameStore.useStore();
  
  // Debug logging to help identify issues
  React.useEffect(() => {
    console.log('GameUI: player', player);
    console.log('GameUI: currentWave', currentWave);
  }, [player, currentWave]);

  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Wave Info (only in surfing mode) */}
      {gameMode === 'surfing' && currentWave && (
        <div className="absolute top-24 right-4 bg-black/20 backdrop-blur-lg text-white p-4 rounded-2xl border border-white/10 pointer-events-auto">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">🌊</span>
              <span className="font-bold text-lg capitalize">{currentWave.quality}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">📏</span>
              <span className="font-semibold">{currentWave.height.toFixed(1)}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-lg">💨</span>
              <span className="font-semibold">{currentWave.speed.toFixed(1)} km/h</span>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Controls */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 pointer-events-auto">
        {gameMode === 'surfing' && (
          <div className="flex space-x-4">
            <button 
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20"
              onClick={performTrick}
            >
              <span className="flex items-center space-x-2">
                <span>🤸</span>
                <span>Perform Trick</span>
              </span>
            </button>
            <button 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20"
              onClick={activateSpeedBoost}
            >
              <span className="flex items-center space-x-2">
                <span>⚡</span>
                <span>Speed Boost</span>
              </span>
            </button>
          </div>
        )}

        {gameMode === 'beach' && (
          <div className="flex space-x-4">
            <button onClick={toggleCustomization} className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20">
              <span className="flex items-center space-x-2">
                <span>🎨</span>
                <span>Customize</span>
              </span>
            </button>
            <button onClick={toggleShop} className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20">
              <span className="flex items-center space-x-2">
                <span>🛍️</span>
                <span>Shop</span>
              </span>
            </button>
            <button onClick={toggleLeaderboard} className="bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-600 hover:to-amber-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20">
              <span className="flex items-center space-x-2">
                <span>🏆</span>
                <span>Leaderboard</span>
              </span>
            </button>
            <button onClick={() => setGameMode('surfing')} className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg backdrop-blur-sm border border-white/20">
              <span className="flex items-center space-x-2">
                <span>🏄</span>
                <span>Go Surfing</span>
              </span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
