import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { Player, Wave, Competition, GameEvent } from '../../../types/src';

interface GameState {
  player: Player | null;
  currentWave: Wave | null;
  activeCompetition: Competition | null;
  gameMode: 'beach' | 'competition' | 'surfing';
  isPlaying: boolean;
  score: number;
  showCustomization: boolean;
  showShop: boolean;
  showLeaderboard: boolean;
  trickCooldown: number;
  speedBoostActive: boolean;
  speedBoostCooldown: number;
  setPlayer: (player: Player) => void;
  setSpeedBoostActive: (active: boolean) => void;
  updatePlayer: (updates: Partial<Player>) => void;
  setCurrentWave: (wave: Wave | null) => void;
  setGameMode: (mode: 'beach' | 'competition' | 'surfing') => void;
  setIsPlaying: (playing: boolean) => void;
  addScore: (points: number) => void;
  resetScore: () => void;
  performTrick: () => void;
  activateSpeedBoost: () => void;
  updateTrickCooldown: (deltaTime: number) => void;
  updateSpeedBoostCooldown: (deltaTime: number) => void;
  toggleCustomization: () => void;
  toggleShop: () => void;
  toggleLeaderboard: () => void;
  dispatchEvent: (event: GameEvent) => void;
}

export const GameStore = {
  useStore: create<GameState>()(
    subscribeWithSelector((set, get) => ({
      // Initial state
      player: null,
      currentWave: null,
      activeCompetition: null,
      gameMode: 'beach',
      isPlaying: false,
      score: 0,
      showCustomization: false,
      showShop: false,
      showLeaderboard: false,
      trickCooldown: 0,
      speedBoostActive: false,
      speedBoostCooldown: 0,
      setSpeedBoostActive: (active) => set({ speedBoostActive: active }),

      // Player actions
      setPlayer: (player) => set({ player }),
      
      updatePlayer: (updates) => set((state) => ({
        player: state.player ? { ...state.player, ...updates } : null
      })),

      // Wave actions
      setCurrentWave: (wave) => set({ currentWave: wave }),

      // Game state actions
      setGameMode: (mode) => set({ gameMode: mode }),
      setIsPlaying: (playing) => set({ isPlaying: playing }),
      
      addScore: (points) => set((state) => ({ score: state.score + points })),
      resetScore: () => set({ score: 0 }),

      performTrick: () => {
        const state = get();
        if (state.trickCooldown <= 0) {
          // Perform trick logic
          const trickScore = Math.floor(Math.random() * 100) + 50; // Random score between 50 and 150
          set((state) => ({ score: state.score + trickScore, trickCooldown: 5000 })); // 5 second cooldown
        }
      },

      activateSpeedBoost: () => {
        const state = get();
        if (!state.speedBoostActive && state.speedBoostCooldown <= 0) {
          // Activate speed boost logic
          const boostScore = Math.floor(Math.random() * 50) + 20; // Random score between 20 and 70
          set((state) => ({ speedBoostActive: true, speedBoostCooldown: 10000, score: state.score + boostScore })); // 10 second cooldown
        }
      },

      updateTrickCooldown: (deltaTime) => set((state) => ({ trickCooldown: Math.max(0, state.trickCooldown - deltaTime) })),
      updateSpeedBoostCooldown: (deltaTime) => set((state) => ({ speedBoostCooldown: Math.max(0, state.speedBoostCooldown - deltaTime) })),

      // UI actions
      toggleCustomization: () => set((state) => ({ 
        showCustomization: !state.showCustomization,
        showShop: false,
        showLeaderboard: false 
      })),
      
      toggleShop: () => set((state) => ({ 
        showShop: !state.showShop,
        showCustomization: false,
        showLeaderboard: false 
      })),
      
      toggleLeaderboard: () => set((state) => ({ 
        showLeaderboard: !state.showLeaderboard,
        showCustomization: false,
        showShop: false 
      })),

      // Event system
      dispatchEvent: (event) => {
        const state = get();
        
        switch (event.type) {
          case 'WAVE_SPAWNED':
            set({ currentWave: event.payload });
            break;
            
          case 'PLAYER_SCORED':
            if (event.payload.playerId === state.player?.id) {
              set((state) => ({ score: state.score + event.payload.score }));
            }
            break;
            
          case 'COMPETITION_STARTED':
            set({ 
              activeCompetition: event.payload,
              gameMode: 'competition',
              isPlaying: true 
            });
            break;
            
          case 'ITEM_PURCHASED':
            if (event.payload.playerId === state.player?.id) {
              // Handle item purchase logic
              const { item } = event.payload;
              if ('stats' in item) {
                // It's a surfboard
                state.updatePlayer({ surfboard: item });
              } else {
                // It's clothing
                const currentClothing = state.player?.clothing || [];
                state.updatePlayer({ 
                  clothing: [...currentClothing, item] 
                });
              }
            }
            break;
            
          case 'PENGUIN_CUSTOMIZED':
            if (event.payload.playerId === state.player?.id) {
              state.updatePlayer({ penguin: event.payload.customization });
            }
            break;
        }
      },
    }))
  ),

  // Helper functions for common operations
  createDefaultPlayer: (username: string): Player => ({
    id: `player_${Date.now()}`,
    username,
    penguin: {
      id: `penguin_${Date.now()}`,
      name: `${username}'s Penguin`,
      bodyColor: '#2C3E50',
      bellyColor: '#FFFFFF',
      beakColor: '#F39C12',
      eyeColor: '#000000',
      accessories: [],
    },
    surfboard: {
      id: 'default_board',
      name: 'Starter Board',
      design: 'classic',
      color: '#3498DB',
      pattern: '#FFFFFF',
      stats: {
        speed: 50,
        stability: 70,
        maneuverability: 60,
      },
    },
    clothing: [],
    beachHut: {
      id: `hut_${Date.now()}`,
      decorations: [],
      upgrades: [],
    },
    stats: {
      level: 1,
      experience: 0,
      coins: 1000,
      trophies: 0,
    },
  }),

  generateWave: (): Wave => ({
    id: `wave_${Date.now()}`,
    height: Math.random() * 5 + 1, // 1-6 meters
    speed: Math.random() * 20 + 10, // 10-30 km/h
    direction: Math.random() * 360, // 0-360 degrees
    quality: ['poor', 'fair', 'good', 'excellent', 'perfect'][
      Math.floor(Math.random() * 5)
    ] as Wave['quality'],
  }),
};
