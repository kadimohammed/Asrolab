import React, { useMemo } from 'react'
import { Line } from '@react-three/drei'
import * as THREE from 'three'

interface NEOOrbitProps {
  a: number // semi-major axis
  e: number // eccentricity
  i: number // inclination
  om: number // longitude of ascending node
  w: number // argument of perihelion
  color: string
}

export default function NEOOrbit({ a, e, i, om, w, color }: NEOOrbitProps) {
  const points = useMemo(() => {
    const segments = 128
    const points = []
    for (let j = 0; j <= segments; j++) {
      const theta = (j / segments) * Math.PI * 2
      const r = a * (1 - e * e) / (1 + e * Math.cos(theta))
      
      // Calculate position in orbital plane
      const x = r * Math.cos(theta)
      const y = r * Math.sin(theta)
      
      // Rotate to correct orientation
      const pos = new THREE.Vector3(x, y, 0)
        .applyAxisAngle(new THREE.Vector3(1, 0, 0), i)
        .applyAxisAngle(new THREE.Vector3(0, 0, 1), om)
        .applyAxisAngle(new THREE.Vector3(0, 1, 0), w)

      if (isFinite(pos.x) && isFinite(pos.y) && isFinite(pos.z)) {
        points.push(pos)
      }
    }
    return points
  }, [a, e, i, om, w])

  if (points.length < 2) {
    return null
  }

  return <Line points={points} color={color} lineWidth={1} />
}