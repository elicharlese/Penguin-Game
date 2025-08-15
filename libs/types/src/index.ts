import { z } from 'zod';

// Penguin Character Types
export const PenguinCustomizationSchema = z.object({
  id: z.string(),
  name: z.string(),
  bodyColor: z.string(),
  bellyColor: z.string(),
  beakColor: z.string(),
  eyeColor: z.string(),
  accessories: z.array(z.string()),
});

export const SurfboardSchema = z.object({
  id: z.string(),
  name: z.string(),
  design: z.string(),
  color: z.string(),
  pattern: z.string(),
  stats: z.object({
    speed: z.number().min(0).max(100),
    stability: z.number().min(0).max(100),
    maneuverability: z.number().min(0).max(100),
  }),
});

export const ClothingItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['hat', 'shirt', 'shorts', 'sunglasses', 'necklace']),
  color: z.string(),
  pattern: z.string(),
  rarity: z.enum(['common', 'rare', 'epic', 'legendary']),
});

// Game State Types
export const PlayerSchema = z.object({
  id: z.string(),
  username: z.string(),
  penguin: PenguinCustomizationSchema,
  surfboard: SurfboardSchema,
  clothing: z.array(ClothingItemSchema),
  beachHut: z.object({
    id: z.string(),
    decorations: z.array(z.string()),
    upgrades: z.array(z.string()),
  }),
  stats: z.object({
    level: z.number(),
    experience: z.number(),
    coins: z.number(),
    trophies: z.number(),
  }),
});

export const WaveSchema = z.object({
  id: z.string(),
  height: z.number(),
  speed: z.number(),
  direction: z.number(),
  quality: z.enum(['poor', 'fair', 'good', 'excellent', 'perfect']),
});

export const CompetitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['freestyle', 'speed', 'trick', 'endurance']),
  startTime: z.date(),
  endTime: z.date(),
  participants: z.array(z.string()),
  prizes: z.array(z.object({
    position: z.number(),
    reward: z.string(),
    amount: z.number(),
  })),
});

// 3D Scene Types
export const Vector3Schema = z.object({
  x: z.number(),
  y: z.number(),
  z: z.number(),
});

export const GameObjectSchema = z.object({
  id: z.string(),
  position: Vector3Schema,
  rotation: Vector3Schema,
  scale: Vector3Schema,
  visible: z.boolean(),
});

// Export TypeScript types
export type PenguinCustomization = z.infer<typeof PenguinCustomizationSchema>;
export type Surfboard = z.infer<typeof SurfboardSchema>;
export type ClothingItem = z.infer<typeof ClothingItemSchema>;
export type Player = z.infer<typeof PlayerSchema>;
export type Wave = z.infer<typeof WaveSchema>;
export type Competition = z.infer<typeof CompetitionSchema>;
export type Vector3 = z.infer<typeof Vector3Schema>;
export type GameObject = z.infer<typeof GameObjectSchema>;

// Game Events
export type GameEvent = 
  | { type: 'WAVE_SPAWNED'; payload: Wave }
  | { type: 'PLAYER_SCORED'; payload: { playerId: string; score: number } }
  | { type: 'COMPETITION_STARTED'; payload: Competition }
  | { type: 'ITEM_PURCHASED'; payload: { playerId: string; item: ClothingItem | Surfboard } }
  | { type: 'PENGUIN_CUSTOMIZED'; payload: { playerId: string; customization: PenguinCustomization } };

// Game State Interface
export interface GameState {
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
  setSpeedBoostActive: (active: boolean) => void;
  toggleCustomization: () => void;
  toggleShop: () => void;
  toggleLeaderboard: () => void;
  dispatchEvent: (event: GameEvent) => void;
}
