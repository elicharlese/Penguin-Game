import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { usePlane } from '@react-three/cannon';
import { Mesh, PlaneGeometry, MeshStandardMaterial, Color } from 'three';
import * as THREE from 'three';

export const Ocean: React.FC = () => {
  const meshRef = useRef<Mesh>(null);
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
    type: 'Static',
  }));

  // Create animated ocean geometry
  const geometry = useMemo(() => {
    const geo = new PlaneGeometry(200, 200, 100, 100);
    return geo;
  }, []);

  // Animate waves
  useFrame(({ clock }) => {
    if (meshRef.current) {
      const time = clock.getElapsedTime();
      const positions = meshRef.current.geometry.attributes.position;
      
      for (let i = 0; i < positions.count; i++) {
        const x = positions.getX(i);
        const z = positions.getZ(i);
        
        // Create wave patterns
        const wave1 = Math.sin(x * 0.1 + time) * 0.5;
        const wave2 = Math.sin(z * 0.1 + time * 0.7) * 0.3;
        const wave3 = Math.sin((x + z) * 0.05 + time * 0.5) * 0.8;
        
        const y = wave1 + wave2 + wave3;
        positions.setY(i, y);
      }
      
      positions.needsUpdate = true;
      meshRef.current.geometry.computeVertexNormals();
    }
  });

  return (
    <mesh ref={meshRef} geometry={geometry} receiveShadow>
      <meshStandardMaterial
        color={new Color(0x006994)}
        transparent
        opacity={0.8}
        roughness={0.1}
        metalness={0.1}
      />
    </mesh>
  );
};
