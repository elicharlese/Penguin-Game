import React, { useState, useEffect } from 'react';
import { GameStore } from '../../../../../libs/game-engine/src/store/GameStore';

export const LeaderboardScreen: React.FC = () => {
  const { toggleLeaderboard } = GameStore.useStore();
  
  // Mock leaderboard data - in a real implementation, this would come from a backend
  const [leaderboardData, setLeaderboardData] = useState([
    { id: '1', username: 'SurfMaster', score: 15420, level: 25 },
    { id: '2', username: 'WaveRider', score: 12350, level: 22 },
    { id: '3', username: 'PenguinPro', score: 9870, level: 18 },
    { id: '4', username: 'OceanKing', score: 7650, level: 15 },
    { id: '5', username: 'BeachBum', score: 5420, level: 12 },
    { id: '6', username: 'TideRider', score: 3210, level: 8 },
    { id: '7', username: 'SurfNewbie', score: 1250, level: 3 },
  ]);

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">🏆 Global Leaderboard</h2>
          <button 
            onClick={toggleLeaderboard}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="mb-6 p-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg text-white text-center">
          <p className="text-lg font-semibold">Compete with players worldwide!</p>
          <p className="text-sm opacity-90">Your rank: Coming soon when you play more!</p>
        </div>

        <div className="space-y-4">
          {leaderboardData.map((player, index) => (
            <div 
              key={player.id}
              className={`flex items-center p-4 rounded-lg ${index < 3 ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50'}`}
            >
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100 text-blue-800 font-bold mr-4">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-900">{player.username}</div>
                <div className="text-sm text-gray-500">Level {player.level}</div>
              </div>
              <div className="text-right">
                <div className="font-bold text-blue-600">{player.score.toLocaleString()} pts</div>
                <div className="text-sm text-gray-500">
                  {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : ''}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>Leaderboard updates every hour</p>
          <p className="mt-2">Play more to climb the ranks!</p>
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            onClick={toggleLeaderboard}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Back to Game
          </button>
        </div>
      </div>
    </div>
  );
};
