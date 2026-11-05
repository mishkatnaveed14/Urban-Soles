import {
  ACESFilmicToneMapping,
  BufferGeometry,
  CatmullRomCurve3,
  CircleGeometry,
  DirectionalLight,
  ExtrudeGeometry,
  Group,
  HemisphereLight,
  Line,
  LineBasicMaterial,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  Shape,
  SRGBColorSpace,
  TubeGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { gsap } from 'gsap'

const canvas = document.getElementById('shoe-canvas')
const hero = document.querySelector('.home-hero')
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

if (hero && !reduceMotion) {
  gsap.fromTo(
    hero.querySelectorAll('.hero-kicker, .hero-title, .hero-description, .hero-cta, .hero-note'),
    { opacity: 0, y: 22 },
    { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' },
  )
}

function createShoeScene() {
  if (!(canvas instanceof HTMLCanvasElement)) return

  const scene = new Scene()
  const camera = new PerspectiveCamera(34, 1, 0.1, 100)
  camera.position.set(0, 0, 9)

  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2))
  renderer.outputColorSpace = SRGBColorSpace
  renderer.toneMapping = ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.15

  scene.add(new HemisphereLight(0xfff7ed, 0x7c8493, 2.2))

  const keyLight = new DirectionalLight(0xffffff, 3.2)
  keyLight.position.set(-3, 5, 7)
  scene.add(keyLight)

  const rimLight = new DirectionalLight(0xfb923c, 2.4)
  rimLight.position.set(4, 1, -3)
  scene.add(rimLight)

  const interactiveShoe = new Group()
  scene.add(interactiveShoe)

  const shoe = new Group()
  shoe.scale.setScalar(1.05)
  interactiveShoe.add(shoe)

  function makeShape(points) {
    const shape = new Shape()
    shape.moveTo(points[0][0], points[0][1])
    for (const [x, y] of points.slice(1)) shape.lineTo(x, y)
    shape.closePath()
    return shape
  }

  function makePart(shape, material, depth, z = 0) {
    const geometry = new ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelSegments: 3,
      steps: 1,
      bevelSize: 0.055,
      bevelThickness: 0.055,
      curveSegments: 12,
    })
    geometry.translate(0, 0, -depth / 2)
    const mesh = new Mesh(geometry, material)
    mesh.position.z = z
    mesh.castShadow = true
    mesh.receiveShadow = true
    shoe.add(mesh)
    return mesh
  }

  const soleMaterial = new MeshStandardMaterial({
    color: 0xfaf8f4,
    roughness: 0.48,
    metalness: 0.02,
  })
  const upperMaterial = new MeshStandardMaterial({
    color: 0x202a3b,
    roughness: 0.42,
    metalness: 0.08,
  })
  const accentMaterial = new MeshStandardMaterial({
    color: 0xf97316,
    roughness: 0.36,
    metalness: 0.04,
  })

  makePart(makeShape([
    [-2.25, -0.5], [-2.36, -0.36], [-2.2, -0.19], [-1.4, -0.28],
    [-0.55, -0.37], [0.55, -0.34], [1.55, -0.22], [2.15, -0.19],
    [2.32, -0.3], [2.27, -0.47], [1.9, -0.55], [-1.8, -0.58],
  ]), soleMaterial, 0.9, 0)

  makePart(makeShape([
    [-2.18, -0.31], [-2.27, 0.52], [-2.15, 0.78], [-1.32, 0.93],
    [-1.02, 0.85], [-0.55, 0.22], [0.38, 0.1], [1.34, 0.05],
    [2.02, 0.02], [2.27, -0.17], [2.1, -0.34], [0.44, -0.42],
    [-0.7, -0.39], [-1.63, -0.3],
  ]), upperMaterial, 0.72, 0.06)

  makePart(makeShape([
    [-2.11, 0.48], [-1.98, 0.7], [-1.43, 0.81], [-1.2, 0.74],
    [-1.43, 0.23], [-1.75, 0.03], [-2.08, 0.12],
  ]), accentMaterial, 0.08, 0.38)

  makePart(makeShape([
    [-1.17, 0.72], [-0.91, 1.13], [-0.55, 1.17], [-0.38, 0.2],
    [-0.69, 0.13],
  ]), soleMaterial, 0.24, 0.06)

  const eyeletMaterial = new MeshStandardMaterial({
    color: 0xfb923c,
    metalness: 0.25,
    roughness: 0.35,
  })

  for (let index = 0; index < 4; index += 1) {
    const x = -1.08 + index * 0.19
    const y = 0.66 - index * 0.105
    const eyelet = new Mesh(new CircleGeometry(0.048, 20), eyeletMaterial)
    eyelet.position.set(x, y, 0.47)
    shoe.add(eyelet)

    const lace = new BufferGeometry().setFromPoints([
      new Vector3(x, y, 0.49),
      new Vector3(-0.2 + index * 0.12, y - 0.13, 0.49),
    ])
    shoe.add(new Line(lace, new LineBasicMaterial({ color: 0xfff7ed, linewidth: 2 })))
  }

  const swooshCurve = new CatmullRomCurve3([
    new Vector3(-0.42, 0.19, 0.48),
    new Vector3(0.04, 0.04, 0.48),
    new Vector3(0.62, 0.1, 0.48),
    new Vector3(1.34, 0.22, 0.48),
    new Vector3(0.92, -0.02, 0.48),
    new Vector3(0.24, -0.12, 0.48),
  ])
  shoe.add(new Mesh(
    new TubeGeometry(swooshCurve, 36, 0.045, 8, false),
    accentMaterial,
  ))

  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect()
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.position.z = width < 600 ? 10.5 : 9
    camera.updateProjectionMatrix()
    renderer.render(scene, camera)
  }

  const resizeObserver = new ResizeObserver(resize)
  resizeObserver.observe(canvas)
  resize()

  if (!reduceMotion) {
    gsap.to(shoe.rotation, {
      y: 0.28,
      x: 0.08,
      duration: 3.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })
    gsap.to(shoe.position, {
      y: 0.14,
      duration: 2.4,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    })

    hero?.addEventListener('pointermove', (event) => {
      const bounds = hero.getBoundingClientRect()
      const x = (event.clientX - bounds.left) / bounds.width - 0.5
      const y = (event.clientY - bounds.top) / bounds.height - 0.5
      gsap.to(interactiveShoe.rotation, {
        x: y * 0.22,
        y: x * 0.32,
        duration: 0.8,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })

    hero?.addEventListener('pointerleave', () => {
      gsap.to(interactiveShoe.rotation, {
        x: 0.08,
        y: 0,
        duration: 1.1,
        ease: 'power2.out',
        overwrite: 'auto',
      })
    })
  }

  const render = () => {
    renderer.render(scene, camera)
    requestAnimationFrame(render)
  }
  render()
}

createShoeScene()
