// ConceptsAnimation - Demonstrate core animation concepts
export default class ConceptsAnimation {
  constructor(manager) {
    this.manager = manager
    this.elements = {}
  }
  
  load() {
    this.manager.clearStage()
    this.createElements()
    this.buildTimeline()
  }
  
  createElements() {
    // Section titles
    const concepts = [
      { name: 'timing', title: 'Timing', color: '#3B82F6' },
      { name: 'easing', title: 'Easing', color: '#8B5CF6' },
      { name: 'sequence', title: 'Sequence', color: '#10B981' }
    ]
    
    concepts.forEach((concept, index) => {
      // Title
      const title = document.createElement('div')
      title.className = 'animation-element'
      title.style.cssText = `
        position: absolute;
        top: ${30 + index * 120}px;
        left: 30px;
        font-size: 1.2rem;
        font-weight: bold;
        color: ${concept.color};
      `
      title.textContent = concept.title
      this.elements[`${concept.name}Title`] = this.manager.addElement(`${concept.name}Title`, title)
      
      // Demo element
      const demo = this.manager.createElement('circle', {
        x: '150px',
        y: `${20 + index * 120}px`,
        width: '40px',
        height: '40px',
        color: concept.color
      })
      this.elements[`${concept.name}Demo`] = this.manager.addElement(`${concept.name}Demo`, demo)
    })
    
    // Create comparison elements for timing
    for (let i = 0; i < 3; i++) {
      const speed = ['slow', 'normal', 'fast'][i]
      const elem = this.manager.createElement('square', {
        x: '150px',
        y: `${60 + i * 30}px`,
        width: '20px',
        height: '20px',
        color: '#3B82F6'
      })
      this.elements[`timing${speed}`] = this.manager.addElement(`timing${speed}`, elem)
    }
    
    // Create easing demo elements
    const easings = ['linear', 'ease-in', 'ease-out', 'bounce']
    easings.forEach((easing, index) => {
      const elem = this.manager.createElement('circle', {
        x: '150px',
        y: `${180 + index * 25}px`,
        width: '20px',
        height: '20px',
        color: '#8B5CF6'
      })
      this.elements[`easing${easing}`] = this.manager.addElement(`easing${easing}`, elem)
    })
    
    // Create sequence demo elements
    for (let i = 0; i < 4; i++) {
      const elem = this.manager.createElement('square', {
        x: `${150 + i * 60}px`,
        y: '300px',
        width: '40px',
        height: '40px',
        color: '#10B981',
        text: `${i + 1}`
      })
      this.elements[`seq${i}`] = this.manager.addElement(`seq${i}`, elem)
    }
  }
  
  buildTimeline() {
    const tl = this.manager.createTimeline()
    
    // Hide all elements initially
    tl.set(Object.values(this.elements), { opacity: 0 })
    
    // Timing concept
    tl.add(this.manager.fadeIn(this.elements.timingTitle, 0.5))
    tl.add(this.manager.fadeIn(this.elements.timingDemo, 0.3), '-=0.2')
    
    // Show timing variations
    tl.to(this.elements.timingslow, {
      opacity: 1,
      x: '+=300',
      duration: 2,
      ease: 'none'
    })
    .to(this.elements.timingnormal, {
      opacity: 1,
      x: '+=300',
      duration: 1,
      ease: 'none'
    }, '-=2')
    .to(this.elements.timingfast, {
      opacity: 1,
      x: '+=300',
      duration: 0.5,
      ease: 'none'
    }, '-=2')
    
    // Reset timing demos
    tl.to([this.elements.timingslow, this.elements.timingnormal, this.elements.timingfast], {
      x: '150px',
      opacity: 0,
      duration: 0.3
    }, '+=0.5')
    
    // Easing concept
    tl.add(this.manager.fadeIn(this.elements.easingTitle, 0.5), '+=0.5')
    tl.add(this.manager.fadeIn(this.elements.easingDemo, 0.3), '-=0.2')
    
    // Show easing variations
    tl.to(this.elements.easinglinear, {
      opacity: 1,
      x: '+=300',
      duration: 1,
      ease: 'none'
    })
    .to(this.elements.easingEaseIn, {
      opacity: 1,
      x: '+=300',
      duration: 1,
      ease: 'power2.in'
    }, '-=1')
    .to(this.elements.easingEaseOut, {
      opacity: 1,
      x: '+=300',
      duration: 1,
      ease: 'power2.out'
    }, '-=1')
    .to(this.elements.easingbounce, {
      opacity: 1,
      x: '+=300',
      duration: 1,
      ease: 'bounce.out'
    }, '-=1')
    
    // Reset easing demos
    tl.to([
      this.elements.easinglinear,
      this.elements.easingEaseIn,
      this.elements.easingEaseOut,
      this.elements.easingbounce
    ], {
      x: '150px',
      opacity: 0,
      duration: 0.3
    }, '+=0.5')
    
    // Sequence concept
    tl.add(this.manager.fadeIn(this.elements.sequenceTitle, 0.5), '+=0.5')
    tl.add(this.manager.fadeIn(this.elements.sequenceDemo, 0.3), '-=0.2')
    
    // Show sequence animation
    for (let i = 0; i < 4; i++) {
      tl.add(this.manager.fadeIn(this.elements[`seq${i}`], 0.3))
        .add(this.manager.bounce(this.elements[`seq${i}`], 0.4), '-=0.1')
    }
    
    // Create a wave effect
    tl.to(this.elements.seq0, { y: '-=30', duration: 0.3 })
      .to(this.elements.seq1, { y: '-=30', duration: 0.3 }, '-=0.2')
      .to(this.elements.seq2, { y: '-=30', duration: 0.3 }, '-=0.2')
      .to(this.elements.seq3, { y: '-=30', duration: 0.3 }, '-=0.2')
      .to(this.elements.seq0, { y: '+=30', duration: 0.3 })
      .to(this.elements.seq1, { y: '+=30', duration: 0.3 }, '-=0.2')
      .to(this.elements.seq2, { y: '+=30', duration: 0.3 }, '-=0.2')
      .to(this.elements.seq3, { y: '+=30', duration: 0.3 }, '-=0.2')
    
    // Final flourish
    tl.to(Object.values(this.elements), {
      scale: 0.8,
      opacity: 0.5,
      duration: 0.5,
      stagger: 0.02
    }, '+=0.5')
    .to(Object.values(this.elements), {
      scale: 1,
      opacity: 1,
      duration: 0.5,
      stagger: 0.02
    })
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