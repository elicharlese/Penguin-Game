import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { Group } from 'three';
import { PenguinCustomization } from '../../../types/src';
import { GameStore } from '../store/GameStore';

interface PenguinProps {
  playerId: string;
  // Optional overrides to render NPCs or previews with custom looks
  customization?: Partial<PenguinCustomization>;
  initialPosition?: [number, number, number];
  scale?: number;
  isNPC?: boolean;
}

export const Penguin = React.forwardRef<{
  position: [number, number, number];
  velocity: [number, number, number];
}, PenguinProps>(({ playerId, customization: customizationProp, initialPosition = [0, 2, 0], scale = 1, isNPC = false }, ref) => {
  const groupRef = useRef<Group>(null);
  const leftWingRef = useRef<Group>(null);
  const rightWingRef = useRef<Group>(null);
  const leftFootRef = useRef<Group>(null);
  const rightFootRef = useRef<Group>(null);
  const headRef = useRef<Group>(null);
  const { player } = GameStore.useStore();

  const [boxRef, api] = useBox(() => ({
    mass: isNPC ? 0.8 : 1,
    position: initialPosition,
    args: [0.8 * scale, 1.6 * scale, 0.6 * scale], // penguin dimensions
    type: 'Dynamic',
  }));

  // State for position and velocity
  const [position, setPosition] = useState<[number, number, number]>(initialPosition);
  const [velocity, setVelocity] = useState<[number, number, number]>([0, 0, 0]);
  const wanderDirRef = useRef<[number, number, number]>([0, 0, 0]);
  const lastWanderChangeRef = useRef<number>(0);
  
  // Update position from physics each frame (velocity via subscription in an effect)
  useFrame(() => {
    if (boxRef.current) {
      const pos = boxRef.current.position;
      setPosition([pos.x, pos.y, pos.z]);
    }
  });

  // Subscribe to velocity once (avoid re-subscribing in frame loop)
  useEffect(() => {
    const unsub = api.velocity.subscribe((vel: [number, number, number]) => {
      setVelocity(vel);
    });
    return () => {
      // cannon-es subscription returns an unsubscribe fn
      if (typeof unsub === 'function') unsub();
    };
  }, [api.velocity]);

  // NPC wander behavior: pick a new gentle direction every few seconds
  useEffect(() => {
    if (!isNPC) return;
    const interval = setInterval(() => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 0.8; // slow stroll
      wanderDirRef.current = [Math.sin(angle) * speed, 0, Math.cos(angle) * speed];
      lastWanderChangeRef.current = performance.now();
    }, 2500 + Math.random() * 1500);
    return () => clearInterval(interval);
  }, [isNPC]);
  
  // Expose position and velocity via ref
  React.useImperativeHandle(ref, () => ({
    position,
    velocity
  }));

  // Handle player input for movement (disabled for NPCs)
  useEffect(() => {
    if (isNPC) return;
    const keysPressed = {
      left: false,
      right: false,
      up: false,
      down: false,
      space: false,
      shift: false
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysPressed.left = true;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysPressed.right = true;
          break;
        case 'ArrowUp':
        case 'KeyW':
          keysPressed.up = true;
          break;
        case 'ArrowDown':
        case 'KeyS':
          keysPressed.down = true;
          break;
        case 'Space':
          keysPressed.space = true;
          // Jump action
          api.velocity.set(velocity[0], 8, velocity[2]);
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysPressed.shift = true;
          break;
      }
      
      // Update velocity based on keys pressed
      updateMovement(keysPressed);
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      switch (event.code) {
        case 'ArrowLeft':
        case 'KeyA':
          keysPressed.left = false;
          break;
        case 'ArrowRight':
        case 'KeyD':
          keysPressed.right = false;
          break;
        case 'ArrowUp':
        case 'KeyW':
          keysPressed.up = false;
          break;
        case 'ArrowDown':
        case 'KeyS':
          keysPressed.down = false;
          break;
        case 'Space':
          keysPressed.space = false;
          break;
        case 'ShiftLeft':
        case 'ShiftRight':
          keysPressed.shift = false;
          break;
      }
      
      // Update velocity based on keys pressed
      updateMovement(keysPressed);
    };

    const updateMovement = (keys: typeof keysPressed) => {
      const speed = keys.shift ? 10 : 5; // Boost speed when shift is pressed
      let x = 0;
      let z = 0;
      
      if (keys.left) x -= speed;
      if (keys.right) x += speed;
      if (keys.up) z -= speed;
      if (keys.down) z += speed;
      
      // Only update if there's movement
      if (x !== 0 || z !== 0) {
        api.velocity.set(x, velocity[1], z);
      } else if (!keys.space) {
        // Apply friction when no keys are pressed (except space)
        api.velocity.set(velocity[0] * 0.9, velocity[1], velocity[2] * 0.9);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [api, velocity, isNPC]);

  // Animation loop: waddling sway + limb stepping and subtle bobbing
  useFrame(({ clock }) => {
    const time = clock.getElapsedTime();
    const speedXZ = Math.hypot(velocity[0], velocity[2]);
    const moving = speedXZ > 0.1;

    // Apply gentle wander for NPCs
    if (isNPC) {
      const target = wanderDirRef.current;
      // Smoothly approach target velocity, keep Y from physics
      const lerp = 0.02;
      const vx = velocity[0] + (target[0] - velocity[0]) * lerp;
      const vz = velocity[2] + (target[2] - velocity[2]) * lerp;
      api.velocity.set(vx, velocity[1], vz);
    }

    if (groupRef.current) {
      // Bobbing increases with speed
      const bob = Math.sin(time * (moving ? 6 : 2)) * 0.05 * (1 + Math.min(speedXZ / 8, 1));
      groupRef.current.position.y = bob;
      // Waddle sway left-right when moving
      const sway = Math.sin(time * (moving ? 10 : 3)) * 0.15 * (moving ? 1 : 0.4);
      groupRef.current.rotation.z = sway;
      // Face movement direction
      if (moving) {
        const yaw = Math.atan2(velocity[0], velocity[2]);
        groupRef.current.rotation.y = yaw;
      }
    }

    // Wings flapping subtly when moving
    const wingPhase = Math.sin(time * (moving ? 8 : 2));
    if (leftWingRef.current) {
      leftWingRef.current.rotation.z = -0.3 + wingPhase * 0.15 * (moving ? 1 : 0.3);
    }
    if (rightWingRef.current) {
      rightWingRef.current.rotation.z = 0.3 - wingPhase * 0.15 * (moving ? 1 : 0.3);
    }

    // Feet stepping animation
    const step = Math.sin(time * (moving ? 10 : 3)) * (moving ? 0.25 : 0.07);
    if (leftFootRef.current) leftFootRef.current.rotation.x = step;
    if (rightFootRef.current) rightFootRef.current.rotation.x = -step;

    // Head tilt slightly forward when moving faster
    if (headRef.current) {
      headRef.current.rotation.x = moving ? -Math.min(speedXZ / 20, 0.25) : 0;
    }
  });

  // Safely handle customization with fallbacks
  const customization: Partial<PenguinCustomization> = customizationProp || player?.penguin || {
    bodyColor: '#2C3E50',
    bellyColor: '#FFFFFF',
    beakColor: '#F39C12',
    eyeColor: '#000000',
    id: 'default',
    name: 'Default Penguin',
    accessories: [],
  };

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <mesh ref={boxRef} castShadow receiveShadow>
        {/* Penguin Body */}
        <PenguinBody customization={customization} />

        {/* Penguin Head */}
        <group ref={headRef}>
          <PenguinHead customization={customization} />
        </group>

        {/* Wings */}
        <group ref={leftWingRef}>
          <PenguinWings customization={customization} side="left" />
        </group>
        <group ref={rightWingRef}>
          <PenguinWings customization={customization} side="right" />
        </group>

        {/* Feet */}
        <group ref={leftFootRef}>
          <PenguinFeet customization={customization} side="left" />
        </group>
        <group ref={rightFootRef}>
          <PenguinFeet customization={customization} side="right" />
        </group>
      </mesh>
    </group>
  );
});

interface PenguinPartProps {
  customization: Partial<PenguinCustomization>;
}

const PenguinBody: React.FC<PenguinPartProps> = ({ customization }) => (
  <mesh position={[0, 0, 0]} castShadow>
    <capsuleGeometry args={[0.4, 0.8, 4, 8]} />
    <meshStandardMaterial color={customization.bodyColor || '#2C3E50'} />
    
    {/* Belly */}
    <mesh position={[0, 0, 0.25]} castShadow>
      <sphereGeometry args={[0.25, 16, 16]} />
      <meshStandardMaterial color={customization.bellyColor || '#FFFFFF'} />
    </mesh>
  </mesh>
);

const PenguinHead: React.FC<PenguinPartProps> = ({ customization }) => (
  <mesh position={[0, 0.9, 0]} castShadow>
    <sphereGeometry args={[0.35, 16, 16]} />
    <meshStandardMaterial color={customization.bodyColor || '#2C3E50'} />
    
    {/* Eyes */}
    <mesh position={[-0.15, 0.1, 0.25]} castShadow>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color={customization.eyeColor || '#000000'} />
    </mesh>
    <mesh position={[0.15, 0.1, 0.25]} castShadow>
      <sphereGeometry args={[0.08, 8, 8]} />
      <meshStandardMaterial color={customization.eyeColor || '#000000'} />
    </mesh>
    
    {/* Beak */}
    <mesh position={[0, -0.1, 0.3]} castShadow>
      <coneGeometry args={[0.06, 0.15, 8]} />
      <meshStandardMaterial color={customization.beakColor || '#F39C12'} />
    </mesh>
  </mesh>
);

const PenguinWings: React.FC<PenguinPartProps & { side: 'left' | 'right' }> = ({ customization, side }) => (
  <mesh
    position={side === 'left' ? [-0.45, 0.2, 0] : [0.45, 0.2, 0]}
    rotation={[0, 0, side === 'left' ? -0.3 : 0.3]}
    castShadow
  >
    <capsuleGeometry args={[0.1, 0.6, 4, 8]} />
    <meshStandardMaterial color={customization.bodyColor || '#2C3E50'} />
  </mesh>
);

const PenguinFeet: React.FC<PenguinPartProps & { side: 'left' | 'right' }> = ({ customization, side }) => (
  <mesh position={side === 'left' ? [-0.2, -0.9, 0.1] : [0.2, -0.9, 0.1]} castShadow>
    <sphereGeometry args={[0.12, 8, 8]} />
    <meshStandardMaterial color={customization.beakColor || '#F39C12'} />
  </mesh>
);
