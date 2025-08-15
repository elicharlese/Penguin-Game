import React from 'react';
import { Button } from '../../atoms/Button';
import { GameStore } from '@penguin-surf/game-engine/store/GameStore';

interface GameHeaderProps {
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({
  onMenuClick,
  onSettingsClick,
}) => {
  const { player, gameMode } = GameStore.useStore();
  if (!player) return null;
  
  const getModeLabel = () => {
    switch (gameMode) {
      case 'surfing': return 'Surfing';
      case 'beach': return 'Beach';
      case 'competition': return 'Competition';
      default: return 'Game';
    }
  };
  
  return (
    <header className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Button variant="secondary" size="sm" onClick={onMenuClick}>
            Menu
          </Button>
          <h1 className="text-xl font-bold">Penguin Surf</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="text-center">
            <div className="text-sm text-gray-300">Mode</div>
            <div className="font-medium">{getModeLabel()}</div>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
              <span className="text-xs font-bold">{player.username.charAt(0)}</span>
            </div>
            <div>
              <div className="text-sm font-medium">{player.username}</div>
              <div className="text-xs text-gray-300">Level {player.stats.level}</div>
            </div>
          </div>
          
          <Button variant="secondary" size="sm" onClick={onSettingsClick}>
            Settings
          </Button>
        </div>
      </div>
    </header>
  );
};

export default GameHeader;
