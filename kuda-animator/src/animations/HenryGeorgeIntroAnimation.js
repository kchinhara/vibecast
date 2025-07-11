// Henry George Introduction Animation
export default class HenryGeorgeIntroAnimation {
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
    // Main container
    const container = document.createElement('div')
    container.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      background: linear-gradient(135deg, #F3F4F6 0%, #E5E7EB 100%);
      padding: 2rem;
    `
    
    // Title
    const title = document.createElement('h1')
    title.style.cssText = `
      font-size: 3rem;
      color: #1F2937;
      text-align: center;
      margin-bottom: 1rem;
      opacity: 0;
    `
    title.innerHTML = 'Understanding <span style="color: #10B981;">Progress</span> & <span style="color: #EF4444;">Poverty</span>'
    this.elements.title = this.manager.addElement('title', title)
    container.appendChild(title)
    
    // Subtitle
    const subtitle = document.createElement('p')
    subtitle.style.cssText = `
      font-size: 1.25rem;
      color: #6B7280;
      text-align: center;
      margin-bottom: 2rem;
      opacity: 0;
      max-width: 600px;
    `
    subtitle.textContent = 'Discover why poverty persists despite technological progress through the revolutionary insights of Henry George'
    this.elements.subtitle = this.manager.addElement('subtitle', subtitle)
    container.appendChild(subtitle)
    
    // Central question
    const question = document.createElement('div')
    question.style.cssText = `
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      margin: 2rem 0;
      opacity: 0;
      transform: scale(0.8);
      max-width: 500px;
    `
    question.innerHTML = `
      <h2 style="color: #374151; margin-bottom: 1rem; font-size: 1.5rem;">The Great Paradox:</h2>
      <p style="color: #6B7280; font-size: 1.1rem; line-height: 1.6;">
        Why do we see homelessness next to empty luxury apartments?<br><br>
        Why do wages stagnate while productivity soars?<br><br>
        Why does progress create poverty?
      </p>
    `
    this.elements.question = this.manager.addElement('question', question)
    container.appendChild(question)
    
    // Henry George portrait area
    const portrait = document.createElement('div')
    portrait.style.cssText = `
      position: absolute;
      bottom: 2rem;
      right: 2rem;
      opacity: 0;
      transform: translateX(50px);
    `
    portrait.innerHTML = `
      <div style="background: #374151; color: white; padding: 1rem; border-radius: 0.5rem; max-width: 250px;">
        <h3 style="margin-bottom: 0.5rem;">Henry George (1839-1897)</h3>
        <p style="font-size: 0.875rem; opacity: 0.9;">
          Self-taught economist who discovered the root cause of poverty amid plenty.
          His book "Progress and Poverty" sold over 3 million copies.
        </p>
      </div>
    `
    this.elements.portrait = this.manager.addElement('portrait', portrait)
    container.appendChild(portrait)
    
    // Key concepts preview
    const concepts = document.createElement('div')
    concepts.style.cssText = `
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
      margin-top: 2rem;
      opacity: 0;
      max-width: 800px;
      width: 100%;
    `
    
    const conceptData = [
      { icon: '🏞️', title: 'Land', color: '#10B981', desc: 'Natural resources & location' },
      { icon: '👷', title: 'Labor', color: '#3B82F6', desc: 'Human effort & creativity' },
      { icon: '🏭', title: 'Capital', color: '#F59E0B', desc: 'Tools & improvements' }
    ]
    
    conceptData.forEach((concept, index) => {
      const card = document.createElement('div')
      card.style.cssText = `
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        text-align: center;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        transform: translateY(20px);
        opacity: 0;
      `
      card.innerHTML = `
        <div style="font-size: 2rem; margin-bottom: 0.5rem;">${concept.icon}</div>
        <h3 style="color: ${concept.color}; margin-bottom: 0.25rem;">${concept.title}</h3>
        <p style="color: #6B7280; font-size: 0.875rem;">${concept.desc}</p>
      `
      card.classList.add(`concept-${index}`)
      concepts.appendChild(card)
    })
    
    this.elements.concepts = this.manager.addElement('concepts', concepts)
    container.appendChild(concepts)
    
    // Call to action
    const cta = document.createElement('div')
    cta.style.cssText = `
      margin-top: 2rem;
      text-align: center;
      opacity: 0;
    `
    cta.innerHTML = `
      <p style="color: #6B7280; margin-bottom: 1rem;">Ready to understand economics in a new way?</p>
      <button style="
        background: #10B981;
        color: white;
        padding: 1rem 2rem;
        border: none;
        border-radius: 0.5rem;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: all 0.2s;
      " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">
        Start Learning →
      </button>
    `
    this.elements.cta = this.manager.addElement('cta', cta)
    container.appendChild(cta)
    
    // Add container to stage
    const stage = document.getElementById('animation-stage')
    if (stage) {
      stage.appendChild(container)
    }
  }
  
  buildTimeline() {
    const tl = this.manager.createTimeline()
    
    // Fade in title
    tl.to(this.elements.title, {
      opacity: 1,
      duration: 1,
      ease: 'power2.out'
    })
    
    // Fade in subtitle
    .to(this.elements.subtitle, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5')
    
    // Show question box
    .to(this.elements.question, {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: 'back.out(1.7)'
    }, '-=0.3')
    
    // Show Henry George info
    .to(this.elements.portrait, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.4')
    
    // Show concepts
    .to(this.elements.concepts, {
      opacity: 1,
      duration: 0.5
    }, '-=0.3')
    
    // Animate concept cards
    const conceptCards = this.elements.concepts.querySelectorAll('div')
    tl.to(conceptCards, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      stagger: 0.2,
      ease: 'power2.out'
    }, '-=0.2')
    
    // Show CTA
    .to(this.elements.cta, {
      opacity: 1,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.2')
    
    // Add subtle floating animation to concept cards
    conceptCards.forEach((card, index) => {
      tl.to(card, {
        y: -5,
        duration: 2 + index * 0.2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true
      }, 2)
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