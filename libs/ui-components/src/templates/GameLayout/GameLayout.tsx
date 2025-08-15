import React from 'react';
import { GameHeader } from '../../organisms/GameHeader';

interface GameLayoutProps {
  children: React.ReactNode;
  onMenuClick?: () => void;
  onSettingsClick?: () => void;
}

export const GameLayout: React.FC<GameLayoutProps> = ({
  children,
  onMenuClick,
  onSettingsClick,
}) => {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <GameHeader 
        onMenuClick={onMenuClick}
        onSettingsClick={onSettingsClick}
      />
      <main className="flex-grow container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto px-4 text-center text-sm text-gray-400">
          © {new Date().getFullYear()} Penguin Surf Game. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default GameLayout;
