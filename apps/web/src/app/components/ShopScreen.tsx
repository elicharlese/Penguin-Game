import React from 'react';
import { GameStore } from '@penguin-surf/game-engine/store/GameStore';

export const ShopScreen: React.FC = () => {
  const { player, updatePlayer, toggleShop } = GameStore.useStore();

  if (!player) return null;

  const handleSurfboardPurchase = (board: any) => {
    if (player.stats.coins >= board.price) {
      updatePlayer({
        surfboard: board,
        stats: {
          ...player.stats,
          coins: player.stats.coins - board.price
        }
      });
    }
  };

  const handleBeachHutUpgrade = (upgrade: any) => {
    if (player.stats.coins >= upgrade.price) {
      updatePlayer({
        beachHut: {
          ...player.beachHut,
          upgrades: [...player.beachHut.upgrades, upgrade.id]
        },
        stats: {
          ...player.stats,
          coins: player.stats.coins - upgrade.price
        }
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">🏪 Penguin Shop</h2>
          <button 
            onClick={toggleShop}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Surfboards */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">🏄 Surfboards</h3>
            
            <div className="space-y-4">
              {[
                { 
                  id: 'board1', 
                  name: 'Starter Board', 
                  color: '#3498DB', 
                  price: 0,
                  stats: { speed: 50, stability: 70, maneuverability: 60 }
                },
                { 
                  id: 'board2', 
                  name: 'Speed Demon', 
                  color: '#E74C3C', 
                  price: 500,
                  stats: { speed: 85, stability: 40, maneuverability: 80 }
                },
                { 
                  id: 'board3', 
                  name: 'Stable Cruiser', 
                  color: '#2ECC71', 
                  price: 750,
                  stats: { speed: 60, stability: 90, maneuverability: 50 }
                },
                { 
                  id: 'board4', 
                  name: 'Trick Master', 
                  color: '#9B59B6', 
                  price: 1000,
                  stats: { speed: 70, stability: 60, maneuverability: 95 }
                }
              ].map((board) => (
                <div key={board.id} className="bg-white p-4 rounded-lg shadow">
                  <div className="flex items-center mb-2">
                    <div 
                      className="w-16 h-4 rounded mr-3"
                      style={{ backgroundColor: board.color }}
                    ></div>
                    <div>
                      <h4 className="font-medium">{board.name}</h4>
                      <p className="text-sm text-gray-500">{board.price} coins</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="text-center">
                      <div className="font-medium">Speed</div>
                      <div className="text-blue-600">{board.stats.speed}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Stability</div>
                      <div className="text-green-600">{board.stats.stability}</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium">Maneuver</div>
                      <div className="text-purple-600">{board.stats.maneuverability}</div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => handleSurfboardPurchase(board)}
                    disabled={player.stats.coins < board.price || player.surfboard.id === board.id}
                    className={`w-full text-sm py-1 px-2 rounded ${player.stats.coins >= board.price && player.surfboard.id !== board.id ? 'bg-blue-500 hover:bg-blue-600 text-white' : player.surfboard.id === board.id ? 'bg-gray-300 text-gray-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {player.surfboard.id === board.id ? 'Equipped' : player.stats.coins >= board.price ? 'Buy' : 'Not enough coins'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Beach Hut Upgrades */}
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-yellow-700">🏖️ Beach Hut Upgrades</h3>
            
            <div className="space-y-4">
              {[
                { id: 'decoration1', name: 'Surfboard Rack', price: 300 },
                { id: 'decoration2', name: 'Palm Tree', price: 500 },
                { id: 'decoration3', name: 'Beach Chair', price: 200 },
                { id: 'upgrade1', name: 'Bigger Hut', price: 1000 },
                { id: 'upgrade2', name: 'Mini Fridge', price: 800 }
              ].map((upgrade) => (
                <div key={upgrade.id} className="bg-white p-4 rounded-lg shadow flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{upgrade.name}</h4>
                    <p className="text-sm text-gray-500">{upgrade.price} coins</p>
                  </div>
                  <button 
                    onClick={() => handleBeachHutUpgrade(upgrade)}
                    disabled={player.stats.coins < upgrade.price || player.beachHut.upgrades.includes(upgrade.id)}
                    className={`py-1 px-3 rounded text-sm ${player.stats.coins >= upgrade.price && !player.beachHut.upgrades.includes(upgrade.id) ? 'bg-yellow-500 hover:bg-yellow-600 text-white' : player.beachHut.upgrades.includes(upgrade.id) ? 'bg-gray-300 text-gray-500' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {player.beachHut.upgrades.includes(upgrade.id) ? 'Owned' : player.stats.coins >= upgrade.price ? 'Buy' : 'Not enough'}
                  </button>
                </div>
              ))}
            </div>
            
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm font-medium text-yellow-800">💰 Coins: {player.stats.coins}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button 
            onClick={toggleShop}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Done Shopping
          </button>
        </div>
      </div>
    </div>
  );
};
