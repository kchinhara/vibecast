// RentWedgeAnimation - Visualizes how rent acts as a wedge between production and wages
export default class RentWedgeAnimation {
  constructor(manager) {
    this.manager = manager
    this.elements = {}
    this.rentPercentage = 10
    this.wagePercentage = 90
    this.phase = 0
    this.timeline = null
    
    // Animation phases
    this.phases = [
      { duration: 3, rentTarget: 10, message: "Workers produce value through their labor..." },
      { duration: 3, rentTarget: 25, message: "Land owners claim increasing share as rent..." },
      { duration: 3, rentTarget: 40, message: "As productivity rises, rent captures the gains..." },
      { duration: 3, rentTarget: 60, message: "Workers produce more but receive proportionally less..." },
      { duration: 3, rentTarget: 75, message: "The rent wedge grows, poverty persists despite progress!" }
    ]
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
    // Container
    const container = document.createElement('div')
    container.style.cssText = `
      position: relative;
      width: 100%;
      height: 100%;
      background: linear-gradient(to bottom right, #f9fafb, #f3f4f6);
      border-radius: 0.75rem;
      padding: 2rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    `
    
    // Title
    const title = document.createElement('h2')
    title.style.cssText = `
      font-size: 2rem;
      font-weight: bold;
      text-align: center;
      margin-bottom: 0.5rem;
      color: #1f2937;
    `
    title.textContent = 'The Rent Wedge: Why Progress Doesn\'t Reduce Poverty'
    container.appendChild(title)
    
    // Subtitle
    const subtitle = document.createElement('p')
    subtitle.style.cssText = `
      text-align: center;
      color: #6b7280;
      margin-bottom: 2rem;
    `
    subtitle.textContent = 'Watch how rent acts as a wedge between what workers produce and what they receive'
    container.appendChild(subtitle)
    
    // Animation area
    const animationArea = document.createElement('div')
    animationArea.style.cssText = `
      position: relative;
      height: 350px;
      background: white;
      border-radius: 0.5rem;
      box-shadow: inset 0 2px 4px 0 rgba(0, 0, 0, 0.06);
      margin-bottom: 2rem;
    `
    
    // Production side (left)
    const productionSide = document.createElement('div')
    productionSide.style.cssText = `
      position: absolute;
      left: 0;
      top: 0;
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `
    
    const factoryEmoji = document.createElement('div')
    factoryEmoji.style.cssText = `
      font-size: 4rem;
      margin-bottom: 1rem;
    `
    factoryEmoji.textContent = '🏭'
    this.elements.factory = factoryEmoji
    productionSide.appendChild(factoryEmoji)
    
    const productionLabel = document.createElement('h3')
    productionLabel.style.cssText = `
      font-size: 1.25rem;
      font-weight: 600;
      color: #2563eb;
      margin-bottom: 0.5rem;
    `
    productionLabel.textContent = 'Production'
    productionSide.appendChild(productionLabel)
    
    const productionBar = document.createElement('div')
    productionBar.style.cssText = `
      width: 100px;
      height: 16px;
      background: linear-gradient(to right, #60a5fa, #2563eb);
      border-radius: 9999px;
      transition: width 0.5s ease;
    `
    this.elements.productionBar = productionBar
    productionSide.appendChild(productionBar)
    
    const productionValue = document.createElement('p')
    productionValue.style.cssText = `
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    `
    productionValue.textContent = 'Value Created'
    productionSide.appendChild(productionValue)
    
    // Wages side (right)
    const wagesSide = document.createElement('div')
    wagesSide.style.cssText = `
      position: absolute;
      right: 0;
      top: 0;
      width: 50%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    `
    
    const workerEmoji = document.createElement('div')
    workerEmoji.style.cssText = `
      font-size: 4rem;
      margin-bottom: 1rem;
    `
    workerEmoji.textContent = '👷'
    this.elements.worker = workerEmoji
    wagesSide.appendChild(workerEmoji)
    
    const wagesLabel = document.createElement('h3')
    wagesLabel.style.cssText = `
      font-size: 1.25rem;
      font-weight: 600;
      color: #059669;
      margin-bottom: 0.5rem;
    `
    wagesLabel.textContent = 'Wages'
    wagesSide.appendChild(wagesLabel)
    
    const wagesBar = document.createElement('div')
    wagesBar.style.cssText = `
      width: 100px;
      height: 16px;
      background: linear-gradient(to right, #34d399, #059669);
      border-radius: 9999px;
      transition: width 0.5s ease;
    `
    this.elements.wagesBar = wagesBar
    wagesSide.appendChild(wagesBar)
    
    const wagesValue = document.createElement('p')
    wagesValue.style.cssText = `
      margin-top: 0.5rem;
      font-size: 0.875rem;
      color: #6b7280;
    `
    wagesValue.textContent = 'Workers Receive'
    wagesSide.appendChild(wagesValue)
    
    // Central wedge (SVG)
    const wedgeContainer = document.createElement('div')
    wedgeContainer.style.cssText = `
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
      z-index: 10;
    `
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '200')
    svg.setAttribute('height', '200')
    svg.setAttribute('viewBox', '0 0 200 200')
    
    // Background circle
    const bgCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    bgCircle.setAttribute('cx', '100')
    bgCircle.setAttribute('cy', '100')
    bgCircle.setAttribute('r', '80')
    bgCircle.setAttribute('fill', '#f3f4f6')
    bgCircle.setAttribute('stroke', '#e5e7eb')
    bgCircle.setAttribute('stroke-width', '2')
    svg.appendChild(bgCircle)
    
    // Rent wedge path
    const wedgePath = document.createElementNS('http://www.w3.org/2000/svg', 'path')
    wedgePath.setAttribute('fill', '#ef4444')
    wedgePath.setAttribute('opacity', '0.8')
    this.elements.wedgePath = wedgePath
    svg.appendChild(wedgePath)
    
    // Center label
    const rentLabel = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    rentLabel.setAttribute('x', '100')
    rentLabel.setAttribute('y', '100')
    rentLabel.setAttribute('text-anchor', 'middle')
    rentLabel.setAttribute('fill', 'white')
    rentLabel.setAttribute('font-weight', 'bold')
    rentLabel.setAttribute('font-size', '18')
    rentLabel.textContent = 'RENT'
    svg.appendChild(rentLabel)
    
    // Percentage label
    const rentPercent = document.createElementNS('http://www.w3.org/2000/svg', 'text')
    rentPercent.setAttribute('x', '100')
    rentPercent.setAttribute('y', '120')
    rentPercent.setAttribute('text-anchor', 'middle')
    rentPercent.setAttribute('fill', 'white')
    rentPercent.setAttribute('font-weight', '600')
    rentPercent.textContent = '10%'
    this.elements.rentPercent = rentPercent
    svg.appendChild(rentPercent)
    
    wedgeContainer.appendChild(svg)
    
    // Percentage display
    const percentDisplay = document.createElement('div')
    percentDisplay.style.cssText = `
      position: absolute;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      background: white;
      padding: 0.75rem 1.5rem;
      border-radius: 0.5rem;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      display: flex;
      gap: 2rem;
    `
    
    const wagePercent = document.createElement('div')
    wagePercent.style.cssText = `text-align: center;`
    wagePercent.innerHTML = `
      <div style="font-size: 1.5rem; font-weight: bold; color: #059669;">90%</div>
      <div style="font-size: 0.75rem; color: #6b7280;">To Workers</div>
    `
    this.elements.wagePercent = wagePercent
    
    const rentPercentDisplay = document.createElement('div')
    rentPercentDisplay.style.cssText = `text-align: center;`
    rentPercentDisplay.innerHTML = `
      <div style="font-size: 1.5rem; font-weight: bold; color: #ef4444;">10%</div>
      <div style="font-size: 0.75rem; color: #6b7280;">To Rent</div>
    `
    this.elements.rentPercentDisplay = rentPercentDisplay
    
    percentDisplay.appendChild(wagePercent)
    percentDisplay.appendChild(rentPercentDisplay)
    
    // Message display
    const messageDisplay = document.createElement('div')
    messageDisplay.style.cssText = `
      text-align: center;
      margin-bottom: 1.5rem;
      height: 3rem;
    `
    
    const message = document.createElement('p')
    message.style.cssText = `
      font-size: 1.125rem;
      color: #374151;
      font-weight: 500;
    `
    message.textContent = this.phases[0].message
    this.elements.message = message
    messageDisplay.appendChild(message)
    
    // Educational note
    const educationalNote = document.createElement('div')
    educationalNote.style.cssText = `
      padding: 1rem;
      background: #fef3c7;
      border: 1px solid #fde68a;
      border-radius: 0.5rem;
    `
    
    const noteTitle = document.createElement('h4')
    noteTitle.style.cssText = `
      font-weight: 600;
      color: #92400e;
      margin-bottom: 0.5rem;
    `
    noteTitle.textContent = 'Key Insight:'
    
    const noteText = document.createElement('p')
    noteText.style.cssText = `
      font-size: 0.875rem;
      color: #78350f;
    `
    noteText.textContent = 'As technology and productivity increase, the value of land rises. Land owners capture these gains through higher rent, leaving workers with a shrinking share of what they produce. This is why poverty persists despite economic progress.'
    
    educationalNote.appendChild(noteTitle)
    educationalNote.appendChild(noteText)
    
    // Assemble everything
    animationArea.appendChild(productionSide)
    animationArea.appendChild(wagesSide)
    animationArea.appendChild(wedgeContainer)
    animationArea.appendChild(percentDisplay)
    
    container.appendChild(animationArea)
    container.appendChild(messageDisplay)
    container.appendChild(educationalNote)
    
    this.elements.container = this.manager.addElement('container', container)
    
    // Update initial wedge
    this.updateWedge(10)
  }
  
  updateWedge(percentage) {
    const angle = (percentage / 100) * 90 // Max 90 degrees
    const angleRad = angle * Math.PI / 180
    const x = 100 + 80 * Math.sin(angleRad)
    const y = 100 - 80 * Math.cos(angleRad)
    const largeArc = angle > 45 ? 1 : 0
    
    const pathData = `M 100,100 L 100,20 A 80,80 0 ${largeArc},1 ${x},${y} Z`
    this.elements.wedgePath.setAttribute('d', pathData)
    
    // Update percentage displays
    this.elements.rentPercent.textContent = `${percentage}%`
    this.elements.rentPercentDisplay.querySelector('div').textContent = `${percentage}%`
    this.elements.wagePercent.querySelector('div').textContent = `${100 - percentage}%`
    
    // Update bar widths
    const productionWidth = 100 + (this.phase * 20)
    const wagesWidth = 100 - (this.phase * 15)
    this.elements.productionBar.style.width = `${productionWidth}px`
    this.elements.wagesBar.style.width = `${wagesWidth}px`
  }
  
  buildTimeline() {
    const timeline = this.manager.createTimeline()
    
    // Animate through phases
    let totalDuration = 0
    this.phases.forEach((phase, index) => {
      timeline.to(this, {
        rentPercentage: phase.rentTarget,
        duration: phase.duration,
        ease: 'power2.inOut',
        onUpdate: () => {
          this.updateWedge(Math.round(this.rentPercentage))
        },
        onStart: () => {
          this.phase = index
          this.elements.message.textContent = phase.message
          
          // Animate emojis
          if (index % 2 === 0) {
            this.manager.animateElement(this.elements.factory, {
              scale: 1.1,
              duration: 0.5,
              yoyo: true,
              repeat: 1
            })
          } else {
            this.manager.animateElement(this.elements.worker, {
              scale: 0.95,
              duration: 0.5,
              yoyo: true,
              repeat: 1
            })
          }
        }
      }, totalDuration)
      
      totalDuration += phase.duration
    })
    
    this.timeline = timeline
  }
  
  play() {
    if (this.timeline) {
      this.timeline.play()
    }
  }
  
  pause() {
    if (this.timeline) {
      this.timeline.pause()
    }
  }
  
  reset() {
    if (this.timeline) {
      this.timeline.seek(0)
      this.timeline.pause()
      this.phase = 0
      this.rentPercentage = 10
      this.updateWedge(10)
      this.elements.message.textContent = this.phases[0].message
    }
  }
  
  seek(progress) {
    if (this.timeline) {
      const totalDuration = this.timeline.duration()
      this.timeline.seek(totalDuration * progress)
    }
  }
  
  stop() {
    this.reset()
  }
}