import { Canvas } from "@react-three/fiber";
import {
  ContactShadows,
  Environment,
  Float,
  RoundedBox,
  Sparkles,
  useGLTF,
} from "@react-three/drei";

import { Suspense, useLayoutEffect } from "react";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function Lace({ z, y }) {
  const points = [
    new THREE.Vector3(-0.35, y, z),
    new THREE.Vector3(-0.12, y + 0.07, z + 0.02),
    new THREE.Vector3(0.12, y + 0.07, z + 0.02),
    new THREE.Vector3(0.35, y, z),
  ];

  const curve = new THREE.CatmullRomCurve3(points);

  return (
    <mesh>
      <tubeGeometry args={[curve, 24, 0.018, 8, false]} />
      <meshStandardMaterial color="white" />
    </mesh>
  );
}

function ProceduralSneaker({ product }) {
  const isLight = !product.color.toLowerCase().includes("black");

  return (
    <group rotation={[0.18, -0.3, -0.12]} scale={1.1}>
      {/* Sole */}
      <RoundedBox
        args={[3, 0.25, 1.12]}
        radius={0.12}
        smoothness={5}
        position={[0, -0.38, 0]}
      >
        <meshStandardMaterial color="#eeeeee" roughness={0.65} />
      </RoundedBox>

      {/* Orange outsole detail */}
      <RoundedBox
        args={[2.9, 0.07, 1.14]}
        radius={0.035}
        smoothness={4}
        position={[0, -0.51, 0]}
      >
        <meshStandardMaterial color="#F97316" roughness={0.5} />
      </RoundedBox>

      {/* Main upper */}
      <mesh position={[-0.02, 0.02, 0]} scale={[1.25, 0.43, 0.48]}>
        <sphereGeometry args={[1, 48, 32]} />
        <meshStandardMaterial color={isLight ? "#f4f1ed" : "#181818"} roughness={0.6} />
      </mesh>

      {/* Toe */}
      <mesh position={[0.9, -0.03, 0]} scale={[0.43, 0.34, 0.49]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color={isLight ? "#e5e2de" : "#242424"} roughness={0.55} />
      </mesh>

      {/* Heel */}
      <mesh position={[-1, 0.03, 0]} scale={[0.4, 0.4, 0.47]}>
        <sphereGeometry args={[1, 32, 24]} />
        <meshStandardMaterial color={isLight ? "#dedbd7" : "#111111"} />
      </mesh>

      {/* Orange side accent */}
      <mesh position={[0.05, 0.12, 0.465]} rotation={[0, 0, -0.18]}>
        <boxGeometry args={[1.05, 0.08, 0.035]} />
        <meshStandardMaterial
          color="#F97316"
          emissive="#F97316"
          emissiveIntensity={0.3}
        />
      </mesh>

      {/* Tongue */}
      <mesh position={[-0.05, 0.42, 0]} rotation={[0, 0, 0.12]}>
        <RoundedBox args={[0.45, 0.45, 0.4]} radius={0.1}>
          <meshStandardMaterial color="#303030" />
        </RoundedBox>
      </mesh>

      {/* Laces */}
      {[-0.24, -0.09, 0.06, 0.21].map((y, i) => (
        <Lace key={i} z={0.49} y={y + 0.19} />
      ))}

      {/* Orange lace loops */}
      {[-0.18, 0.02, 0.22].map((y, i) => (
        <mesh
          key={i}
          position={[-0.05, y + 0.2, 0.51]}
          rotation={[0, 0, 0.2]}
        >
          <torusGeometry args={[0.07, 0.018, 8, 20]} />
          <meshStandardMaterial color="#F97316" />
        </mesh>
      ))}
    </group>
  );
}

// Optional: use a real GLB whenever a model path is provided.
function RealSneaker({ path }) {
  const { scene } = useGLTF(path);
  const clone = scene.clone(true);

  return <primitive object={clone} scale={2} />;
}

function SneakerContent({ product, sneakerRef, sectionRef }) {
  useLayoutEffect(() => {
    const sneaker = sneakerRef.current;
    if (!sectionRef.current || !sneaker) return undefined;

    const ctx = gsap.context(() => {
      gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.3,
        },
      })
        .to(sneaker.rotation, {
          y: Math.PI * 2,
          x: 0.15,
          ease: "none",
        })
        .to(
          sneaker.position,
          {
            y: 0.35,
            ease: "none",
          },
          0
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [sectionRef, sneakerRef]);

  return (
    <>
      <ambientLight intensity={1.1} />

      <spotLight
        position={[4, 6, 5]}
        intensity={90}
        color="#F97316"
        angle={0.5}
        penumbra={1}
      />

      <directionalLight position={[-4, 3, 5]} intensity={2.5} />

      <pointLight position={[0, -1, 3]} intensity={12} color="#F97316" />

      <group ref={sneakerRef}>
        <Float speed={1.3} floatIntensity={0.25} rotationIntensity={0.08}>
          {product.model ? (
            <RealSneaker path={product.model} />
          ) : (
            <ProceduralSneaker product={product} />
          )}
        </Float>
      </group>

      <Sparkles
        count={35}
        scale={5}
        size={2}
        speed={0.3}
        color="#F97316"
      />

      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.4}
        scale={7}
        blur={2.5}
      />

      <Environment preset="city" />
    </>
  );
}

export default function SneakerScene({ product, sneakerRef, sectionRef }) {
  return (
    <Canvas
      camera={{
        position: [0, 0, 7],
        fov: 38,
      }}
      dpr={[1, 1.5]}
      gl={{
        antialias: true,
        alpha: true,
      }}
    >
      <Suspense fallback={null}>
        <SneakerContent
          product={product}
          sneakerRef={sneakerRef}
          sectionRef={sectionRef}
        />
      </Suspense>
    </Canvas>
  );
}
