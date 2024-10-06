import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import { TextureLoader } from 'three'
import * as THREE from 'three'
import Planet from './Planet'
import NEOObject from './NEOObject'
import NEOOrbit from './NEOOrbit'
import { calculateOrbitalPosition, calculateOrbitPoints, OrbitalElements } from '../utils/orbitalMechanics'
import SpeedControl from './SpeedControl'
import ViewerMenu from './ViewerMenu'
import { Html } from '@react-three/drei'

interface NEOData {
  spkid: string
  name: string
  a: number
  e: number
  i: number
  om: number
  w: number
  H: number
  M: number // Mean anomaly
  n: number // Mean motion
}

interface SolarSystemProps {
  speed: number;
  onPlanetFocus: (planetName: string) => void;
  isFloating: boolean;
}

// Gravitational constant * Sun's mass (in AU^3/day^2)
const GM = 0.000295912208286

// Add this constant for Earth's orbital period in days
const EARTH_YEAR = 365.25;

// Update the PLANETS array to include orbital periods
const PLANETS: (OrbitalElements & { name: string; size: number; rotationSpeed: number; color: string; texturePath: string; ringTexturePath?: string; orbitalPeriod: number })[] = [
  {
    name: "Mercury",
    a: 40,
    e: 0.2056,
    i: 7 * Math.PI / 180,
    om: 48 * Math.PI / 180,
    w: 29 * Math.PI / 180,
    M: 0,
    n: 4.15 * Math.PI / 180,
    size: 2,
    rotationSpeed: 0.01,
    color: "#8C7E6F",
    texturePath: "/2k_mercury.jpg",
    orbitalPeriod: 87.97 // Mercury's orbital period in Earth days
  },
  {
    name: "Venus",
    a: 70,
    e: 0.0068,
    i: 3.39 * Math.PI / 180,
    om: 76.68 * Math.PI / 180,
    w: 54.89 * Math.PI / 180,
    M: 0,
    n: 1.62 * Math.PI / 180,
    size: 3.5,
    rotationSpeed: 0.005,
    color: "#E6C498",
    texturePath: "/2k_venus_surface.jpg",
    orbitalPeriod: 224.7 // Venus' orbital period in Earth days
  },
  {
    name: "Earth",
    a: 100,
    e: 0.0167,
    i: 0,
    om: 0,
    w: 102.9372 * Math.PI / 180,
    M: 0,
    n: 0.9856 * Math.PI / 180,
    size: 4,
    rotationSpeed: 0.01,
    color: "#4F94CD",
    texturePath: "/2k_earth_daymap.jpg",
    orbitalPeriod: EARTH_YEAR
  },
  {
    name: "Mars",
    a: 140,
    e: 0.0934,
    i: 1.85 * Math.PI / 180,
    om: 49.58 * Math.PI / 180,
    w: 286.5 * Math.PI / 180,
    M: 0,
    n: 0.524 * Math.PI / 180,
    size: 3,
    rotationSpeed: 0.01,
    color: "#E27B58",
    texturePath: "/2k_mars.jpg",
    orbitalPeriod: 686.98 // Mars' orbital period in Earth days
  },
  {
    name: "Jupiter",
    a: 220,
    e: 0.0489,
    i: 1.304 * Math.PI / 180,
    om: 100.56 * Math.PI / 180,
    w: 273.87 * Math.PI / 180,
    M: 0,
    n: 0.083 * Math.PI / 180,
    size: 12,
    rotationSpeed: 0.02,
    color: "#C88B3A",
    texturePath: "/2k_jupiter.jpg",
    orbitalPeriod: 4332.59 // Jupiter's orbital period in Earth days
  },
  {
    name: "Saturn",
    a: 320,
    e: 0.0557,
    i: 2.486 * Math.PI / 180,
    om: 113.71 * Math.PI / 180,
    w: 339.39 * Math.PI / 180,
    M: 0,
    n: 0.033 * Math.PI / 180,
    size: 10,
    rotationSpeed: 0.018,
    color: "#E6BE8A",
    texturePath: "/2k_saturn.jpg",
    ringTexturePath: "/2k_saturn_ring_alpha.png",
    orbitalPeriod: 10759.22 // Saturn's orbital period in Earth days
  },
  {
    name: "Uranus",
    a: 400,
    e: 0.0472,
    i: 0.770 * Math.PI / 180,
    om: 74.23 * Math.PI / 180,
    w: 96.73 * Math.PI / 180,
    M: 0,
    n: 0.012 * Math.PI / 180,
    size: 7,
    rotationSpeed: 0.015,
    color: "#9CC4D9",
    texturePath: "/2k_uranus.jpg",
    orbitalPeriod: 30685.4 // Uranus' orbital period in Earth days
  },
  {
    name: "Neptune",
    a: 460,
    e: 0.0086,
    i: 1.769 * Math.PI / 180,
    om: 131.72 * Math.PI / 180,
    w: 273.24 * Math.PI / 180,
    M: 0,
    n: 0.006 * Math.PI / 180,
    size: 6.8,
    rotationSpeed: 0.017,
    color: "#3E54E8",
    texturePath: "/2k_neptune.jpg",
    orbitalPeriod: 60189 // Neptune's orbital period in Earth days
  }
]

function calculatePosition(neo: NEOData, time: number): THREE.Vector3 {
  const { a, e, i, om, w, M, n } = neo

  // Calculate mean anomaly at the given time
  const M_t = (M + n * time) % (2 * Math.PI)

  // Solve Kepler's equation (using a simple iterative method)
  let E = M_t
  for (let j = 0; j < 5; j++) {
    E = M_t + e * Math.sin(E)
  }

  // Calculate true anomaly
  const v = 2 * Math.atan(Math.sqrt((1 + e) / (1 - e)) * Math.tan(E / 2))

  // Calculate distance from focus
  const r = a * (1 - e * e) / (1 + e * Math.cos(v))

  // Calculate position in orbital plane
  const x = r * Math.cos(v)
  const y = r * Math.sin(v)

  // Rotate to correct orientation
  const pos = new THREE.Vector3(x, y, 0)
    .applyAxisAngle(new THREE.Vector3(1, 0, 0), i)
    .applyAxisAngle(new THREE.Vector3(0, 0, 1), om)
    .applyAxisAngle(new THREE.Vector3(0, 1, 0), w)

  return pos
}

export default function SolarSystem({ onPlanetFocus }: SolarSystemProps) {
  const sunTexture = useLoader(TextureLoader, '/2k_sun.jpg')
  const sunRef = useRef<THREE.Mesh>(null!)
  const [hoveredPlanet, setHoveredPlanet] = useState<string | null>(null)
  const [neoData, setNeoData] = useState<NEOData[]>([])
  const [currentDate, setCurrentDate] = useState(() => new Date())

  const orbitPoints = useMemo(() => {
    return PLANETS.map(planet => calculateOrbitPoints(planet))
  }, [])

  useFrame((state, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.05
    }
  })

  const handlePlanetHover = useCallback((name: string, hovered: boolean) => {
    setHoveredPlanet(hovered ? name : null)
  }, [])

  const handlePlanetClick = useCallback((name: string) => {
    onPlanetFocus(name)
  }, [onPlanetFocus])

  const handleDateChange = useCallback((newDate: Date) => {
    setCurrentDate(newDate)
  }, [])

  const handleZoomIn = () => {
    // Implement zoom in logic
  }

  const handleZoomOut = () => {
    // Implement zoom out logic
  }

  const handleToggleLight = () => {
    // Implement toggle light logic
  }

  const handleToggleFullscreen = () => {
    // Implement fullscreen toggle logic
  }

  useEffect(() => {
    fetch('/cleaned_data.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      .then(data => {
        console.log("CSV data loaded:", data.slice(0, 200) + "...");
        const rows = data.split('\n').slice(1)
        console.log(`Number of rows: ${rows.length}`);
        console.log("First row:", rows[0]);
        const parsedData = rows.slice(0, 50)
          .map(row => {
            const columns = row.split(',')
            const a = parseFloat(columns[32])
            const e = parseFloat(columns[31]) || 0 // Use 0 if e is NaN
            const neo = {
              spkid: columns[0],
              name: columns[4] || columns[5] || 'Unnamed NEO',
              a: a,
              e: e,
              i: parseFloat(columns[34]) * Math.PI / 180, // Convert to radians
              om: parseFloat(columns[35]) * Math.PI / 180, // Convert to radians
              w: parseFloat(columns[36]) * Math.PI / 180, // Convert to radians
              H: parseFloat(columns[1]),
              M: parseFloat(columns[40]) * Math.PI / 180, // Convert to radians
              n: Math.sqrt(GM / (a * a * a)) // Calculate mean motion
            }
            console.log("Parsed NEO:", neo);
            return neo;
          })
          .filter(neo => {
            const isValid = isFinite(neo.a) && neo.a > 0 && isFinite(neo.i) && isFinite(neo.om) && isFinite(neo.w) && isFinite(neo.M);
            if (!isValid) {
              console.log("Filtered out NEO:", neo);
            }
            return isValid;
          })
        console.log("Parsed NEO data:", parsedData);
        setNeoData(parsedData)
      })
      .catch(error => {
        console.error("Error loading NEO data:", error);
      });
  }, [])

  return (
    <group>
      <mesh ref={sunRef} name="Sun">
        <sphereGeometry args={[20, 32, 32]} />
        <meshBasicMaterial map={sunTexture} />
      </mesh>

      {PLANETS.map((planet, index) => {
        const timeSinceEpoch = (currentDate.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24)
        const position = calculateOrbitalPosition(planet, timeSinceEpoch)
        const scaledPosition: [number, number, number] = [
          position.x,
          position.y,
          position.z
        ]

        return (
          <Planet
            key={planet.name}
            name={planet.name}
            distance={planet.a}
            size={planet.size}
            rotationSpeed={planet.rotationSpeed}
            orbitSpeed={2 * Math.PI / planet.orbitalPeriod}
            texturePath={planet.texturePath}
            ringTexturePath={planet.ringTexturePath}
            color={planet.color}
            isHovered={hoveredPlanet === planet.name}
            onHover={(hovered) => handlePlanetHover(planet.name, hovered)}
            onClick={() => handlePlanetClick(planet.name)}
            position={scaledPosition}
            orbitPoints={orbitPoints[index]}
            currentDate={currentDate}
          />
        )
      })}

      {neoData.map((neo, index) => {
        const scaleFactor = 100
        const size = Math.max(0.5, (30 - neo.H) / 10)
        const color = `hsl(${index * 137.5 % 360}, 50%, 50%)`
        
        const timeSinceEpoch = (currentDate.getTime() - new Date('2000-01-01').getTime()) / (1000 * 60 * 60 * 24)
        const position = calculatePosition(neo, timeSinceEpoch)
        const scaledPosition: [number, number, number] = [
          position.x * scaleFactor,
          position.y * scaleFactor,
          position.z * scaleFactor
        ]

        return (
          <group key={neo.spkid}>
            <NEOObject
              position={scaledPosition}
              name={neo.name}
              size={size}
              color={color}
            />
            <NEOOrbit
              a={neo.a * scaleFactor}
              e={neo.e}
              i={neo.i}
              om={neo.om}
              w={neo.w}
              color={color}
            />
          </group>
        )
      })}

      <Html fullscreen>
        <div style={{
          position: 'absolute',
          bottom: '1rem',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1000,
        }}>
          <SpeedControl currentDate={currentDate} onDateChange={handleDateChange} />
        </div>
        <div style={{
          position: 'absolute',
          right: '1rem',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 1000,
        }}>
          <ViewerMenu
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onToggleLight={handleToggleLight}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>
      </Html>
    </group>
  )
}