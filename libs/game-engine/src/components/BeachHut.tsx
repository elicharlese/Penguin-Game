import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useBox } from '@react-three/cannon';
import { Mesh, Group } from 'three';
import { GameStore } from '../store/GameStore';

interface BeachHutProps {
  playerId: string;
}

export const BeachHut: React.FC<BeachHutProps> = ({ playerId }) => {
  const groupRef = useRef<Group>(null);
  const { player } = GameStore.useStore();
  
  const [ref] = useBox(() => ({
    type: 'Static',
    position: [10, 1, 5],
    args: [3, 2, 3], // hut dimensions
  }));

  // Gentle swaying animation
  useFrame(({ clock }) => {
    if (groupRef.current) {
      const time = clock.getElapsedTime();
      groupRef.current.rotation.y = Math.sin(time * 0.5) * 0.02;
    }
  });

  return (
    <group ref={groupRef} position={[10, 1, 5]}>
      {/* Hut Base */}
      <mesh ref={ref} castShadow receiveShadow>
        <boxGeometry args={[3, 2, 3]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
      
      {/* Roof */}
      <mesh position={[0, 1.5, 0]} castShadow>
        <coneGeometry args={[2.2, 1, 4]} />
        <meshStandardMaterial color="#654321" />
      </mesh>
      
      {/* Door */}
      <mesh position={[0, -0.3, 1.51]} castShadow>
        <boxGeometry args={[0.8, 1.4, 0.1]} />
        <meshStandardMaterial color="#4A4A4A" />
      </mesh>
      
      {/* Windows */}
      <mesh position={[-1.2, 0.2, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      <mesh position={[1.2, 0.2, 1.51]} castShadow>
        <boxGeometry args={[0.6, 0.6, 0.1]} />
        <meshStandardMaterial color="#87CEEB" transparent opacity={0.7} />
      </mesh>
      
      {/* Decorations based on player's hut upgrades */}
      {player?.beachHut.decorations.includes('surfboard-rack') && (
        <SurfboardRack />
      )}
      
      {player?.beachHut.decorations.includes('palm-tree') && (
        <PalmTree />
      )}
      
      {player?.beachHut.decorations.includes('beach-chair') && (
        <BeachChair />
      )}
    </group>
  );
};

const SurfboardRack: React.FC = () => (
  <group position={[2, 0, 0]}>
    {/* Rack posts */}
    <mesh position={[0, 0, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 2]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
    <mesh position={[0.5, 0, 0]} castShadow>
      <cylinderGeometry args={[0.05, 0.05, 2]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
    
    {/* Sample surfboards */}
    <mesh position={[0.25, 0.5, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
      <boxGeometry args={[1.5, 0.05, 0.3]} />
      <meshStandardMaterial color="#FF6B6B" />
    </mesh>
    <mesh position={[0.25, 0.2, 0]} rotation={[0, 0, Math.PI / 6]} castShadow>
      <boxGeometry args={[1.5, 0.05, 0.3]} />
      <meshStandardMaterial color="#4ECDC4" />
    </mesh>
  </group>
);

const PalmTree: React.FC = () => (
  <group position={[-3, 0, -2]}>
    {/* Trunk */}
    <mesh position={[0, 1.5, 0]} castShadow>
      <cylinderGeometry args={[0.2, 0.25, 3]} />
      <meshStandardMaterial color="#8B4513" />
    </mesh>
    
    {/* Leaves */}
    {[0, 1, 2, 3, 4].map((i) => (
      <mesh
        key={i}
        position={[
          Math.cos((i * Math.PI * 2) / 5) * 0.3,
          3,
          Math.sin((i * Math.PI * 2) / 5) * 0.3
        ]}
        rotation={[
          Math.cos((i * Math.PI * 2) / 5) * 0.5,
          (i * Math.PI * 2) / 5,
          0
        ]}
        castShadow
      >
        <boxGeometry args={[1.5, 0.1, 0.4]} />
        <meshStandardMaterial color="#228B22" />
      </mesh>
    ))}
  </group>
);

const BeachChair: React.FC = () => (
  <group position={[0, 0, -4]}>
    {/* Chair seat */}
    <mesh position={[0, 0.3, 0]} castShadow>
      <boxGeometry args={[1, 0.1, 1]} />
      <meshStandardMaterial color="#FF6B6B" />
    </mesh>
    
    {/* Chair back */}
    <mesh position={[0, 0.8, -0.4]} rotation={[-0.2, 0, 0]} castShadow>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color="#FF6B6B" />
    </mesh>
    
    {/* Chair legs */}
    {[[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]].map(([x, z], i) => (
      <mesh key={i} position={[x, 0, z]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.6]} />
        <meshStandardMaterial color="#8B4513" />
      </mesh>
    ))}
  </group>
);
