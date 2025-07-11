// AnimationLoader - Dynamic animation loading and management
export class AnimationLoader {
  constructor() {
    this.loadedAnimations = new Map()
    this.preloadQueue = []
  }
  
  // Load animation module dynamically
  async loadAnimation(name, path) {
    try {
      if (this.loadedAnimations.has(name)) {
        return this.loadedAnimations.get(name)
      }
      
      const module = await import(path)
      const AnimationClass = module.default
      
      this.loadedAnimations.set(name, AnimationClass)
      console.log(`✅ Animation loaded: ${name}`)
      
      return AnimationClass
    } catch (error) {
      console.error(`❌ Failed to load animation: ${name}`, error)
      throw error
    }
  }
  
  // Preload multiple animations
  async preloadAnimations(animations) {
    const promises = animations.map(({ name, path }) => 
      this.loadAnimation(name, path)
    )
    
    return Promise.all(promises)
  }
  
  // Get loaded animation
  getAnimation(name) {
    return this.loadedAnimations.get(name)
  }
  
  // Check if animation is loaded
  isLoaded(name) {
    return this.loadedAnimations.has(name)
  }
  
  // Unload animation to free memory
  unloadAnimation(name) {
    if (this.loadedAnimations.has(name)) {
      this.loadedAnimations.delete(name)
      console.log(`🗑️ Animation unloaded: ${name}`)
    }
  }
  
  // Get all loaded animations
  getAllLoaded() {
    return Array.from(this.loadedAnimations.keys())
  }
}