import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Small "circuit particle field" — a light, contextual effect for demos that
 * opt into enableThree. This module is only ever reached via a dynamic
 * import (see ThreeEffectLoader), so it never enters the shared bundle.
 */
function Particles({ accentColor }: { accentColor: string }) {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 140;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 4;
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.035;
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.08) * 0.08;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color={accentColor} size={0.045} sizeAttenuation transparent opacity={0.75} />
    </points>
  );
}

export default function ThreeEffect({ accentColor = '#e8a33d' }: { accentColor?: string }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false, alpha: true }}
      className="!absolute inset-0"
    >
      <Particles accentColor={accentColor} />
    </Canvas>
  );
}
