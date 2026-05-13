"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Environment, ContactShadows, Float, useGLTF } from "@react-three/drei";
import { useDesignStore } from "@/store/useDesignStore";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { motion } from "framer-motion-3d";

// Parametric clothing component
function ParametricClothing({ design }: { design: any }) {
  const groupRef = useRef<THREE.Group>(null);

  // Animate the group slightly based on the design change
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.scale.set(0.9, 0.9, 0.9);
      // Simple bounce effect when design changes
      setTimeout(() => {
        if (groupRef.current) {
          groupRef.current.scale.set(1, 1, 1);
        }
      }, 100);
    }
  }, [design]);

  if (!design) {
    return (
      <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
        <mesh>
          <torusKnotGeometry args={[1, 0.3, 100, 16]} />
          <meshStandardMaterial color="#8b5cf6" wireframe />
        </mesh>
      </Float>
    );
  }

  // Parse color
  let modelColor = "#ffffff";
  if (design.color && design.color.startsWith("#")) {
    modelColor = design.color;
  } else if (design.color) {
    // Basic color name mapping fallback
    modelColor = design.color.toLowerCase();
  }

  // Parse size
  const scale = design.fit === "oversized" ? 1.2 : design.fit === "slim" ? 0.8 : 1.0;
  
  // Fabric modifier (roughness/metalness)
  let roughness = 0.8;
  let metalness = 0.1;
  if (design.fabric === "silk") {
    roughness = 0.2;
    metalness = 0.4;
  } else if (design.fabric === "leather") {
    roughness = 0.4;
    metalness = 0.6;
  } else if (design.fabric === "denim") {
    roughness = 0.9;
    metalness = 0.0;
  }

  const baseMaterial = new THREE.MeshStandardMaterial({
    color: modelColor,
    roughness,
    metalness,
  });

  return (
    <group ref={groupRef} scale={[scale, scale, scale]}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        {/* Parametric shapes based on type */}
        {design.type === "hoodie" && (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]} material={baseMaterial}>
              <cylinderGeometry args={[1, 1, 3, 32]} />
            </mesh>
            {/* Hood */}
            <mesh position={[0, 2, -0.2]} material={baseMaterial}>
              <sphereGeometry args={[0.8, 32, 32, 0, Math.PI * 2, 0, Math.PI / 1.5]} />
            </mesh>
            {/* Sleeves */}
            {design.sleeve_length !== "none" && (
              <>
                <mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, Math.PI / 4]} material={baseMaterial}>
                  <cylinderGeometry args={[0.4, 0.3, design.sleeve_length === "long" ? 2.5 : 1.2, 16]} />
                </mesh>
                <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]} material={baseMaterial}>
                  <cylinderGeometry args={[0.4, 0.3, design.sleeve_length === "long" ? 2.5 : 1.2, 16]} />
                </mesh>
              </>
            )}
          </group>
        )}

        {design.type === "tshirt" && (
          <group>
            {/* Body */}
            <mesh position={[0, 0, 0]} material={baseMaterial}>
              <cylinderGeometry args={[1, 1, 2.5, 32]} />
            </mesh>
            {/* Sleeves */}
            {design.sleeve_length !== "none" && (
              <>
                <mesh position={[-1.2, 0.5, 0]} rotation={[0, 0, Math.PI / 3]} material={baseMaterial}>
                  <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
                </mesh>
                <mesh position={[1.2, 0.5, 0]} rotation={[0, 0, -Math.PI / 3]} material={baseMaterial}>
                  <cylinderGeometry args={[0.4, 0.4, 1.2, 16]} />
                </mesh>
              </>
            )}
          </group>
        )}

        {design.type === "jacket" && (
          <group>
            {/* Body Open */}
            <mesh position={[0, 0, 0]} material={baseMaterial}>
              <cylinderGeometry args={[1.1, 1.1, 2.8, 32, 1, false, 0, Math.PI * 1.8]} />
            </mesh>
            {/* Sleeves */}
            <mesh position={[-1.3, 0.5, 0]} rotation={[0, 0, Math.PI / 4]} material={baseMaterial}>
              <cylinderGeometry args={[0.5, 0.4, 2.6, 16]} />
            </mesh>
            <mesh position={[1.3, 0.5, 0]} rotation={[0, 0, -Math.PI / 4]} material={baseMaterial}>
              <cylinderGeometry args={[0.5, 0.4, 2.6, 16]} />
            </mesh>
          </group>
        )}

        {design.type === "dress" && (
          <group>
            {/* Body */}
            <mesh position={[0, -0.5, 0]} material={baseMaterial}>
              <cylinderGeometry args={[0.8, 1.5, 4, 32]} />
            </mesh>
          </group>
        )}
      </Float>
    </group>
  );
}

export default function ThreeDViewer() {
  const { currentDesign } = useDesignStore();

  return (
    <div className="w-full h-full relative bg-black rounded-3xl overflow-hidden border border-white/10 shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/50 m-4 rounded-tl-lg pointer-events-none z-10" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-accent/50 m-4 rounded-br-lg pointer-events-none z-10" />
      
      {!currentDesign && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center z-10 pointer-events-none">
          <p className="text-muted-foreground animate-pulse">Awaiting your design prompt...</p>
        </div>
      )}

      <Canvas camera={{ position: [0, 2, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <spotLight position={[-10, 10, -10]} angle={0.15} penumbra={1} intensity={0.5} />
        
        <ParametricClothing design={currentDesign} />
        
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <Environment preset="city" />
        <OrbitControls 
          enablePan={false} 
          minDistance={4} 
          maxDistance={12}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
      
      {currentDesign && currentDesign.confidence_score && (
        <div className="absolute top-4 right-4 glass-panel px-3 py-1 rounded-full text-xs font-medium z-10 flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          AI Confidence: {currentDesign.confidence_score}%
        </div>
      )}
    </div>
  );
}
