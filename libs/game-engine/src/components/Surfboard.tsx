import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { Group } from 'three';
import { Surfboard as SurfboardType } from '../../../types/src';

interface SurfboardProps {
  surfboard: SurfboardType;
  position: [number, number, number];
}

export const Surfboard: React.FC<SurfboardProps> = ({ surfboard, position }) => {
  const groupRef = useRef<Group>(null);
  
  const [ref] = useBox(() => ({
    mass: 0.5,
    position,
    args: [2, 0.1, 0.4], // surfboard dimensions
  }));

  // Animation for floating on water
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.position.y = position[1] + Math.sin(time * 2) * 0.1;
      groupRef.current.rotation.z = Math.sin(time * 1.5) * 0.05;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh ref={ref} castShadow receiveShadow>
        {/* Main board */}
        <boxGeometry args={[2, 0.1, 0.4]} />
        <meshStandardMaterial color={surfboard.color} />
        
        {/* Board design/pattern */}
        <mesh position={[0, 0.06, 0]}>
          <planeGeometry args={[1.8, 0.35]} />
          <meshStandardMaterial 
            color={surfboard.pattern} 
            transparent 
            opacity={0.7}
          />
        </mesh>
        
        {/* Fins */}
        <SurfboardFins />
      </mesh>
    </group>
  );
};

const SurfboardFins: React.FC = () => (
  <>
    {/* Center fin */}
    <mesh position={[0, -0.05, -0.8]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.08, 0.16, 8]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
    
    {/* Side fins */}
    <mesh position={[-0.3, -0.05, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.06, 0.12, 8]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
    <mesh position={[0.3, -0.05, -0.6]} rotation={[Math.PI / 2, 0, 0]}>
      <coneGeometry args={[0.06, 0.12, 8]} />
      <meshStandardMaterial color="#333333" />
    </mesh>
  </>
);
