import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { Group } from 'three';
import { useGLTF, useAnimations } from '@react-three/drei';
type PenguinCustomization = {
  bodyColor: string;
  bellyColor: string;
  beakColor: string;
  eyeColor: string;
  name?: string;
};

interface PenguinGLTFProps {
  playerId: string;
  url: string; // GLTF/GLB URL
  customization?: Partial<PenguinCustomization>;
  initialPosition?: [number, number, number];
  scale?: number;
  isNPC?: boolean;
  animationName?: string; // optional animation to play if present
}

export const PenguinGLTF = React.forwardRef<{
  position: [number, number, number];
  velocity: [number, number, number];
}, PenguinGLTFProps>(({ url, customization, initialPosition = [0, 2, 0], scale = 1, isNPC = false, animationName }, ref) => {
  const groupRef = useRef<Group>(null);
  const { scene, animations } = useGLTF(url);
  const { actions } = useAnimations(animations, groupRef);

  // Physics body (dynamic to allow motion)
  const [boxRef, api] = useBox(() => ({
    mass: isNPC ? 0.8 : 1,
    position: initialPosition,
    args: [0.8 * scale, 1.6 * scale, 0.6 * scale],
    type: 'Dynamic',
  }));

  const [position, setPosition] = useState<[number, number, number]>(initialPosition);
  const [velocity, setVelocity] = useState<[number, number, number]>([0, 0, 0]);

  // Keep the GLTF scene under our group and let physics mesh be the collider/parent
  const cloned = useMemo(() => scene.clone(true), [scene]);

  // Subscribe once to velocity updates
  useEffect(() => {
    const unsub = api.velocity.subscribe((vel: [number, number, number]) => setVelocity(vel));
    return () => {
      if (typeof unsub === 'function') unsub();
    };
  }, [api.velocity]);

  // Update position each frame
  useFrame(() => {
    if (boxRef.current) {
      const pos = boxRef.current.position;
      setPosition([pos.x, pos.y, pos.z]);
    }
  });

  // Play animation if provided and exists
  useEffect(() => {
    if (!animationName || !actions) return;
    const action = actions[animationName];
    action?.reset().fadeIn(0.2).play();
    return () => {
      if (action) {
        action.fadeOut(0.2);
        action.stop();
      }
    };
  }, [actions, animationName]);

  // Expose position and velocity
  React.useImperativeHandle(ref, () => ({ position, velocity }));

  // Basic NPC idle drift
  useFrame(() => {
    if (!isNPC) return;
    const t = performance.now() * 0.001;
    const vx = Math.sin(t * 0.5) * 0.6;
    const vz = Math.cos(t * 0.6) * 0.6;
    api.velocity.set(vx, velocity[1], vz);
    if (groupRef.current) {
      const yaw = Math.atan2(vx, vz);
      groupRef.current.rotation.y = yaw;
    }
  });

  // Apply simple color overrides if material names are predictable (best effort)
  useEffect(() => {
    if (!customization) return;
    cloned.traverse((obj: any) => {
      if (obj.isMesh && obj.material) {
        const name = (obj.name || '').toLowerCase();
        if (name.includes('body') && customization.bodyColor) obj.material.color.set(customization.bodyColor);
        if (name.includes('belly') && customization.bellyColor) obj.material.color.set(customization.bellyColor);
        if (name.includes('beak') && customization.beakColor) obj.material.color.set(customization.beakColor);
        if (name.includes('eye') && customization.eyeColor) obj.material.color.set(customization.eyeColor);
      }
    });
  }, [cloned, customization]);

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <mesh ref={boxRef} castShadow receiveShadow>
        {/* Visual model */}
        <primitive object={cloned} />
      </mesh>
    </group>
  );
});

