// AnimationManager - Core animation orchestration
import gsap from 'gsap'

export class AnimationManager {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.timeline = null
    this.elements = new Map()
    this.isPlaying = false
    this.currentTime = 0
  }
  
  // Create a new timeline
  createTimeline(options = {}) {
    this.timeline = gsap.timeline({
      paused: true,
      onUpdate: () => this.onTimelineUpdate(),
      onComplete: () => this.onTimelineComplete(),
      ...options
    })
    return this.timeline
  }
  
  // Add element to stage
  addElement(id, element) {
    this.elements.set(id, element)
    this.container.appendChild(element)
    return element
  }
  
  // Remove element from stage
  removeElement(id) {
    const element = this.elements.get(id)
    if (element) {
      element.remove()
      this.elements.delete(id)
    }
  }
  
  // Clear all elements
  clearStage() {
    this.elements.forEach(element => element.remove())
    this.elements.clear()
    if (this.timeline) {
      this.timeline.clear()
      this.timeline.kill()
    }
  }
  
  // Create shape element
  createElement(type, options = {}) {
    const element = document.createElement('div')
    element.className = `animation-element shape ${type}`
    
    // Apply styles
    Object.assign(element.style, {
      width: options.width || '60px',
      height: options.height || '60px',
      left: options.x || '0px',
      top: options.y || '0px',
      backgroundColor: options.color || '',
      ...options.style
    })
    
    if (options.text) {
      element.textContent = options.text
    }
    
    return element
  }
  
  // Play animation
  play() {
    if (this.timeline) {
      this.timeline.play()
      this.isPlaying = true
    }
  }
  
  // Pause animation
  pause() {
    if (this.timeline) {
      this.timeline.pause()
      this.isPlaying = false
    }
  }
  
  // Reset animation
  reset() {
    if (this.timeline) {
      this.timeline.seek(0).pause()
      this.isPlaying = false
      this.currentTime = 0
    }
  }
  
  // Seek to specific time
  seek(progress) {
    if (this.timeline) {
      const time = this.timeline.totalDuration() * progress
      this.timeline.seek(time)
      this.currentTime = time
    }
  }
  
  // Get current progress (0-1)
  getProgress() {
    if (!this.timeline) return 0
    return this.timeline.progress()
  }
  
  // Timeline update callback
  onTimelineUpdate() {
    this.currentTime = this.timeline.time()
    const progress = this.getProgress()
    
    // Update UI
    const scrubber = document.getElementById('timeline-scrubber')
    if (scrubber) {
      scrubber.value = progress * 100
    }
    
    // Dispatch custom event
    this.container.dispatchEvent(new CustomEvent('animationUpdate', {
      detail: { time: this.currentTime, progress }
    }))
  }
  
  // Timeline complete callback
  onTimelineComplete() {
    this.isPlaying = false
    document.getElementById('play-pause').textContent = '▶️ Play'
    
    // Dispatch custom event
    this.container.dispatchEvent(new CustomEvent('animationComplete'))
  }
  
  // Utility animations
  fadeIn(element, duration = 0.5, delay = 0) {
    return gsap.fromTo(element, 
      { opacity: 0 },
      { opacity: 1, duration, delay }
    )
  }
  
  fadeOut(element, duration = 0.5, delay = 0) {
    return gsap.to(element, { opacity: 0, duration, delay })
  }
  
  slideIn(element, from = 'left', duration = 0.5, delay = 0) {
    const positions = {
      left: { x: -100, y: 0 },
      right: { x: 100, y: 0 },
      top: { x: 0, y: -100 },
      bottom: { x: 0, y: 100 }
    }
    
    const pos = positions[from] || positions.left
    
    return gsap.fromTo(element,
      { x: pos.x, y: pos.y, opacity: 0 },
      { x: 0, y: 0, opacity: 1, duration, delay }
    )
  }
  
  bounce(element, duration = 0.5, delay = 0) {
    return gsap.to(element, {
      y: -30,
      duration: duration / 2,
      delay,
      ease: 'power2.out',
      yoyo: true,
      repeat: 1
    })
  }
  
  rotate(element, degrees = 360, duration = 1, delay = 0) {
    return gsap.to(element, {
      rotation: degrees,
      duration,
      delay,
      ease: 'power2.inOut'
    })
  }
  
  scale(element, scale = 1.5, duration = 0.5, delay = 0) {
    return gsap.to(element, {
      scale,
      duration,
      delay,
      ease: 'power2.inOut',
      yoyo: true,
      repeat: 1
    })
  }
}