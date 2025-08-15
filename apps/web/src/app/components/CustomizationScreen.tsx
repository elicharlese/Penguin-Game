import React from 'react';
import { GameStore } from '../../../../../libs/game-engine/src/store/GameStore';

export const CustomizationScreen: React.FC = () => {
  const { player, updatePlayer, toggleCustomization } = GameStore.useStore();

  if (!player) return null;

  const handlePenguinCustomization = (field: string, value: string) => {
    updatePlayer({
      penguin: {
        ...player.penguin,
        [field]: value
      }
    });
  };

  const handleClothingPurchase = (item: any) => {
    if (player.stats.coins >= 100) {
      updatePlayer({
        clothing: [...player.clothing, item],
        stats: {
          ...player.stats,
          coins: player.stats.coins - 100
        }
      });
    }
  };

  return (
    <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl p-6 m-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-blue-800">🐧 Customize Your Penguin</h2>
          <button 
            onClick={toggleCustomization}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Penguin Appearance */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-blue-700">Appearance</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Body Color</label>
                <input 
                  type="color" 
                  value={player.penguin.bodyColor}
                  onChange={(e) => handlePenguinCustomization('bodyColor', e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Belly Color</label>
                <input 
                  type="color" 
                  value={player.penguin.bellyColor}
                  onChange={(e) => handlePenguinCustomization('bellyColor', e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Beak Color</label>
                <input 
                  type="color" 
                  value={player.penguin.beakColor}
                  onChange={(e) => handlePenguinCustomization('beakColor', e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Eye Color</label>
                <input 
                  type="color" 
                  value={player.penguin.eyeColor}
                  onChange={(e) => handlePenguinCustomization('eyeColor', e.target.value)}
                  className="w-full h-10 rounded"
                />
              </div>
            </div>
          </div>

          {/* Clothing Store */}
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-xl font-semibold mb-4 text-purple-700">Clothing Store</h3>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { id: 'hat1', name: 'Surfer Hat', type: 'hat', color: '#FF6B6B', price: 150 },
                { id: 'shirt1', name: 'Tropical Shirt', type: 'shirt', color: '#4ECDC4', price: 200 },
                { id: 'sunglasses1', name: 'Aviators', type: 'sunglasses', color: '#333333', price: 100 },
                { id: 'necklace1', name: 'Shell Necklace', type: 'necklace', color: '#FFD166', price: 120 }
              ].map((item) => (
                <div key={item.id} className="bg-white p-3 rounded-lg shadow">
                  <div className="text-center mb-2">
                    <div 
                      className="w-12 h-12 mx-auto rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.price} coins</p>
                  </div>
                  <button 
                    onClick={() => handleClothingPurchase(item)}
                    disabled={player.stats.coins < item.price}
                    className={`w-full text-xs py-1 px-2 rounded ${player.stats.coins >= item.price ? 'bg-green-500 hover:bg-green-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                  >
                    {player.stats.coins >= item.price ? 'Buy' : 'Not enough coins'}
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
            onClick={toggleCustomization}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
