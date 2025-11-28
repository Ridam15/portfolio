'use client';

import { useRef, useMemo, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

// ==================== Types ====================

interface ParticleBackgroundProps {
  particleCount?: number;
  className?: string;
  opacity?: number;
  zIndex?: number;
}

// ==================== Interactive Particles ====================

function InteractiveParticles({ count = 100 }) {
  const { viewport } = useThree();
  const pointsRef = useRef<THREE.Points>(null);
  const linesRef = useRef<THREE.LineSegments>(null);

  // Track mouse position globally
  const mouseRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // Convert to normalized coordinates (-1 to 1)
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;

      mouseRef.current = { x, y };
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize particles
  const [particles] = useState(() => {
    const data = [];
    for (let i = 0; i < count; i++) {
      data.push({
        x: (Math.random() - 0.5) * viewport.width,
        y: (Math.random() - 0.5) * viewport.height,
        z: 0,
        vx: (Math.random() - 0.5) * 0.02,
        vy: (Math.random() - 0.5) * 0.02,
        originalX: 0, // placeholder
        originalY: 0, // placeholder
      });
    }
    return data;
  });

  // Buffers for geometry
  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => new Float32Array(count * 3), [count]);
  const linePositions = useMemo(() => new Float32Array(count * count * 3), [count]);
  const lineColors = useMemo(() => new Float32Array(count * count * 3), [count]);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    // Mouse position in world space
    const mouseX = (mouseRef.current.x * viewport.width) / 2;
    const mouseY = (mouseRef.current.y * viewport.height) / 2;

    let lineIndex = 0;
    const connectionDistance = 3;
    const mouseDistance = 4;

    // Update particles
    particles.forEach((particle, i) => {
      // Basic movement
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < -viewport.width / 2 || particle.x > viewport.width / 2) particle.vx *= -1;
      if (particle.y < -viewport.height / 2 || particle.y > viewport.height / 2) particle.vy *= -1;

      // Mouse interaction (Repulsion)
      const dx = mouseX - particle.x;
      const dy = mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < mouseDistance) {
        const force = (mouseDistance - dist) / mouseDistance;
        const angle = Math.atan2(dy, dx);
        particle.vx -= Math.cos(angle) * force * 0.05;
        particle.vy -= Math.sin(angle) * force * 0.05;

        // Color shift on hover
        colors[i * 3] = 0.2; // R (Cyan-ish)
        colors[i * 3 + 1] = 1;   // G
        colors[i * 3 + 2] = 1;   // B
      } else {
        // Return to normal speed/color slowly
        particle.vx *= 0.99;
        particle.vy *= 0.99;

        // Base color (Cyan/Blue)
        colors[i * 3] = 0.02;
        colors[i * 3 + 1] = 0.71;
        colors[i * 3 + 2] = 0.83;
      }

      // Update position buffer
      positions[i * 3] = particle.x;
      positions[i * 3 + 1] = particle.y;
      positions[i * 3 + 2] = particle.z;

      // Connections
      for (let j = i + 1; j < count; j++) {
        const p2 = particles[j];
        const dx2 = particle.x - p2.x;
        const dy2 = particle.y - p2.y;
        const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

        if (dist2 < connectionDistance) {
          const opacity = 1 - dist2 / connectionDistance;

          linePositions[lineIndex * 3] = particle.x;
          linePositions[lineIndex * 3 + 1] = particle.y;
          linePositions[lineIndex * 3 + 2] = particle.z;

          linePositions[lineIndex * 3 + 3] = p2.x;
          linePositions[lineIndex * 3 + 4] = p2.y;
          linePositions[lineIndex * 3 + 5] = p2.z;

          // Gradient line color
          lineColors[lineIndex * 3] = colors[i * 3];
          lineColors[lineIndex * 3 + 1] = colors[i * 3 + 1];
          lineColors[lineIndex * 3 + 2] = colors[i * 3 + 2];

          lineColors[lineIndex * 3 + 3] = colors[j * 3];
          lineColors[lineIndex * 3 + 4] = colors[j * 3 + 1];
          lineColors[lineIndex * 3 + 5] = colors[j * 3 + 2];

          lineIndex += 2;
        }
      }
    });

    // Update geometry attributes
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    pointsRef.current.geometry.attributes.color.needsUpdate = true;

    linesRef.current.geometry.setDrawRange(0, lineIndex);
    linesRef.current.geometry.attributes.position.needsUpdate = true;
    linesRef.current.geometry.attributes.color.needsUpdate = true;
  });

  return (
    <group>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count}
            args={[positions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count}
            args={[colors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.15}
          vertexColors
          transparent
          opacity={0.8}
          sizeAttenuation
        />
      </points>

      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={count * count}
            args={[linePositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            count={count * count}
            args={[lineColors, 3]}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.2}
          blending={THREE.AdditiveBlending}
        />
      </lineSegments>
    </group>
  );
}

// ==================== Main Component ====================

export default function ParticleBackground({
  particleCount = 100,
  className = '',
  opacity = 1,
  zIndex = 0,
}: ParticleBackgroundProps) {
  return (
    <div className={`fixed inset-0 ${className}`} style={{ zIndex, opacity }}>
      <Canvas
        camera={{ position: [0, 0, 10], fov: 75 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <InteractiveParticles count={particleCount} />
      </Canvas>
    </div>
  );
}

