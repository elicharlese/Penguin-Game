import { GameStore } from '@penguin-surf/game-engine/store/GameStore';
import { MainMenu } from './components/MainMenu';
import { GameEngine } from '@penguin-surf/game-engine';
import { CustomizationScreen } from './components/CustomizationScreen';
import { ShopScreen } from './components/ShopScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';

export function App() {
  const { player, showCustomization, showShop, showLeaderboard } = GameStore.useStore();

  return (
    <div className="w-full h-screen overflow-hidden">
      {!player ? (
        <MainMenu />
      ) : (
        <div className="relative w-full h-full">
          <GameEngine />
          {showCustomization && <CustomizationScreen />}
          {showShop && <ShopScreen />}
          {showLeaderboard && <LeaderboardScreen />}
        </div>
      )}
    </div>
  );
}
// removed legacy contest UI

// removed legacy contest UI

 

export default App;
