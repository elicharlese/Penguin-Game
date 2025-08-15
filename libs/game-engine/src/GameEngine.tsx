import { Canvas, useFrame } from '@react-three/fiber';
import { Physics } from '@react-three/cannon';
import { Environment, Sky, OrbitControls } from '@react-three/drei';
import React, { Suspense, useRef } from 'react';
import { Ocean } from './components/Ocean';
import { Penguin } from './components/Penguin';
import { PenguinGLTF } from './components/PenguinGLTF';
import { SplineBackground } from './components/SplineBackground';
import { BeachHut } from './components/BeachHut';
import { GameStore } from './store/GameStore';
import { WavePhysics } from './physics/WavePhysics';
import OnboardingFlow from './components/onboarding/OnboardingFlow';
import { GameUI } from './components/GameUI';

export const GameEngine: React.FC = () => {
  const store = GameStore.useStore();
  const player = store.player;
  const gameMode = store.gameMode;
  const splineUrl = (import.meta as any)?.env?.VITE_SPLINE_SCENE_URL as string | undefined;
  const penguinGltfUrl = (import.meta as any)?.env?.VITE_PENGUIN_GLTF_URL as string | undefined;
  
  // Debug logging to help identify issues
  React.useEffect(() => {
    console.log('GameEngine: player state', player);
    console.log('GameEngine: gameMode', gameMode);
  }, [player, gameMode]);
  
  // Initialize wave physics system
  const wavePhysicsRef = useRef<WavePhysics>(new WavePhysics());
  const penguinRef = useRef<{ position: [number, number, number]; velocity: [number, number, number] }>(null);
  
  // Game loop for physics updates
  useFrame((state, delta) => {
    // Update wave physics
    wavePhysicsRef.current.update(delta * 1000); // Convert to milliseconds
    
    // Update current wave in store
    const currentWave = wavePhysicsRef.current.getCurrentWave();
    if (currentWave) {
      store.setCurrentWave(currentWave);
    }
    
    // Calculate and update score when in surfing mode
    if (gameMode === 'surfing' && player && penguinRef.current) {
      // Get penguin position and velocity from physics
      const position = {
        x: penguinRef.current.position[0],
        y: penguinRef.current.position[1],
        z: penguinRef.current.position[2]
      };
      
      const velocity = {
        x: penguinRef.current.velocity[0],
        y: penguinRef.current.velocity[1],
        z: penguinRef.current.velocity[2]
      };
      
      const score = wavePhysicsRef.current.calculateSurfScore(
        position as any,
        velocity as any,
        state.clock.getElapsedTime(),
        delta
      );
      
      // Add score to player's total
      if (score > 0) {
        store.addScore(score * delta); // Scale by delta time
      }
      
      // Update cooldown timers
      if (store.trickCooldown > 0) {
        store.updateTrickCooldown(delta * 1000);
      }
      if (store.speedBoostCooldown > 0) {
        store.updateSpeedBoostCooldown(delta * 1000);
      }
      // Update speed boost active state when cooldown expires
      if (store.speedBoostCooldown <= 0 && store.speedBoostActive) {
        store.setSpeedBoostActive(false);
      }
    }
    
  });
  
  if (!player) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-gradient-to-b from-cyan-400 to-blue-600">
        <div className="text-white text-2xl font-bold">Loading your penguin adventure...</div>
      </div>
    );
  }
  
  return (
    <div className="w-full h-screen relative">
      {/* Optional Spline background */}
      {splineUrl && <SplineBackground sceneUrl={splineUrl} />}
      <OnboardingFlow />
      <Canvas
        camera={{ position: [0, 5, 10], fov: 60 }}
        shadows
        gl={{ antialias: true, alpha: false }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            position={[10, 10, 5]}
            intensity={1}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
          />

          {/* Environment */}
          <Sky
            distance={450000}
            sunPosition={[0, 1, 0]}
            inclination={0}
            azimuth={0.25}
          />
          <Environment preset="sunset" />

          {/* Physics World */}
          <Physics gravity={[0, -9.82, 0]} broadphase="SAP">
            {/* Ocean */}
            <Ocean />

            {/* Player Penguin (GLTF if provided) */}
            {penguinGltfUrl ? (
              <PenguinGLTF ref={penguinRef} playerId={player.id} url={penguinGltfUrl} />
            ) : (
              <Penguin ref={penguinRef} playerId={player.id} />
            )}

            {/* Beach Hut (only in beach mode) */}
            {gameMode === 'beach' && <BeachHut playerId={player.id} />}

            {/* NPC Penguins (only in beach mode) */}
            {gameMode === 'beach' && (
              <>
                {penguinGltfUrl ? (
                  <>
                    <PenguinGLTF
                      playerId={`${player.id}-npc1`}
                      isNPC
                      scale={0.95}
                      initialPosition={[-3, 2, -2]}
                      url={penguinGltfUrl}
                    />
                    <PenguinGLTF
                      playerId={`${player.id}-npc2`}
                      isNPC
                      scale={1}
                      initialPosition={[2, 2, -1]}
                      url={penguinGltfUrl}
                    />
                    <PenguinGLTF
                      playerId={`${player.id}-npc3`}
                      isNPC
                      scale={0.9}
                      initialPosition={[0, 2, 3]}
                      url={penguinGltfUrl}
                    />
                  </>
                ) : (
                  <>
                    <Penguin
                      playerId={`${player.id}-npc1`}
                      isNPC
                      scale={0.95}
                      initialPosition={[-3, 2, -2]}
                      customization={{ bodyColor: '#1E90FF', bellyColor: '#FFFFFF', beakColor: '#F39C12', eyeColor: '#000000', name: 'Blue NPC' }}
                    />
                    <Penguin
                      playerId={`${player.id}-npc2`}
                      isNPC
                      scale={1}
                      initialPosition={[2, 2, -1]}
                      customization={{ bodyColor: '#E74C3C', bellyColor: '#FFFFFF', beakColor: '#F1C40F', eyeColor: '#000000', name: 'Red NPC' }}
                    />
                    <Penguin
                      playerId={`${player.id}-npc3`}
                      isNPC
                      scale={0.9}
                      initialPosition={[0, 2, 3]}
                      customization={{ bodyColor: '#27AE60', bellyColor: '#FFFFFF', beakColor: '#F39C12', eyeColor: '#000000', name: 'Green NPC' }}
                    />
                  </>
                )}
              </>
            )}
          </Physics>

          {/* Camera Controls */}
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            enableRotate={true}
            minDistance={3}
            maxDistance={20}
          />
        </Suspense>
      </Canvas>

      {/* Game UI Overlay */}
      <GameUI gameMode={gameMode} playerId={player.id} />
    </div>
  );
};

