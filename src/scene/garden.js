/**
 * scene/garden.js
 *
 * The homepage's living portrait: leaves arranged by the golden angle, the rule real plants use to
 * pack leaves around a stem, growing out from behind the portrait and leaning away from the cursor.
 *
 * Built to stay cheap. Each leaf is one instance of a single small mesh and all of its motion happens
 * in the vertex shader, so the JavaScript per frame is a handful of uniform updates. Rendering stops
 * when the hero is off-screen or the tab is hidden, and quality drops if the device can't keep up.
 */

import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  InstancedBufferAttribute,
  InstancedBufferGeometry,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from 'three'

const GOLDEN_ANGLE = Math.PI * (3 - Math.sqrt(5))
const CAMERA_Z = 10
const FOV = 30
const GROW_SECONDS = 2.8

const leafVertex = /* glsl */ `
  attribute vec3 aRoot;   // radius fraction, azimuth, depth
  attribute vec4 aShape;  // length, width, tilt, curl
  attribute vec3 aMisc;   // tone, phase, growth order

  uniform float uTime;
  uniform float uGrow;
  uniform float uScroll;
  uniform float uRadius;
  uniform vec2 uCenter;
  uniform vec3 uPointer;  // world x, world y, strength

  varying vec2 vLeaf;
  varying vec3 vNormal2;
  varying float vTone;
  varying float vShade;

  void main() {
    float u = position.x;
    float v = position.y;

    float start = aMisc.z * 0.62;
    float g = smoothstep(start, start + 0.38, uGrow);
    float size = g * (1.0 + 0.1 * sin(g * 3.14159));

    float azimuth = aRoot.y + uTime * 0.012 + uScroll * 0.8;
    vec2 dir = vec2(cos(azimuth), sin(azimuth));
    vec3 R = vec3(dir, 0.0);
    vec3 T = vec3(-dir.y, dir.x, 0.0);
    vec3 Z = vec3(0.0, 0.0, 1.0);

    float radius = aRoot.x * uRadius * (1.0 + uScroll * 0.35);
    vec3 root = vec3(uCenter + dir * radius, aRoot.z * uRadius);

    vec2 fromPointer = root.xy - uPointer.xy;
    float reach = uRadius * uRadius * 0.11;
    float push = uPointer.z * exp(-dot(fromPointer, fromPointer) / reach);

    float sway = sin(uTime * 0.7 + aMisc.y + aRoot.x * 5.0) * 0.05
               + sin(uTime * 0.23 + aMisc.y * 2.0) * 0.04;

    // Leaves unfurl as they grow, then keep a little of that curl
    float bend = aShape.w * (1.0 + (1.0 - g) * 2.5) + sway + push * 1.25 + 0.0001;
    float tilt = aShape.z + push * 0.35;
    float angle = tilt + bend * v;
    float len = aShape.x * size * uRadius;

    // The spine is the integral of a direction that turns steadily along the leaf
    float along = (sin(angle) - sin(tilt)) / bend;
    float lift = (cos(tilt) - cos(angle)) / bend;
    vec3 spine = root + (R * along + Z * lift) * len;
    spine += T * len * v * v * (sway * 0.9 + push * dot(normalize(fromPointer + 0.001), T.xy) * 0.5);

    float profile = pow(sin(3.14159 * pow(v, 0.72)), 0.9);
    float width = aShape.y * size * profile * uRadius;
    vec3 tangent = R * cos(angle) + Z * sin(angle);
    vec3 normal = normalize(cross(T, tangent));

    // A slight fold along the midrib makes each half catch the light differently
    vec3 world = spine + T * u * width + normal * abs(u) * width * 0.35;
    vNormal2 = normalize(normal + T * u * 0.55);

    vLeaf = vec2(u, v);
    vTone = aMisc.x;
    vShade = clamp(0.32 + aRoot.x * 0.68 + aRoot.z * 0.9, 0.0, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(world, 1.0);
  }
`

const leafFragment = /* glsl */ `
  precision highp float;

  uniform vec3 uDeep;
  uniform vec3 uMid;
  uniform vec3 uBright;
  uniform vec3 uPale;
  uniform vec3 uNight;

  varying vec2 vLeaf;
  varying vec3 vNormal2;
  varying float vTone;
  varying float vShade;

  const vec3 LIGHT = vec3(-0.52, 0.62, 0.59);

  void main() {
    vec3 n = normalize(vNormal2);
    if (!gl_FrontFacing) n = -n;

    float wrapped = dot(n, LIGHT) * 0.5 + 0.5;
    float through = pow(clamp(-dot(n, LIGHT), 0.0, 1.0), 1.5) * 0.4;

    vec3 base = mix(uDeep, uMid, smoothstep(0.0, 0.62, vTone));
    base = mix(base, uBright, smoothstep(0.55, 0.92, vTone) * (0.35 + vLeaf.y * 0.65));
    // Only where the light reaches: pale leaves deep in the shade read as grey scraps
    base = mix(base, uPale, smoothstep(0.975, 0.985, vTone) * 0.55 * smoothstep(0.62, 0.86, vShade));

    float rib = smoothstep(0.075, 0.0, abs(vLeaf.x));
    float veins = smoothstep(0.86, 1.0, sin((vLeaf.y * 15.0 - abs(vLeaf.x) * 4.5) * 3.14159));

    vec3 color = base * (0.2 + wrapped * wrapped * 1.05 + through);
    color += base * rib * 0.42 + base * veins * 0.13 * (1.0 - abs(vLeaf.x));
    color = mix(uNight, color, vShade);

    // Keeps the dark gradients from banding
    float grain = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    gl_FragColor = vec4(color + (grain - 0.5) / 160.0, 1.0);
  }
`

const pollenVertex = /* glsl */ `
  attribute vec3 aSeed;

  uniform float uTime;
  uniform float uPixelRatio;
  uniform float uRadius;
  uniform vec2 uCenter;
  uniform vec3 uPointer;

  varying float vAlpha;

  void main() {
    vec2 drift = vec2(sin(uTime * 0.21 + aSeed.x * 40.0), cos(uTime * 0.17 + aSeed.y * 40.0)) * 0.1;
    vec2 xy = uCenter + position.xy * uRadius * 1.55 + drift;
    vec2 fromPointer = xy - uPointer.xy;
    float near = exp(-dot(fromPointer, fromPointer) / (uRadius * uRadius * 0.05));
    float twinkle = 0.55 + 0.45 * sin(uTime * 2.0 + aSeed.z * 30.0);
    vAlpha = uPointer.z * near * twinkle;

    vec4 viewPosition = modelViewMatrix * vec4(xy, position.z + 0.9, 1.0);
    gl_PointSize = (1.6 + aSeed.z * 3.2) * uPixelRatio;
    gl_Position = projectionMatrix * viewPosition;
  }
`

const pollenFragment = /* glsl */ `
  precision mediump float;
  uniform vec3 uColor;
  varying float vAlpha;

  void main() {
    float d = length(gl_PointCoord - 0.5);
    gl_FragColor = vec4(uColor, vAlpha * smoothstep(0.5, 0.05, d));
  }
`

function createLeafMesh() {
  const SEGMENTS = 6
  const positions = []
  const indices = []
  for (let row = 0; row <= SEGMENTS; row += 1) {
    for (const u of [-1, 0, 1]) positions.push(u, row / SEGMENTS, 0)
  }
  for (let row = 0; row < SEGMENTS; row += 1) {
    const a = row * 3
    indices.push(a, a + 1, a + 3, a + 1, a + 4, a + 3, a + 1, a + 2, a + 4, a + 2, a + 5, a + 4)
  }
  const geometry = new InstancedBufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(positions), 3))
  geometry.setIndex(indices)
  return geometry
}

/** Seeded so the bloom is the same composition on every visit. */
function seededRandom(seed) {
  let state = seed
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296
    return state / 4294967296
  }
}

function populateLeaves(geometry, count, frontCount) {
  const random = seededRandom(137)
  const roots = new Float32Array(count * 3)
  const shapes = new Float32Array(count * 4)
  const misc = new Float32Array(count * 3)

  // Stored in shuffled order: lowering the instance count on a slow device then thins the whole
  // planting evenly, instead of cutting off the outer ring and the collar
  const slots = Array.from({ length: count }, (_, i) => i)
  for (let i = count - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1))
    ;[slots[i], slots[j]] = [slots[j], slots[i]]
  }

  for (let i = 0; i < count; i += 1) {
    const slot = slots[i]
    const isFront = i >= count - frontCount
    const order = i / count
    // Slightly steeper than the square root of true phyllotaxis, so the planting thins out at its edge
    let radiusFraction = Math.pow((i + 0.5) / count, 0.6)
    let azimuth = i * GOLDEN_ANGLE
    let depth = -0.78 + radiusFraction * 0.62 + (random() - 0.5) * 0.1

    if (isFront) {
      // A low collar in front of the portrait, so the figure stands in the planting rather than on it
      const t = (i - (count - frontCount)) / frontCount
      const side = random() < 0.5 ? -1 : 1
      azimuth = Math.PI * (1.5 + side * (0.12 + 0.34 * random()))
      radiusFraction = 0.62 + 0.36 * random()
      depth = 0.14 + t * 0.14
    }

    roots.set([radiusFraction, azimuth, depth], slot * 3)

    const scale = isFront ? 0.2 + random() * 0.08 : 0.115 + radiusFraction * 0.14
    const length = scale * (0.86 + random() * 0.3)
    const tilt = 0.85 - radiusFraction * 0.75 + (random() - 0.5) * 0.45
    const curl = (isFront ? 0.3 : 0.4 + (1 - radiusFraction) * 0.5) + random() * 0.3
    shapes.set([length, length * (0.2 + random() * 0.07), tilt, curl], slot * 4)

    // Most leaves are dark so that the bright and pale ones read as highlights
    const tone = Math.pow(random(), 1.6)
    misc.set([tone, random() * Math.PI * 2, isFront ? 0.55 + random() * 0.45 : order], slot * 3)
  }

  geometry.setAttribute('aRoot', new InstancedBufferAttribute(roots, 3))
  geometry.setAttribute('aShape', new InstancedBufferAttribute(shapes, 4))
  geometry.setAttribute('aMisc', new InstancedBufferAttribute(misc, 3))
  geometry.instanceCount = count
}

function createPollen(shared) {
  const COUNT = 260
  const random = seededRandom(7)
  const positions = new Float32Array(COUNT * 3)
  const seeds = new Float32Array(COUNT * 3)
  for (let i = 0; i < COUNT; i += 1) {
    const r = Math.sqrt(random())
    const a = random() * Math.PI * 2
    positions.set([Math.cos(a) * r, Math.sin(a) * r, random() * 0.5], i * 3)
    seeds.set([random(), random(), random()], i * 3)
  }
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 3))
  const material = new ShaderMaterial({
    vertexShader: pollenVertex,
    fragmentShader: pollenFragment,
    transparent: true,
    depthWrite: false,
    depthTest: false,
    blending: AdditiveBlending,
    uniforms: { ...shared, uColor: { value: new Color('#ecd27f') } },
  })
  const points = new Points(geometry, material)
  points.frustumCulled = false
  points.renderOrder = 3
  return points
}

/**
 * @param {object} options
 * @param {HTMLElement} options.host     element the canvas is added to; it fills the hero
 * @param {HTMLElement} options.hero     the section, for scroll position and visibility
 * @param {HTMLImageElement} options.portrait  the loaded portrait the 3D version takes over from
 * @returns {() => void} removes the scene and frees its GPU resources
 */
export function createGarden({ host, hero, portrait }) {
  const isSmall = window.innerWidth < 768
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const canHover = window.matchMedia('(hover: hover)').matches

  const canvas = document.createElement('canvas')
  canvas.setAttribute('aria-hidden', 'true')

  // Throws without WebGL, in which case the caller leaves the portrait image in place
  const renderer = new WebGLRenderer({
    canvas,
    alpha: true,
    antialias: window.devicePixelRatio < 2,
    powerPreference: 'high-performance',
  })
  host.appendChild(canvas)
  renderer.setClearColor(0x000000, 0)
  let pixelRatio = Math.min(window.devicePixelRatio, isSmall ? 1.5 : 1.75)
  renderer.setPixelRatio(pixelRatio)

  const scene = new Scene()
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 40)
  camera.position.z = CAMERA_Z

  const shared = {
    uTime: { value: 0 },
    uGrow: { value: reducedMotion ? 1 : 0 },
    uScroll: { value: 0 },
    uRadius: { value: 1 },
    uCenter: { value: { x: 0, y: 0 } },
    uPointer: { value: new Vector3(0, 0, 0) },
    uPixelRatio: { value: pixelRatio },
  }

  const leafCount = isSmall ? 1100 : 2200
  const geometry = createLeafMesh()
  populateLeaves(geometry, leafCount, Math.round(leafCount * 0.07))
  const leafMaterial = new ShaderMaterial({
    vertexShader: leafVertex,
    fragmentShader: leafFragment,
    side: DoubleSide,
    uniforms: {
      ...shared,
      uDeep: { value: new Color('#12301f').convertLinearToSRGB() },
      uMid: { value: new Color('#2d6b3f').convertLinearToSRGB() },
      uBright: { value: new Color('#63b476').convertLinearToSRGB() },
      uPale: { value: new Color('#c9dcc0').convertLinearToSRGB() },
      uNight: { value: new Color('#0d1410').convertLinearToSRGB() },
    },
  })
  const leaves = new Mesh(geometry, leafMaterial)
  leaves.frustumCulled = false
  scene.add(leaves)

  // Transparent objects draw after opaque ones and still depth-test, so the back leaves stay
  // behind the portrait while the collar stays in front of it
  const texture = new Texture(portrait)
  texture.colorSpace = SRGBColorSpace
  texture.anisotropy = 4
  texture.needsUpdate = true
  const portraitMaterial = new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false })
  const portraitPlane = new Mesh(new PlaneGeometry(1, 1), portraitMaterial)
  portraitPlane.renderOrder = 1
  scene.add(portraitPlane)
  const portraitHome = { x: 0, y: 0 }

  const pollen = canHover && !reducedMotion ? createPollen(shared) : null
  if (pollen) scene.add(pollen)

  let worldPerPixel = 1
  let heroRect = hero.getBoundingClientRect()

  function layout() {
    heroRect = hero.getBoundingClientRect()
    const { width, height } = heroRect
    if (!width || !height) return
    renderer.setSize(width, height, false)
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    worldPerPixel = (2 * CAMERA_Z * Math.tan((FOV * Math.PI) / 360)) / height

    // The portrait's size and place come from CSS, so the 3D copy lands exactly on the image it replaces
    const box = portrait.getBoundingClientRect()
    const planeWidth = box.width * worldPerPixel
    const planeHeight = box.height * worldPerPixel
    portraitHome.x = (box.left + box.width / 2 - heroRect.left - width / 2) * worldPerPixel
    portraitHome.y = (height / 2 - (box.top + box.height / 2 - heroRect.top)) * worldPerPixel
    portraitPlane.scale.set(planeWidth, planeHeight, 1)
    portraitPlane.position.set(portraitHome.x, portraitHome.y, 0)

    shared.uCenter.value = { x: portraitHome.x, y: portraitHome.y + planeHeight * 0.1 }
    shared.uRadius.value = planeHeight * 0.49
  }

  const pointerTarget = { x: 0, y: 0, active: 0 }
  let lastMove = -10

  function onPointerMove(event) {
    if (event.pointerType === 'touch') return
    const rect = hero.getBoundingClientRect()
    pointerTarget.x = (event.clientX - rect.left - rect.width / 2) * worldPerPixel
    pointerTarget.y = (rect.height / 2 - (event.clientY - rect.top)) * worldPerPixel
    lastMove = shared.uTime.value
  }

  let frame = 0
  let running = false
  let inView = true
  let previous = 0
  let elapsedSinceAdapt = 0
  let framesSinceAdapt = 0
  let qualityDrops = 0

  function adaptQuality(delta) {
    if (shared.uGrow.value < 1 || qualityDrops >= 3) return
    elapsedSinceAdapt += delta
    framesSinceAdapt += 1
    if (framesSinceAdapt < 45) return
    const average = elapsedSinceAdapt / framesSinceAdapt
    elapsedSinceAdapt = 0
    framesSinceAdapt = 0
    // Under 26fps. Phones in low power mode cap animation at a steady 30fps, which isn't struggling.
    if (average < 1 / 26) return

    qualityDrops += 1
    if (pixelRatio > 1) {
      pixelRatio = Math.max(1, pixelRatio - 0.25)
      renderer.setPixelRatio(pixelRatio)
      shared.uPixelRatio.value = pixelRatio
      layout()
    } else {
      geometry.instanceCount = Math.round(geometry.instanceCount * 0.75)
    }
  }

  function renderFrame(delta) {
    const time = shared.uTime
    time.value += delta

    if (shared.uGrow.value < 1) {
      shared.uGrow.value = Math.min(1, shared.uGrow.value + delta / GROW_SECONDS)
    }

    const top = hero.getBoundingClientRect().top
    shared.uScroll.value = Math.min(1, Math.max(0, -top / heroRect.height))

    const pointer = shared.uPointer.value
    const follow = 1 - Math.exp(-delta * 5)
    const wanted = time.value - lastMove < 1.6 ? 1 : 0
    pointerTarget.active += (wanted - pointerTarget.active) * (1 - Math.exp(-delta * 2.2))
    pointer.x += (pointerTarget.x - pointer.x) * follow
    pointer.y += (pointerTarget.y - pointer.y) * follow
    pointer.z = pointerTarget.active

    // The figure barely shifts, just enough to separate it from the leaves behind
    const shiftX = (pointer.x - portraitHome.x) * 0.012 * pointer.z
    portraitPlane.position.x = portraitHome.x + shiftX

    renderer.render(scene, camera)
  }

  function loop(now) {
    frame = requestAnimationFrame(loop)
    const delta = Math.min((now - previous) / 1000, 0.05)
    previous = now
    renderFrame(delta)
    adaptQuality(delta)
  }

  function start() {
    if (running || reducedMotion || !inView || document.hidden) return
    running = true
    previous = performance.now()
    frame = requestAnimationFrame(loop)
  }

  function stop() {
    running = false
    cancelAnimationFrame(frame)
  }

  const onVisibility = () => (document.hidden ? stop() : start())

  function onResize() {
    layout()
    // With motion reduced there is no loop to pick the new size up
    if (reducedMotion) renderFrame(0)
  }

  const observer = new IntersectionObserver(
    ([entry]) => {
      inView = entry.isIntersecting
      if (inView) start()
      else stop()
    },
    { rootMargin: '80px' },
  )

  const resizeObserver = new ResizeObserver(onResize)

  function onContextLost(event) {
    event.preventDefault()
    stop()
    canvas.style.display = 'none'
    portrait.style.opacity = ''
  }

  layout()
  renderFrame(0)
  // The first frame has the portrait in it, so the image underneath can step aside without a flash
  portrait.style.opacity = '0'

  canvas.addEventListener('webglcontextlost', onContextLost)
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  document.addEventListener('visibilitychange', onVisibility)
  observer.observe(hero)
  resizeObserver.observe(hero)
  start()

  return () => {
    stop()
    canvas.removeEventListener('webglcontextlost', onContextLost)
    window.removeEventListener('pointermove', onPointerMove)
    document.removeEventListener('visibilitychange', onVisibility)
    observer.disconnect()
    resizeObserver.disconnect()
    portrait.style.opacity = ''
    geometry.dispose()
    leafMaterial.dispose()
    portraitPlane.geometry.dispose()
    portraitMaterial.dispose()
    texture.dispose()
    if (pollen) {
      pollen.geometry.dispose()
      pollen.material.dispose()
    }
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }
}
