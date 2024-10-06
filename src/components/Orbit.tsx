import React, { useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';

interface OrbitProps {
  radius: number;
  color: string;
  isHovered: boolean;
}

export default function Orbit({ radius, color, isHovered }: OrbitProps) {
  const points = useMemo(() => {
    const segments = 64;
    const points = [];
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(theta) * radius,
        0,
        Math.sin(theta) * radius
      ));
    }
    return points;
  }, [radius]);

  return <Line points={points} color={color} lineWidth={isHovered ? 2 : 1} />;
}