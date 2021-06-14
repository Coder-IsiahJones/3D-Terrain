import './style.css'
import * as THREE from 'three'
import * as dat from 'dat.gui'

// Texture Loader
const loader = new THREE.TextureLoader()
const texture = loader.load('./textures/mountain.jpg')
const height = loader.load('./textures/smoke-1.png')
const alpha = loader.load('./textures/alpha.png')

// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Objects
const geometry = new THREE.PlaneBufferGeometry(3, 3, 64, 64)

// Materials
const material = new THREE.MeshStandardMaterial(
    {
        map: texture,
        displacementMap: height,
        displacementScale: 0.6,
        alphaMap: alpha,
        transparent: true,
        depthTest: false
    }
)

const plane = new THREE.Mesh(geometry, material)
scene.add(plane)

const planeFolder = gui.addFolder('Plane')
plane.rotation.x = 181

// GUI
planeFolder.add(plane.rotation, 'x').min(0).max(100)

// Mesh


// Lights

const pointLight = new THREE.PointLight('#3f1f69', 3)
pointLight.position.x = 0.2
pointLight.position.y = 10
pointLight.position.z = 4.4
scene.add(pointLight)

const lightFolder = gui.addFolder('Light')

// GUI
lightFolder.add(pointLight.position, 'x').min(0).max(100)
lightFolder.add(pointLight.position, 'y').min(0).max(100)
lightFolder.add(pointLight.position, 'z').min(0).max(100)

const col = { color: '#00ff00'}
lightFolder.addColor(col, 'color').onChange(() =>
{
    pointLight.color.set(col.color)
})



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth * 0.7,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth * 0.7
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 0
camera.position.y = 0
camera.position.z = 3
scene.add(camera)

// Controls
// const controls = new OrbitControls(camera, canvas)
// controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
document.addEventListener('mousemove', animateTerrain)

let mouseY = 0

function animateTerrain(event) {
    mouseY = event.clientY
}
const clock = new THREE.Clock()

// Close Folder on startup
gui.close()

const tick = () =>
{

    const elapsedTime = clock.getElapsedTime()

    // Update objects
    plane.rotation.z = elapsedTime * 0.5
    plane.material.displacementScale = 0.5 + mouseY * 0.0008

    // Update Orbital Controls
    // controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()