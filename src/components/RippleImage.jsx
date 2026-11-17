import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useTexture } from '@react-three/drei'
import * as THREE from 'three'

// A crisp photo on a WebGL plane. Move the cursor over it and the image ripples like water.
const vertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`
const fragment = /* glsl */ `
  uniform sampler2D uTex;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uHover;
  uniform float uPlane;
  uniform float uImg;
  varying vec2 vUv;
  void main() {
    vec2 uv = vUv;
    vec2 d = uv - uMouse;
    d.x *= uPlane;
    float dist = length(d);
    float wave = sin(dist * 30.0 - uTime * 4.0) * exp(-dist * 4.5) * uHover;
    uv += normalize(d + 1e-4) * wave * 0.018;
    // cover-fit the photo
    vec2 s = uPlane > uImg ? vec2(1.0, uImg / uPlane) : vec2(uPlane / uImg, 1.0);
    vec2 cuv = (uv - 0.5) * s + 0.5;
    // a slow breathing zoom keeps it alive
    cuv = (cuv - 0.5) * (0.97 - 0.015 * sin(uTime * 0.4)) + 0.5;
    vec4 c = texture2D(uTex, cuv);
    gl_FragColor = linearToOutputTexel(c);
  }
`

function Plane({ src, hover }) {
  const tex = useTexture(src)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 8
  const mat = useRef()
  useFrame((state, dt) => {
    const u = mat.current.uniforms
    u.uTime.value += dt
    const w = state.size.width / state.size.height
    u.uPlane.value = w
    u.uMouse.value.lerp(new THREE.Vector2(state.pointer.x * 0.5 + 0.5, state.pointer.y * 0.5 + 0.5), 0.12)
    u.uHover.value += ((hover.current ? 1 : 0.12) - u.uHover.value) * 0.06
  })
  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={{
          uTex: { value: tex },
          uMouse: { value: new THREE.Vector2(0.5, 0.5) },
          uTime: { value: 0 },
          uHover: { value: 0.1 },
          uPlane: { value: 1 },
          uImg: { value: tex.image.width / tex.image.height },
        }}
      />
    </mesh>
  )
}

export default function RippleImage({ src, className = '' }) {
  const hover = useRef(false)
  return (
    <div
      className={`overflow-hidden ${className}`}
      onMouseEnter={() => (hover.current = true)}
      onMouseLeave={() => (hover.current = false)}
    >
      <Canvas flat dpr={[1, 2]} gl={{ antialias: true }} orthographic camera={{ position: [0, 0, 1] }}>
        <Plane src={src} hover={hover} />
      </Canvas>
    </div>
  )
}
