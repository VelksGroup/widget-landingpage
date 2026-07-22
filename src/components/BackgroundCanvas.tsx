import React, { useRef, useLayoutEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function CustomParticles({ count = 1000, color = "#ffffff", size = 0.1, radius = 20 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const r = radius * Math.cbrt(Math.random());
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);
      pos[i*3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i*3+2] = r * Math.cos(phi);
    }
    return pos;
  }, [count, radius]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial color={color} size={size} transparent opacity={0.6} sizeAttenuation blending={THREE.AdditiveBlending} depthWrite={false} />
    </points>
  );
}

function useSceneTransition(progress: React.MutableRefObject<number>, index: number) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (!groupRef.current) return;
    const diff = progress.current - index;
    const op = Math.max(0, 1 - Math.abs(diff));
    
    // Ocultar completamente se invisível para poupar performance
    groupRef.current.visible = op > 0.001;
    
    // Efeito de travessia (fly-through):
    // Próxima cena (diff = -1) começa no fundo em z = -25
    // Cena atual (diff = 0) fica em z = -10
    // Cena anterior (diff = 1) vem para a frente em z = 5
    groupRef.current.position.z = -10 + diff * 15;

    // Escala dramática ao entrar/sair
    const scale = 1 + Math.abs(diff) * 0.2;
    groupRef.current.scale.set(scale, scale, scale);

    // Crossfade de opacidade em todos os materiais do grupo
    groupRef.current.traverse((child: any) => {
      if (child.isMesh || child.isPoints || child.isLineSegments || child.isLine) {
        if (child.material) {
          const mat = child.material;
          if (mat.userData.baseOpacity === undefined) {
            mat.userData.baseOpacity = mat.opacity !== undefined ? mat.opacity : 1;
            mat.transparent = true;
          }
          mat.opacity = mat.userData.baseOpacity * op;
        }
      }
    });
  });

  return groupRef;
}

// CENA 01 — HERO
function SceneHero({ progress }: { progress: React.MutableRefObject<number> }) {
  const groupRef = useSceneTransition(progress, 0);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.05;
      groupRef.current.rotation.x = t * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={50} color="#00e5ff" distance={50} />
      <Sphere args={[2.5, 64, 64]}>
        <MeshDistortMaterial color="#000" emissive="#00e5ff" emissiveIntensity={2} distort={0.3} speed={2} roughness={0.2} metalness={1} />
      </Sphere>
      <mesh>
        <icosahedronGeometry args={[3.5, 2]} />
        <meshBasicMaterial color="#cc00ff" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh rotation={[Math.PI/3, 0, 0]}>
        <torusGeometry args={[4.5, 0.02, 32, 100]} />
        <meshBasicMaterial color="#00e5ff" transparent opacity={0.5} blending={THREE.AdditiveBlending} />
      </mesh>
      <CustomParticles count={1200} color="#00e5ff" size={0.06} radius={25} />
    </group>
  );
}

// CENA 02 — FUNIL SANDRA (Rede Neural)
function SceneNeural({ progress }: { progress: React.MutableRefObject<number> }) {
  const groupRef = useSceneTransition(progress, 1);
  const geo = useMemo(() => new THREE.IcosahedronGeometry(4, 2), []);
  const edges = useMemo(() => new THREE.EdgesGeometry(geo), [geo]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = -t * 0.03;
      groupRef.current.rotation.z = t * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={40} color="#00ff88" distance={50} />
      
      <lineSegments geometry={edges}>
        <lineBasicMaterial color="#00ff88" transparent opacity={0.3} blending={THREE.AdditiveBlending} />
      </lineSegments>
      
      <points geometry={geo}>
        <pointsMaterial color="#ffffff" size={0.15} transparent opacity={0.8} blending={THREE.AdditiveBlending} />
      </points>

      <group>
        {[...Array(30)].map((_, i) => (
          <mesh key={i} position={[(Math.random()-0.5)*12, (Math.random()-0.5)*12, (Math.random()-0.5)*12]} rotation={[Math.random()*Math.PI, Math.random()*Math.PI, 0]}>
            <boxGeometry args={[0.2, 0.2, 0.2]} />
            <meshBasicMaterial color="#00ff88" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
      
      <CustomParticles count={1500} color="#00ff88" size={0.05} radius={25} />
    </group>
  );
}

// CENA 03 — PERDA DE LEADS (Fragmentação Digital)
function SceneFragmentation({ progress }: { progress: React.MutableRefObject<number> }) {
  const groupRef = useSceneTransition(progress, 2);
  const shardsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.x = t * 0.05;
      groupRef.current.rotation.y = t * 0.02;
    }
    if (shardsRef.current) {
      shardsRef.current.children.forEach((shard, i) => {
        shard.position.y += Math.sin(t + i) * 0.01;
        shard.rotation.x += 0.01;
        shard.rotation.y += 0.02;
      });
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={60} color="#ff003c" distance={50} />
      
      <mesh>
        <octahedronGeometry args={[2, 1]} />
        <meshBasicMaterial color="#ff003c" wireframe transparent opacity={0.4} blending={THREE.AdditiveBlending} />
      </mesh>

      <group ref={shardsRef}>
        {[...Array(80)].map((_, i) => {
          const r = 3 + Math.random() * 10;
          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = r * Math.sin(phi) * Math.cos(theta);
          const y = r * Math.sin(phi) * Math.sin(theta);
          const z = r * Math.cos(phi);
          return (
            <mesh key={i} position={[x, y, z]} rotation={[Math.random()*Math.PI, Math.random()*Math.PI, 0]}>
              <tetrahedronGeometry args={[0.3 + Math.random() * 0.6, 0]} />
              <meshBasicMaterial color={Math.random() > 0.5 ? "#ff003c" : "#ff3366"} transparent opacity={0.5} blending={THREE.AdditiveBlending} />
            </mesh>
          )
        })}
      </group>

      <CustomParticles count={1000} color="#ff003c" size={0.06} radius={25} />
    </group>
  );
}

// CENA 04 — AGENTES DE VOZ (Ondas Sonoras)
function SceneWaves({ progress }: { progress: React.MutableRefObject<number> }) {
  const groupRef = useSceneTransition(progress, 3);
  const ringsRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.x = Math.PI / 4 + Math.sin(t * 0.2) * 0.1;
      groupRef.current.rotation.y = t * 0.05;
    }
    if (ringsRef.current) {
      ringsRef.current.children.forEach((ring, i) => {
        const scale = 1 + Math.sin(t * 2 - i * 0.5) * 0.1;
        ring.scale.set(scale, scale, scale);
      });
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={40} color="#0055ff" distance={50} />
      
      <Sphere args={[1.5, 32, 32]}>
        <meshBasicMaterial color="#0055ff" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
      </Sphere>

      <group ref={ringsRef}>
        {[...Array(12)].map((_, i) => (
          <mesh key={i} rotation={[Math.PI/2, 0, 0]}>
            <torusGeometry args={[2.5 + i * 0.8, 0.02 + (i*0.005), 32, 100]} />
            <meshBasicMaterial color="#00e5ff" transparent opacity={0.8 - i * 0.06} blending={THREE.AdditiveBlending} />
          </mesh>
        ))}
      </group>
      
      <CustomParticles count={1200} color="#0055ff" size={0.06} radius={25} />
    </group>
  );
}

// CENA 05 — CTA FINAL (Estrutura Monumental)
function SceneCTA({ progress }: { progress: React.MutableRefObject<number> }) {
  const groupRef = useSceneTransition(progress, 4);
  const diskRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (groupRef.current) {
      groupRef.current.rotation.y = t * 0.1;
      groupRef.current.rotation.x = Math.sin(t * 0.5) * 0.1;
    }
    if (diskRef.current) {
      diskRef.current.rotation.z = -t * 0.3;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0]} intensity={100} color="#ffaa00" distance={100} />
      <directionalLight position={[0, 10, -10]} intensity={2} color="#cc00ff" />
      
      <Sphere args={[3, 64, 64]}>
        <MeshDistortMaterial color="#000" emissive="#ffcc00" emissiveIntensity={3} distort={0.2} speed={1} transparent opacity={0.9} />
      </Sphere>

      <mesh ref={diskRef} rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[4, 12, 128]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.15} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>
      
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <ringGeometry args={[4.5, 4.6, 128]} />
        <meshBasicMaterial color="#cc00ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
      </mesh>

      <group>
        {[...Array(6)].map((_, i) => {
          const angle = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(angle)*8, 0, Math.sin(angle)*8]}>
              <cylinderGeometry args={[0.2, 0.2, 10, 16]} />
              <meshBasicMaterial color="#ffaa00" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
            </mesh>
          )
        })}
      </group>
      
      <CustomParticles count={2000} color="#ffcc00" size={0.07} radius={30} />
    </group>
  );
}

function EvolvingScene() {
  const { camera, scene } = useThree();
  const progress = useRef(0);
  
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to(progress, {
        current: 4,
        ease: "none",
        scrollTrigger: {
          trigger: "#main-scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        }
      });
    });
    return () => ctx.revert();
  }, []);

  const bgColors = useMemo(() => [
    new THREE.Color("#020205"), // Hero
    new THREE.Color("#010a05"), // Funnel
    new THREE.Color("#0a0002"), // Pain
    new THREE.Color("#00051a"), // Voices
    new THREE.Color("#0a0600"), // CTA
  ], []);

  useFrame((state) => {
    const p = Math.max(0, Math.min(progress.current, 4));
    const idx = Math.floor(p);
    const nextIdx = Math.min(idx + 1, 4);
    const t = p - idx;
    scene.background = new THREE.Color().copy(bgColors[idx]).lerp(bgColors[nextIdx], t);

    const time = state.clock.elapsedTime;
    camera.position.x = Math.sin(time * 0.1) * 1;
    camera.position.y = Math.cos(time * 0.15) * 1;
    camera.lookAt(0, 0, -10);
  });

  return (
    <group>
      <ambientLight intensity={0.1} color="#ffffff" />
      <directionalLight position={[10, 20, 10]} intensity={1} color="#ffffff" />
      
      <SceneHero progress={progress} />
      <SceneNeural progress={progress} />
      <SceneFragmentation progress={progress} />
      <SceneWaves progress={progress} />
      <SceneCTA progress={progress} />
    </group>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas 
        dpr={[1, 2]} 
        gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
        camera={{ position: [0, 0, 10], fov: 45 }}
      >
        <EvolvingScene />
      </Canvas>
    </div>
  );
}
