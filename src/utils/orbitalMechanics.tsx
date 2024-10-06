import * as THREE from 'three'

export interface OrbitalElements {
  a: number; // Semi-major axis (AU)
  e: number; // Eccentricity
  i: number; // Inclination (radians)
  om: number; // Longitude of ascending node (radians)
  w: number; // Argument of periapsis (radians)
  M: number; // Mean anomaly at epoch (radians)
  n: number; // Mean motion (radians/day)
}

export function calculateOrbitalPosition(orbit: OrbitalElements, time: number): THREE.Vector3 {
  const { a, e, i, om, w, M, n } = orbit

  // Calculate mean anomaly at the given time
  const M_t = (M + n * time) % (2 * Math.PI)

  // Solve Kepler's equation (using a simple iterative method)
  let E = M_t
  for (let j = 0; j < 10; j++) {
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

export function calculateOrbitPoints(orbit: OrbitalElements, segments: number = 128): THREE.Vector3[] {
  const points: THREE.Vector3[] = []
  for (let i = 0; i <= segments; i++) {
    const time = (i / segments) * 2 * Math.PI / orbit.n
    points.push(calculateOrbitalPosition(orbit, time))
  }
  return points
}