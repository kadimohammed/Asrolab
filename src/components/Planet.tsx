import React, { useRef, useMemo } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import { Text } from '@react-three/drei'

interface PlanetProps {
  name: string
  distance: number
  size: number
  rotationSpeed: number
  orbitSpeed: number
  texturePath: string
  ringTexturePath?: string
  color: string
  isHovered: boolean
  onHover: (hovered: boolean) => void
  onClick: () => void
  position: [number, number, number]
  orbitPoints: THREE.Vector3[]
  currentDate: Date
}

export default function Planet({ 
  name, distance, size, rotationSpeed, orbitSpeed, texturePath, ringTexturePath, 
  color, isHovered, onHover, onClick, position, orbitPoints, currentDate 
}: PlanetProps) {
  const planetRef = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Mesh>(null!)
  const trailRef = useRef<THREE.Line>(null!)

  const planetTexture = useLoader(TextureLoader, texturePath)
  const ringTextureMap = ringTexturePath ? useLoader(TextureLoader, ringTexturePath) : null

  const trailMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      uniforms: {
        color: { value: new THREE.Color(color) },
      },
      vertexShader: `
        attribute float alpha;
        varying float vAlpha;
        void main() {
          vAlpha = alpha;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        varying float vAlpha;
        void main() {
          gl_FragColor = vec4(color, vAlpha);
        }
      `,
    });
  }, [color]);

  const trailGeometry = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(orbitPoints.length * 3);
    const alphas = new Float32Array(orbitPoints.length);
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('alpha', new THREE.BufferAttribute(alphas, 1));
    return geometry;
  }, [orbitPoints]);

  useFrame((state, delta) => {
    if (planetRef.current && textRef.current && trailRef.current) {
      const timeSinceEpoch = (currentDate.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24)
      planetRef.current.rotation.y = rotationSpeed * timeSinceEpoch
      textRef.current.lookAt(state.camera.position)

      // Update trail
      const trailLength = Math.floor(orbitPoints.length / 2);
      const planetIndex = Math.floor((timeSinceEpoch * orbitSpeed) % orbitPoints.length);
      const positions = trailRef.current.geometry.attributes.position.array as Float32Array;
      const alphas = trailRef.current.geometry.attributes.alpha.array as Float32Array;

      for (let i = 0; i < trailLength; i++) {
        const index = (planetIndex - i + orbitPoints.length) % orbitPoints.length;
        const point = orbitPoints[index];
        positions[i * 3] = point.x;
        positions[i * 3 + 1] = point.y;
        positions[i * 3 + 2] = point.z;
        alphas[i] = 1 - i / trailLength;
      }

      trailRef.current.geometry.attributes.position.needsUpdate = true;
      trailRef.current.geometry.attributes.alpha.needsUpdate = true;
      trailRef.current.geometry.setDrawRange(0, trailLength);
    }
  })

  const highlightColor = isHovered ? color : 'white'
  const planetEmissive = isHovered ? new THREE.Color(color).multiplyScalar(0.5) : new THREE.Color(0x000000)

  return (
    <>
      <line ref={trailRef} geometry={trailGeometry}>
        <primitive object={trailMaterial} attach="material" />
      </line>
      <group 
        position={position}
        onPointerOver={() => onHover(true)} 
        onPointerOut={() => onHover(false)}
        onClick={onClick}
      >
        <mesh ref={planetRef} name={name}>
          <sphereGeometry args={[size, 32, 32]} />
          <meshStandardMaterial map={planetTexture} emissive={planetEmissive} emissiveIntensity={0.5} />
        </mesh>
        {ringTexturePath && (
          <mesh rotation-x={Math.PI / 2}>
            <ringGeometry args={[size * 1.4, size * 2, 64]} />
            <meshBasicMaterial map={ringTextureMap} transparent opacity={0.8} side={THREE.DoubleSide} />
          </mesh>
        )}
        <Text
          ref={textRef}
          position={[0, size + 3, 0]}
          fontSize={size * 0.8}
          color={highlightColor}
          anchorX="center"
          anchorY="middle"
          outlineWidth={0.1}
          outlineColor="black"
        >
          {name}
        </Text>
      </group>
    </>
  )
}