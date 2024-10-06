import { EffectComposer, Bloom } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'

interface PostProcessingProps {
  bloomIntensity: number;
  bloomThreshold: number;
}

export function PostProcessing({ bloomIntensity, bloomThreshold }: PostProcessingProps) {
  return (
    <EffectComposer>
      <Bloom 
        intensity={bloomIntensity}
        luminanceThreshold={bloomThreshold}
        luminanceSmoothing={0.9}
        blendFunction={BlendFunction.ADD}
      />
    </EffectComposer>
  )
}