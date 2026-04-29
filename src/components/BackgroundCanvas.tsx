import React, { useRef, useMemo, useLayoutEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, MeshWobbleMaterial, Trail, Sphere, Line } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// --- SCENE 1: Hero (Quantum Nexus) ---
function Scene1() {
  const coreRef = useRef<THREE.Group>(null);
  const particlesRef = useRef<THREE.Points>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  
  const particlesCount = 1200;
  const positions = useMemo(() => {
    const pos = new Float32Array(particlesCount * 3);
    for (let i = 0; i < particlesCount; i++) {
      const radius = 10 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      pos[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = radius * Math.cos(phi) - 20;
    }
    return pos;
  }, []);

  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (coreRef.current) {
      coreRef.current.rotation.y = time * 0.05;
      coreRef.current.rotation.x = time * 0.02;
      coreRef.current.position.y = Math.sin(time * 0.5) * 1;
    }
    if (particlesRef.current) {
      particlesRef.current.rotation.y = time * 0.02;
      particlesRef.current.rotation.z = time * 0.01;
    }
    if (coreMeshRef.current) {
      // Reptilian Trigger: Magnetic Pulse (Life/Scale)
      const pulse = 1 + Math.sin(time * 1.5) * 0.08;
      coreMeshRef.current.scale.set(pulse, pulse, pulse);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Deep Immersive Environment Backdrop */}
      <mesh position={[0, 0, -80]}>
        <planeGeometry args={[1500, 1500]} />
        <meshBasicMaterial color="#0c0022" />
      </mesh>
      {/* Localized Atmospheric Fog / Haze */}
      <mesh position={[0, 0, -30]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#6600ff" transparent opacity={0.03} side={THREE.BackSide} blending={THREE.AdditiveBlending}/>
      </mesh>
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 20, 10]} intensity={2} color="#00e5ff" />
      <pointLight position={[-10, 0, -10]} intensity={50} color="#00e5ff" distance={100} decay={2} />
      <pointLight position={[10, 15, -20]} intensity={60} color="#9900ff" distance={100} decay={2} />
      
      <group ref={coreRef} position={[-10, 0, -25]}>
        {/* Inner Quantum Core */}
        <Sphere ref={coreMeshRef} args={[4, 64, 64]}>
          <MeshDistortMaterial color="#000" emissive="#00e5ff" emissiveIntensity={1.5} distort={0.2} speed={1.5} roughness={0.2} metalness={1} />
        </Sphere>
        
        {/* Orbital Rings */}
        <mesh rotation={[Math.PI / 3, 0, 0]}>
          <torusGeometry args={[8, 0.05, 16, 100]} />
          <meshBasicMaterial color="#cc00ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[0, Math.PI / 3, 0]}>
          <torusGeometry args={[11, 0.02, 16, 100]} />
          <meshBasicMaterial color="#00e5ff" transparent opacity={0.6} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[0, 0, Math.PI / 4]}>
          <torusGeometry args={[14, 0.1, 16, 100]} />
          <meshBasicMaterial color="#7000dd" transparent opacity={0.4} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* Surrounding Wireframe cage */}
        <mesh>
          <icosahedronGeometry args={[12, 1]} />
          <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.15} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
      
      {/* Background Holographic Rings */}
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
         <mesh position={[15, -10, -40]} rotation={[Math.PI / 4, Math.PI / 5, 0]}>
           <ringGeometry args={[20, 20.2, 64]} />
           <meshBasicMaterial color="#cc00ff" transparent opacity={0.4} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
         </mesh>
         <mesh position={[15, -10, -40]} rotation={[-Math.PI / 4, -Math.PI / 5, 0]}>
           <ringGeometry args={[25, 25.1, 64]} />
           <meshBasicMaterial color="#00e5ff" transparent opacity={0.2} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
         </mesh>
      </Float>

      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" count={particlesCount} array={positions} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial size={0.15} color="#00e5ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} sizeAttenuation={true} />
      </points>
      <Stars radius={50} depth={40} count={2000} factor={5} saturation={1} fade speed={1.5} color="#9900ff" />
    </group>
  );
}

// --- SCENE 2: The Pain (Cyber Carnage) ---
function Scene2() {
  const shardsRef = useRef<THREE.Group>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const lightRef = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (shardsRef.current) {
      shardsRef.current.rotation.y = time * 0.1;
      shardsRef.current.rotation.x = Math.sin(time * 0.5) * 0.2;
      
      // Reptilian Trigger: Quantum Expansion Movement (Looming Danger)
      shardsRef.current.children.forEach((child, i) => {
        const offset = i * 0.1;
        const flex = 1 + Math.sin(time * 2 + offset) * 0.15;
        child.scale.set(flex, flex, flex);
      });
    }
    if (coreRef.current) {
      // simulate a magnetic breathing black hole
      const pulse = Math.sin(time * 3);
      const scale = 1 + pulse * 0.1;
      coreRef.current.scale.set(scale, scale, scale);
    }
    if (lightRef.current) {
      // Reptilian Trigger: Magnetic Aura Pulse (Fight or Flight)
      lightRef.current.intensity = 100 + Math.sin(time * 4) * 60;
    }
  });

  return (
    <group position={[0, 0, -100]}>
      {/* Deep Immersive Environment Backdrop */}
      <mesh position={[0, 0, -80]}>
        <planeGeometry args={[1500, 1500]} />
        <meshBasicMaterial color="#1a0004" />
      </mesh>
      {/* Localized Atmospheric Fog / Haze */}
      <mesh position={[0, 0, -30]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#ff003c" transparent opacity={0.04} side={THREE.BackSide} blending={THREE.AdditiveBlending}/>
      </mesh>
      
      <ambientLight intensity={0.1} />
      <directionalLight position={[10, 20, 10]} intensity={5} color="#ff003c" />
      <pointLight ref={lightRef} position={[0, 0, -10]} intensity={100} color="#ff003c" decay={2} distance={100} />
      <pointLight position={[-20, -20, -20]} intensity={50} color="#ff0000" decay={2} distance={100} />
      
      <group position={[0, 0, -20]}>
        {/* Unstable Core */}
        <mesh ref={coreRef}>
          <octahedronGeometry args={[8, 0]} />
          <meshStandardMaterial color="#000" wireframe={false} roughness={0} metalness={1}/>
          <meshBasicMaterial color="#ff003c" wireframe transparent opacity={0.5} blending={THREE.AdditiveBlending} />
        </mesh>
        
        {/* Fractal / Shards expanding outwards */}
        <group ref={shardsRef}>
          {[...Array(60)].map((_, i) => {
             const angle = (i / 60) * Math.PI * 2;
             const radius = 15 + Math.random() * 20;
             const x = Math.cos(angle) * radius;
             const z = Math.sin(angle) * radius;
             const y = (Math.random() - 0.5) * 30;
             return (
               <mesh key={i} position={[x, y, z]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                 <coneGeometry args={[1, Math.random() * 15 + 5, 3]} />
                 <meshStandardMaterial color="#2a0005" roughness={0.5} metalness={0.8} />
                 <meshBasicMaterial color="#ff003c" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
               </mesh>
             );
          })}
        </group>
      </group>
      
      {/* Intense red starfield / debris */}
      <Stars radius={80} depth={50} count={1500} factor={6} saturation={1} fade speed={2} color="#ff003c" />
    </group>
  );
}

// --- SCENE 3: The Mechanism (Hyper-Dimensional Core) ---
function Scene3() {
  const tunnelRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (tunnelRef.current) {
      // Reptilian Trigger: Mesmeric/Hypnotic Infinite Quantum Tunnel (Focus/Trance)
      const zPos = (time * 10) % 40;
      tunnelRef.current.position.z = zPos;
      tunnelRef.current.rotation.z = time * 0.02;
    }
  });

  return (
    <group position={[0, 0, -200]}>
      {/* Deep Immersive Environment Backdrop */}
      <mesh position={[0, 0, -80]}>
        <planeGeometry args={[1500, 1500]} />
        <meshBasicMaterial color="#000722" />
      </mesh>
      {/* Localized Atmospheric Fog / Haze */}
      <mesh position={[0, 0, -30]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#0088cc" transparent opacity={0.03} side={THREE.BackSide} blending={THREE.AdditiveBlending}/>
      </mesh>
      
      <ambientLight intensity={0.5} />
      <pointLight position={[0, 0, -20]} intensity={100} color="#00e5ff" distance={150} decay={2} />
      <pointLight position={[0, 0, 20]} intensity={50} color="#0055ff" distance={100} decay={2} />
      
      <group position={[0, 0, -40]} ref={tunnelRef}>
         {/* Infinite Server Rings */}
         {[...Array(12)].map((_, i) => (
           <group key={i} position={[0, 0, i * -40]}>
             <mesh>
               <torusGeometry args={[25, 2, 8, 32]} />
               <meshStandardMaterial color="#001133" metalness={0.9} roughness={0.1} />
               <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.3} blending={THREE.AdditiveBlending} />
             </mesh>
             {/* Data cores along the ring */}
             {[...Array(8)].map((_, j) => {
               const angle = (j / 8) * Math.PI * 2;
               return (
                 <mesh key={j} position={[Math.cos(angle) * 25, Math.sin(angle) * 25, 0]} rotation={[0, 0, angle]}>
                   <boxGeometry args={[4, 4, 8]} />
                   <meshStandardMaterial color="#00051a" />
                   <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.6} blending={THREE.AdditiveBlending} />
                 </mesh>
               )
             })}
           </group>
         ))}
         
         {/* Central Laser */}
         <mesh rotation={[Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[0.5, 0.5, 500, 16]} />
           <meshBasicMaterial color="#00e5ff" transparent opacity={0.8} blending={THREE.AdditiveBlending} />
         </mesh>
         <mesh rotation={[Math.PI / 2, 0, 0]}>
           <cylinderGeometry args={[2, 2, 500, 16]} />
           <meshBasicMaterial color="#0088cc" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
         </mesh>
      </group>
      
      <Stars radius={80} depth={100} count={2000} factor={8} saturation={1} fade speed={3} color="#00e5ff" />
    </group>
  );
}

// --- SCENE 4: Decision/CTA (Singularity Portal) ---
function Scene4() {
  const portalRef = useRef<THREE.Group>(null);
  const singularityRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    const time = state.clock.elapsedTime;
    if (portalRef.current) {
      portalRef.current.rotation.z = time * 0.03;
      portalRef.current.rotation.x = time * 0.01;
      portalRef.current.rotation.y = time * 0.02;
    }
    if (singularityRef.current) {
      // Reptilian Trigger: Inescapable Gravity/Looming threat/opportunity
      const breathe = 1 + Math.sin(time * 1.5) * 0.03;
      singularityRef.current.scale.set(breathe, breathe, breathe);
    }
  });

  return (
    <group position={[0, 0, -300]}>
      {/* Deep Immersive Environment Backdrop */}
      <mesh position={[0, 0, -80]}>
        <planeGeometry args={[1500, 1500]} />
        <meshBasicMaterial color="#1a0400" />
      </mesh>
      {/* Localized Atmospheric Fog / Haze */}
      <mesh position={[0, 0, -30]}>
        <sphereGeometry args={[80, 32, 32]} />
        <meshBasicMaterial color="#ffaa00" transparent opacity={0.04} side={THREE.BackSide} blending={THREE.AdditiveBlending}/>
      </mesh>

      <ambientLight intensity={0.2} />
      <pointLight position={[0, 0, 0]} intensity={150} color="#ffaa00" decay={2} distance={150} />
      <pointLight position={[-20, 20, -20]} intensity={100} color="#cc00ff" decay={2} distance={100} />
      <pointLight position={[20, -20, 10]} intensity={80} color="#ffffff" decay={2} distance={100} />

      {/* Massive Singularity Structure */}
      <group position={[0, 0, -20]}>
        
        {/* Reptilian Trigger: Blinding God Rays from behind the object */}
        {[...Array(8)].map((_, i) => (
          <mesh key={`ray-${i}`} position={[0, 0, -5]} rotation={[0, 0, (i / 8) * Math.PI]}>
            <planeGeometry args={[2, 100]} />
            <meshBasicMaterial color="#ffcc00" transparent opacity={0.05} blending={THREE.AdditiveBlending} side={THREE.DoubleSide} />
          </mesh>
        ))}

        <group ref={portalRef}>
          {/* Flat Glowing Yellow Core */}
          <Sphere ref={singularityRef} args={[9, 64, 64]}>
             <meshBasicMaterial color="#ffcc00" />
          </Sphere>
          
          {/* Secondary bright aura */}
          <Sphere args={[10, 32, 32]}>
             <meshBasicMaterial color="#ffaa00" transparent opacity={0.2} blending={THREE.AdditiveBlending} />
          </Sphere>
          
          {/* Outer wireframe Torus (Cyan/Purple) */}
          <mesh rotation={[Math.PI / 4, 0, 0]}>
            <torusGeometry args={[14, 3, 10, 40]} />
            <meshBasicMaterial color="#cc00ff" wireframe transparent opacity={0.5} blending={THREE.AdditiveBlending} />
          </mesh>
          
          {/* Inner wireframe sphere */}
          <mesh rotation={[0, Math.PI / 3, 0]}>
            <sphereGeometry args={[12, 16, 16]} />
            <meshBasicMaterial color="#00e5ff" wireframe transparent opacity={0.4} blending={THREE.AdditiveBlending} />
          </mesh>
          
          {/* Intense thick ribbons/shapes (Yellow) */}
          <mesh rotation={[Math.PI / 2, Math.PI / 4, 0]}>
            <torusGeometry args={[18, 0.4, 4, 64]} />
            <meshBasicMaterial color="#ffaa00" transparent opacity={0.7} blending={THREE.AdditiveBlending} />
          </mesh>
          
          {/* Orbiting wireframe boxes */}
          {[...Array(12)].map((_, i) => {
            const angle = (i / 12) * Math.PI * 2;
            const radius = 15 + Math.random() * 5;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            const z = (Math.random() - 0.5) * 8;
            return (
              <mesh key={`box-${i}`} position={[x, y, z]} rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}>
                <boxGeometry args={[1.5, 1.5, 1.5]} />
                <meshBasicMaterial color="#ffffff" wireframe transparent opacity={0.8} blending={THREE.AdditiveBlending} />
              </mesh>
            );
          })}
        </group>
        
        {/* Deep Gravity Well background rings */}
        {[...Array(5)].map((_, i) => (
           <mesh key={i} position={[0, 0, -20 - (i * 10)]}>
             <ringGeometry args={[30 + i * 10, 32 + i * 10, 64]} />
             <meshBasicMaterial color="#cc00ff" transparent opacity={0.1 - (i * 0.02)} blending={THREE.AdditiveBlending} />
           </mesh>
        ))}
      </group>
      
      <Stars radius={80} depth={60} count={3000} factor={8} saturation={1} fade speed={4} color="#ffcc00" />
    </group>
  );
}

// --- Main Camera Controller linking scroll to 3D position ---
function CameraController() {
  const { camera } = useThree();

  useLayoutEffect(() => {
    camera.position.set(0, 0, 10);
    camera.rotation.set(0, 0, 0);

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#main-scroll-container",
          start: "top top",
          end: "bottom bottom",
          scrub: 1.2,
        }
      });

      // Travel into Scene 2 (Red Pain)
      tl.to(camera.position, {
        z: -90,
        x: 15,
        y: -10,
        ease: "power3.inOut",
      }, 0)
      .to(camera.rotation, {
        x: Math.PI / 4,
        y: -Math.PI / 6,
        z: Math.PI / 8,
        ease: "power3.inOut"
      }, 0)
      
      // Travel into Scene 3 (Cyan Mechanism)
      .to(camera.position, {
        z: -190,
        x: -20,
        y: 15,
        ease: "power3.inOut",
      }, 1)
      .to(camera.rotation, {
        x: -Math.PI / 5,
        y: Math.PI / 4,
        z: -Math.PI / 6,
        ease: "power3.inOut"
      }, 1)
      
      // Travel into Scene 4 (Gold/Purple CTA)
      .to(camera.position, {
        z: -290,
        x: 0,
        y: 0,
        ease: "power3.inOut",
      }, 2)
      .to(camera.rotation, {
        x: 0,
        y: 0,
        z: Math.PI * 2,
        ease: "power3.inOut"
      }, 2);
      
    });

    return () => ctx.revert();
  }, [camera]);

  return null;
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none bg-black">
      <Canvas dpr={[1, 2]} gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}>
         <CameraController />
         <Scene1 />
         <Scene2 />
         <Scene3 />
         <Scene4 />
      </Canvas>
    </div>
  );
}
