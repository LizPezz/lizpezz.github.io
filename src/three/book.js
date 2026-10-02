import * as THREE from 'three'

// Modello 3D segnaposto della sezione "Libri di carbone": un libro che si può ruotare
// trascinando. Quando arriveranno i modelli veri (es. .glb) basta sostituire `book`
// con la scena caricata da GLTFLoader, il resto (camera, luci, drag, resize) resta uguale.

export function createBookViewer(container, coverUrls) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  container.append(renderer.domElement)

  const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 50)
  camera.position.set(0, 0, 7.4)
  scene.add(new THREE.AmbientLight(0xffffff, 1.6))
  const key = new THREE.DirectionalLight(0xffffff, 2.2)
  key.position.set(2.5, 3, 5)
  scene.add(key)

  const loader = new THREE.TextureLoader()
  const covers = coverUrls.map((url) => {
    const tex = loader.load(url)
    tex.colorSpace = THREE.SRGBColorSpace
    tex.anisotropy = 8
    return tex
  })

  const paper = new THREE.MeshStandardMaterial({ color: 0xf2eee5, roughness: 0.95 })
  const board = new THREE.MeshStandardMaterial({ color: 0x2b2622, roughness: 0.8 })
  const front = new THREE.MeshStandardMaterial({ map: covers[0], roughness: 0.75 })
  // ordine facce BoxGeometry: +x, -x (dorso), +y, -y, +z (copertina), -z (retro)
  const book = new THREE.Mesh(new THREE.BoxGeometry(2.1, 3, 0.24), [paper, board, paper, paper, front, board])
  scene.add(book)

  // rotazione: trascinamento dell'utente + leggera oscillazione a riposo
  const rot = { x: 0.12, y: -0.45, spin: 0, spinTarget: 0 }
  let drag = null
  const el = renderer.domElement
  el.addEventListener('pointerdown', (e) => {
    drag = { x: e.clientX, y: e.clientY }
    el.setPointerCapture(e.pointerId)
    container.classList.add('is-dragging')
  })
  el.addEventListener('pointermove', (e) => {
    if (!drag) return
    rot.y += (e.clientX - drag.x) * 0.01
    rot.x = Math.min(0.9, Math.max(-0.9, rot.x + (e.clientY - drag.y) * 0.006))
    drag = { x: e.clientX, y: e.clientY }
  })
  const release = () => {
    drag = null
    container.classList.remove('is-dragging')
  }
  el.addEventListener('pointerup', release)
  el.addEventListener('pointercancel', release)

  const resize = () => {
    const w = container.clientWidth
    const h = container.clientHeight
    if (!w || !h) return
    renderer.setSize(w, h)
    camera.aspect = w / h
    camera.updateProjectionMatrix()
  }
  new ResizeObserver(resize).observe(container)
  resize()

  let visible = false
  new IntersectionObserver(([e]) => (visible = e.isIntersecting)).observe(container)

  renderer.setAnimationLoop((ms) => {
    if (!visible) return
    rot.spin += (rot.spinTarget - rot.spin) * 0.08
    book.rotation.set(rot.x, rot.y + rot.spin + (drag ? 0 : Math.sin(ms / 1600) * 0.18), 0.04)
    renderer.render(scene, camera)
  })

  return {
    setBook(i) {
      front.map = covers[i]
      rot.spinTarget += Math.PI * 2 // un giro completo al cambio di libro
    },
  }
}
