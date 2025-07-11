// Main application entry point
import './styles/main.css'
import { AnimationManager } from './utils/AnimationManager.js'
import { AnimationLoader } from './utils/AnimationLoader.js'
import { ControlsManager } from './utils/ControlsManager.js'

// Initialize core systems
const animationManager = new AnimationManager('animation-stage')
const animationLoader = new AnimationLoader()
const controlsManager = new ControlsManager()

// Application state
const app = {
  currentAnimation: null,
  isPlaying: false,
  animations: {}
}

// Initialize application
async function init() {
  console.log('🎬 Kuda Animator initialized')
  
  // Load available animations
  await loadAnimations()
  
  // Setup event listeners
  setupEventListeners()
  
  // Load Henry George intro by default
  loadAnimation('henryGeorgeIntro')
}

// Import animations directly to avoid build issues
import HenryGeorgeIntroAnimation from './animations/HenryGeorgeIntroAnimation.js'
import RentWedgeAnimation from './animations/RentWedgeAnimation.js'
import ThreeFactorPieAnimation from './animations/ThreeFactorPieAnimation.js'
import IntroAnimation from './animations/IntroAnimation.js'
import ConceptsAnimation from './animations/ConceptsAnimation.js'
import InteractiveAnimation from './animations/InteractiveAnimation.js'

// Load all animation modules
async function loadAnimations() {
  // Register animations
  app.animations.henryGeorgeIntro = new HenryGeorgeIntroAnimation(animationManager)
  app.animations.rentWedge = new RentWedgeAnimation(animationManager)
  app.animations.threeFactorPie = new ThreeFactorPieAnimation(animationManager)
  app.animations.intro = new IntroAnimation(animationManager)
  app.animations.concepts = new ConceptsAnimation(animationManager)
  app.animations.interactive = new InteractiveAnimation(animationManager)
  
  console.log('✅ All animations loaded')
  console.log('Note: LandValueGradient and LVTSimulator need to be converted from React')
}

// Setup UI event listeners
function setupEventListeners() {
  // Animation navigation
  document.querySelectorAll('[data-animation]').forEach(button => {
    button.addEventListener('click', (e) => {
      const animationName = e.target.dataset.animation
      loadAnimation(animationName)
    })
  })
  
  // Playback controls
  const playPauseBtn = document.getElementById('play-pause')
  const resetBtn = document.getElementById('reset')
  const timelineScrubber = document.getElementById('timeline-scrubber')
  
  playPauseBtn.addEventListener('click', togglePlayPause)
  resetBtn.addEventListener('click', resetAnimation)
  timelineScrubber.addEventListener('input', scrubTimeline)
  
  // Bind controls to manager
  controlsManager.bindControls({
    playPause: playPauseBtn,
    reset: resetBtn,
    timeline: timelineScrubber
  })
}

// Load and display animation
function loadAnimation(name) {
  if (!app.animations[name]) {
    console.error(`Animation "${name}" not found`)
    return
  }
  
  // Stop current animation
  if (app.currentAnimation) {
    app.currentAnimation.stop()
  }
  
  // Load new animation
  app.currentAnimation = app.animations[name]
  app.currentAnimation.load()
  
  // Update UI
  updateAnimationInfo(name)
  document.querySelectorAll('[data-animation]').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.animation === name)
  })
  
  console.log(`🎬 Loaded animation: ${name}`)
}

// Toggle play/pause state
function togglePlayPause() {
  if (!app.currentAnimation) return
  
  app.isPlaying = !app.isPlaying
  
  if (app.isPlaying) {
    app.currentAnimation.play()
    document.getElementById('play-pause').textContent = '⏸️ Pause'
  } else {
    app.currentAnimation.pause()
    document.getElementById('play-pause').textContent = '▶️ Play'
  }
}

// Reset current animation
function resetAnimation() {
  if (!app.currentAnimation) return
  
  app.currentAnimation.reset()
  app.isPlaying = false
  document.getElementById('play-pause').textContent = '▶️ Play'
  document.getElementById('timeline-scrubber').value = 0
}

// Scrub timeline
function scrubTimeline(e) {
  if (!app.currentAnimation) return
  
  const progress = e.target.value / 100
  app.currentAnimation.seek(progress)
}

// Update animation info panel
function updateAnimationInfo(name) {
  const infoPanel = document.getElementById('animation-info')
  const info = {
    henryGeorgeIntro: {
      title: 'Welcome to Henry George Economics',
      description: 'Discover why poverty persists despite progress and learn about the revolutionary solution',
      duration: '90 seconds'
    },
    rentWedge: {
      title: 'The Rent Wedge',
      description: 'Visualize how rent captures the benefits of progress, preventing poverty reduction',
      duration: '15 seconds'
    },
    landValueGradient: {
      title: 'Land Value Gradient',
      description: 'See how location creates value and how communities build wealth',
      duration: '90 seconds'
    },
    threeFactorPie: {
      title: 'Three Factors of Production',
      description: 'Track how land captures ever more wealth from labor and capital over time',
      duration: '2 minutes'
    },
    lvtSimulator: {
      title: 'Land Value Tax Simulator',
      description: 'Interactive city builder showing the effects of different tax systems',
      duration: 'Interactive'
    }
  }
  
  const animInfo = info[name] || { title: 'Unknown', description: '', duration: '' }
  
  infoPanel.innerHTML = `
    <h3>${animInfo.title}</h3>
    <p>${animInfo.description}</p>
    <p><strong>Duration:</strong> ${animInfo.duration}</p>
  `
}

// Start the application
document.addEventListener('DOMContentLoaded', init)