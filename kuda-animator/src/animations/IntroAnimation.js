// IntroAnimation - Basic introduction to animation concepts
export default class IntroAnimation {
  constructor(manager) {
    this.manager = manager
    this.elements = {}
  }
  
  load() {
    // Clear stage
    this.manager.clearStage()
    
    // Create elements
    this.createElements()
    
    // Build animation timeline
    this.buildTimeline()
  }
  
  createElements() {
    // Title text
    const title = document.createElement('div')
    title.className = 'animation-element'
    title.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2rem;
      font-weight: bold;
      color: #3B82F6;
      text-align: center;
    `
    title.textContent = 'Welcome to Kuda Animator!'
    this.elements.title = this.manager.addElement('title', title)
    
    // Create shapes for demonstration
    this.elements.circle = this.manager.addElement('circle',
      this.manager.createElement('circle', {
        x: '50px',
        y: '150px',
        color: '#10B981',
        text: '1'
      })
    )
    
    this.elements.square = this.manager.addElement('square',
      this.manager.createElement('square', {
        x: '200px',
        y: '150px',
        color: '#3B82F6',
        text: '2'
      })
    )
    
    this.elements.triangle = this.manager.addElement('triangle',
      this.manager.createElement('triangle', {
        x: '350px',
        y: '150px',
        text: ''
      })
    )
    
    // Info text
    const info = document.createElement('div')
    info.className = 'animation-element'
    info.style.cssText = `
      position: absolute;
      bottom: 40px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      color: #6B7280;
      font-size: 1rem;
      width: 80%;
    `
    info.textContent = 'Educational animations make learning fun and engaging!'
    this.elements.info = this.manager.addElement('info', info)
  }
  
  buildTimeline() {
    const tl = this.manager.createTimeline()
    
    // Initial state - hide everything
    tl.set([
      this.elements.title,
      this.elements.circle,
      this.elements.square,
      this.elements.triangle,
      this.elements.info
    ], { opacity: 0 })
    
    // Animate title
    tl.add(this.manager.fadeIn(this.elements.title, 0.8))
      .add(this.manager.scale(this.elements.title, 1.1, 0.3), '-=0.2')
    
    // Animate shapes in sequence
    tl.add(this.manager.slideIn(this.elements.circle, 'left', 0.5), '-=0.3')
      .add(this.manager.bounce(this.elements.circle, 0.4), '-=0.1')
    
    tl.add(this.manager.slideIn(this.elements.square, 'bottom', 0.5), '-=0.3')
      .add(this.manager.rotate(this.elements.square, 360, 0.6), '-=0.2')
    
    tl.add(this.manager.slideIn(this.elements.triangle, 'right', 0.5), '-=0.3')
      .add(this.manager.scale(this.elements.triangle, 1.2, 0.4), '-=0.1')
    
    // Show info text
    tl.add(this.manager.fadeIn(this.elements.info, 0.6), '-=0.2')
    
    // Add some fun interactions
    tl.to(this.elements.circle, {
      x: '+=100',
      duration: 0.8,
      ease: 'power2.inOut'
    })
    .to(this.elements.square, {
      y: '-=50',
      rotation: '+=180',
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.6')
    .to(this.elements.triangle, {
      x: '-=100',
      scale: 0.8,
      duration: 0.8,
      ease: 'power2.inOut'
    }, '-=0.6')
    
    // Final message
    const finalMessage = document.createElement('div')
    finalMessage.className = 'animation-element'
    finalMessage.style.cssText = `
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      font-size: 1.5rem;
      color: #8B5CF6;
      font-weight: bold;
      opacity: 0;
    `
    finalMessage.textContent = 'Let\'s start learning!'
    this.elements.finalMessage = this.manager.addElement('finalMessage', finalMessage)
    
    tl.to(this.elements.finalMessage, {
      opacity: 1,
      scale: 1.2,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '+=0.5')
  }
  
  play() {
    this.manager.play()
  }
  
  pause() {
    this.manager.pause()
  }
  
  reset() {
    this.manager.reset()
  }
  
  stop() {
    this.manager.pause()
    this.manager.clearStage()
  }
  
  seek(progress) {
    this.manager.seek(progress)
  }
}