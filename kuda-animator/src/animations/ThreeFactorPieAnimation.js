// ThreeFactorPieAnimation - Demonstrates how rising rents capture gains from progress
import gsap from 'gsap'

export default class ThreeFactorPieAnimation {
  constructor(manager) {
    this.manager = manager
    this.elements = {}
    this.data = {
      // Initial balanced distribution
      initial: {
        land: 33.33,
        labor: 33.33,
        capital: 33.33
      },
      // Progressive eras showing rent capture
      eras: [
        { 
          name: "Pre-Industrial (1800)", 
          land: 33, 
          labor: 34, 
          capital: 33,
          description: "Relatively balanced economy"
        },
        { 
          name: "Early Industrial (1850)", 
          land: 38, 
          labor: 32, 
          capital: 30,
          description: "Urban land values rising"
        },
        { 
          name: "Railroad Era (1900)", 
          land: 45, 
          labor: 30, 
          capital: 25,
          description: "Land speculation boom"
        },
        { 
          name: "Post-War (1950)", 
          land: 42, 
          labor: 33, 
          capital: 25,
          description: "Suburban expansion"
        },
        { 
          name: "Tech Era (2000)", 
          land: 52, 
          labor: 28, 
          capital: 20,
          description: "Urban rent explosion"
        },
        { 
          name: "Present Day (2024)", 
          land: 58, 
          labor: 25, 
          capital: 17,
          description: "Housing crisis"
        }
      ],
      // Single Tax redistribution
      singleTax: {
        land: 0,     // Land rent captured for public use
        labor: 50,   // Workers keep more
        capital: 50, // Capital keeps more
        public: 100  // Land rent becomes public revenue
      }
    }
    this.currentEra = 0
    this.isWhatIfMode = false
    this.pieRadius = 150
    this.centerX = 300
    this.centerY = 250
  }

  load() {
    // Clear stage
    this.manager.clearStage()
    
    // Create elements
    this.createElements()
    
    // Build animation timeline
    this.buildTimeline()
    
    // Add interactivity
    this.addInteractivity()
  }

  createElements() {
    // Title
    const title = document.createElement('div')
    title.className = 'animation-element'
    title.style.cssText = `
      position: absolute;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 2.2rem;
      font-weight: bold;
      color: #1F2937;
      text-align: center;
    `
    title.textContent = 'The Three Factors of Production'
    this.elements.title = this.manager.addElement('title', title)

    // Subtitle
    const subtitle = document.createElement('div')
    subtitle.className = 'animation-element'
    subtitle.style.cssText = `
      position: absolute;
      top: 60px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2rem;
      color: #6B7280;
      text-align: center;
    `
    subtitle.textContent = 'How progress affects distribution'
    this.elements.subtitle = this.manager.addElement('subtitle', subtitle)

    // Create SVG container for pie chart
    const svgContainer = document.createElement('div')
    svgContainer.style.cssText = `
      position: absolute;
      top: 100px;
      left: 50%;
      transform: translateX(-50%);
      width: 600px;
      height: 400px;
    `
    
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    svg.setAttribute('width', '600')
    svg.setAttribute('height', '400')
    svg.setAttribute('viewBox', '0 0 600 400')
    
    // Create pie chart group
    const pieGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g')
    pieGroup.setAttribute('transform', `translate(${this.centerX}, ${this.centerY})`)
    
    // Create pie slices
    this.createPieSlices(pieGroup)
    
    svg.appendChild(pieGroup)
    svgContainer.appendChild(svg)
    this.elements.svgContainer = this.manager.addElement('svgContainer', svgContainer)
    this.elements.svg = svg
    this.elements.pieGroup = pieGroup

    // Create legend
    this.createLegend()

    // Create timeline selector
    this.createTimelineSelector()

    // Create percentage labels
    this.createPercentageLabels()

    // Create "What if?" button
    this.createWhatIfButton()

    // Create era description
    const eraDescription = document.createElement('div')
    eraDescription.className = 'animation-element'
    eraDescription.style.cssText = `
      position: absolute;
      bottom: 80px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-size: 1.1rem;
      color: #4B5563;
      width: 80%;
      opacity: 0;
    `
    this.elements.eraDescription = this.manager.addElement('eraDescription', eraDescription)

    // Create insight text
    const insight = document.createElement('div')
    insight.className = 'animation-element'
    insight.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      font-size: 1rem;
      color: #6B7280;
      width: 90%;
      font-style: italic;
    `
    insight.textContent = 'As society progresses, land captures an increasing share of wealth'
    this.elements.insight = this.manager.addElement('insight', insight)
  }

  createPieSlices(group) {
    // Create slices with paths
    const sliceData = [
      { id: 'land', color: '#10B981', label: 'Land' },
      { id: 'labor', color: '#3B82F6', label: 'Labor' },
      { id: 'capital', color: '#F59E0B', label: 'Capital' }
    ]

    sliceData.forEach((data, index) => {
      // Create slice path
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      path.setAttribute('id', `slice-${data.id}`)
      path.setAttribute('fill', data.color)
      path.setAttribute('stroke', 'white')
      path.setAttribute('stroke-width', '2')
      path.style.cursor = 'pointer'
      path.style.transition = 'transform 0.2s ease'
      
      // Add hover effect
      path.addEventListener('mouseenter', () => {
        if (!this.isAnimating) {
          path.style.transform = 'scale(1.05)'
          this.showTooltip(data.id)
        }
      })
      
      path.addEventListener('mouseleave', () => {
        path.style.transform = 'scale(1)'
        this.hideTooltip()
      })
      
      group.appendChild(path)
      this.elements[`slice${data.label}`] = path
    })

    // Create center circle for donut effect
    const centerCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    centerCircle.setAttribute('cx', '0')
    centerCircle.setAttribute('cy', '0')
    centerCircle.setAttribute('r', '60')
    centerCircle.setAttribute('fill', 'white')
    group.appendChild(centerCircle)

    // Update initial slice positions
    this.updatePieChart(this.data.initial)
  }

  createLegend() {
    const legend = document.createElement('div')
    legend.className = 'animation-element'
    legend.style.cssText = `
      position: absolute;
      top: 140px;
      right: 40px;
      display: flex;
      flex-direction: column;
      gap: 15px;
    `

    const items = [
      { color: '#10B981', label: 'Land', icon: '🏞️' },
      { color: '#3B82F6', label: 'Labor', icon: '👷' },
      { color: '#F59E0B', label: 'Capital', icon: '🏭' }
    ]

    items.forEach(item => {
      const legendItem = document.createElement('div')
      legendItem.style.cssText = `
        display: flex;
        align-items: center;
        gap: 10px;
        font-size: 1.1rem;
        color: #374151;
      `
      
      const colorBox = document.createElement('div')
      colorBox.style.cssText = `
        width: 20px;
        height: 20px;
        background-color: ${item.color};
        border-radius: 4px;
      `
      
      const label = document.createElement('span')
      label.textContent = `${item.icon} ${item.label}`
      
      legendItem.appendChild(colorBox)
      legendItem.appendChild(label)
      legend.appendChild(legendItem)
    })

    this.elements.legend = this.manager.addElement('legend', legend)
  }

  createPercentageLabels() {
    const labels = ['Land', 'Labor', 'Capital']
    labels.forEach(label => {
      const percentLabel = document.createElement('div')
      percentLabel.className = 'animation-element'
      percentLabel.style.cssText = `
        position: absolute;
        font-size: 1.3rem;
        font-weight: bold;
        color: white;
        text-shadow: 0 0 4px rgba(0,0,0,0.5);
        pointer-events: none;
        opacity: 0;
      `
      percentLabel.id = `percent-${label.toLowerCase()}`
      this.elements[`percent${label}`] = this.manager.addElement(`percent${label}`, percentLabel)
      // Add to the stage
      const stage = document.getElementById('animation-stage')
      if (stage) {
        stage.appendChild(percentLabel)
      }
    })
  }

  createTimelineSelector() {
    const timeline = document.createElement('div')
    timeline.className = 'animation-element'
    timeline.style.cssText = `
      position: absolute;
      bottom: 140px;
      left: 50%;
      transform: translateX(-50%);
      width: 80%;
      max-width: 600px;
    `

    // Timeline title
    const timelineTitle = document.createElement('div')
    timelineTitle.style.cssText = `
      text-align: center;
      font-size: 1.2rem;
      font-weight: bold;
      color: #374151;
      margin-bottom: 10px;
    `
    timelineTitle.textContent = 'Economic Eras'
    timeline.appendChild(timelineTitle)

    // Timeline track
    const track = document.createElement('div')
    track.style.cssText = `
      position: relative;
      height: 4px;
      background: #E5E7EB;
      border-radius: 2px;
      margin: 20px 0;
    `

    // Progress bar
    const progress = document.createElement('div')
    progress.style.cssText = `
      position: absolute;
      height: 100%;
      background: #3B82F6;
      border-radius: 2px;
      width: 0%;
      transition: width 0.5s ease;
    `
    track.appendChild(progress)
    this.elements.timelineProgress = progress

    // Era markers
    const markerContainer = document.createElement('div')
    markerContainer.style.cssText = `
      position: relative;
      display: flex;
      justify-content: space-between;
      margin-top: -10px;
    `

    this.data.eras.forEach((era, index) => {
      const marker = document.createElement('div')
      marker.style.cssText = `
        position: relative;
        cursor: pointer;
        padding: 5px;
      `

      const dot = document.createElement('div')
      dot.style.cssText = `
        width: 12px;
        height: 12px;
        background: ${index === 0 ? '#3B82F6' : '#9CA3AF'};
        border-radius: 50%;
        margin: 0 auto 5px;
        transition: all 0.3s ease;
        border: 2px solid white;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
      `

      const label = document.createElement('div')
      label.style.cssText = `
        font-size: 0.75rem;
        color: #6B7280;
        text-align: center;
        white-space: nowrap;
        transform: rotate(-45deg);
        transform-origin: center;
        margin-top: 10px;
      `
      label.textContent = era.name.split(' ')[1] // Just the year

      marker.appendChild(dot)
      marker.appendChild(label)
      markerContainer.appendChild(marker)

      // Click handler
      marker.addEventListener('click', () => {
        if (!this.isAnimating) {
          this.selectEra(index)
        }
      })

      this.elements[`marker${index}`] = marker
      this.elements[`markerDot${index}`] = dot
    })

    timeline.appendChild(track)
    timeline.appendChild(markerContainer)
    this.elements.timeline = this.manager.addElement('timeline', timeline)
  }

  createWhatIfButton() {
    const button = document.createElement('button')
    button.className = 'animation-element'
    button.style.cssText = `
      position: absolute;
      top: 320px;
      right: 40px;
      padding: 12px 24px;
      background: #8B5CF6;
      color: white;
      border: none;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.3s ease;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    `
    button.textContent = '✨ What if? Single Tax'
    
    button.addEventListener('mouseenter', () => {
      button.style.transform = 'translateY(-2px)'
      button.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'
    })
    
    button.addEventListener('mouseleave', () => {
      button.style.transform = 'translateY(0)'
      button.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'
    })
    
    button.addEventListener('click', () => {
      this.toggleWhatIfMode()
    })
    
    this.elements.whatIfButton = this.manager.addElement('whatIfButton', button)
  }

  updatePieChart(data) {
    let startAngle = -90 // Start from top
    
    // Calculate angles
    const landAngle = (data.land / 100) * 360
    const laborAngle = (data.labor / 100) * 360
    const capitalAngle = (data.capital / 100) * 360

    // Update slices
    this.updateSlice(this.elements.sliceLand, startAngle, landAngle)
    startAngle += landAngle
    
    this.updateSlice(this.elements.sliceLabor, startAngle, laborAngle)
    startAngle += laborAngle
    
    this.updateSlice(this.elements.sliceCapital, startAngle, capitalAngle)

    // Update percentage labels
    this.updatePercentageLabel('Land', data.land, landAngle / 2 - 90)
    this.updatePercentageLabel('Labor', data.labor, landAngle + laborAngle / 2 - 90)
    this.updatePercentageLabel('Capital', data.capital, landAngle + laborAngle + capitalAngle / 2 - 90)
  }

  updateSlice(slice, startAngle, sweepAngle) {
    const startRad = (startAngle * Math.PI) / 180
    const sweepRad = (sweepAngle * Math.PI) / 180
    
    const x1 = Math.cos(startRad) * this.pieRadius
    const y1 = Math.sin(startRad) * this.pieRadius
    const x2 = Math.cos(startRad + sweepRad) * this.pieRadius
    const y2 = Math.sin(startRad + sweepRad) * this.pieRadius
    
    const largeArc = sweepAngle > 180 ? 1 : 0
    
    const pathData = [
      `M 0 0`,
      `L ${x1} ${y1}`,
      `A ${this.pieRadius} ${this.pieRadius} 0 ${largeArc} 1 ${x2} ${y2}`,
      `Z`
    ].join(' ')
    
    slice.setAttribute('d', pathData)
  }

  updatePercentageLabel(factor, percentage, angle) {
    const label = this.elements[`percent${factor}`]
    if (!label) return // Safety check
    
    const rad = (angle * Math.PI) / 180
    const labelRadius = this.pieRadius * 0.7
    
    const x = Math.cos(rad) * labelRadius + this.centerX
    const y = Math.sin(rad) * labelRadius + this.centerY
    
    const stage = document.getElementById('animation-stage')
    const rect = stage ? stage.getBoundingClientRect() : { left: 0, top: 0 }
    
    label.style.left = `${rect.left + x}px`
    label.style.top = `${rect.top + y}px`
    label.style.transform = 'translate(-50%, -50%)'
    label.textContent = `${percentage.toFixed(1)}%`
  }

  selectEra(index) {
    this.currentEra = index
    const era = this.data.eras[index]
    
    // Update timeline progress
    const progress = (index / (this.data.eras.length - 1)) * 100
    this.elements.timelineProgress.style.width = `${progress}%`
    
    // Update markers
    this.data.eras.forEach((_, i) => {
      const dot = this.elements[`markerDot${i}`]
      dot.style.background = i === index ? '#3B82F6' : '#9CA3AF'
      dot.style.transform = i === index ? 'scale(1.3)' : 'scale(1)'
    })
    
    // Animate pie chart
    gsap.to(this, {
      duration: 1,
      ease: 'power2.inOut',
      onUpdate: () => {
        const current = this.getCurrentData()
        this.updatePieChart(current)
      }
    })
    
    // Update description
    this.elements.eraDescription.textContent = `${era.name}: ${era.description}`
    gsap.to(this.elements.eraDescription, {
      opacity: 1,
      duration: 0.5
    })
  }

  getCurrentData() {
    if (this.isWhatIfMode) {
      return this.data.singleTax
    }
    return this.data.eras[this.currentEra]
  }

  toggleWhatIfMode() {
    this.isWhatIfMode = !this.isWhatIfMode
    
    if (this.isWhatIfMode) {
      // Show Single Tax scenario
      this.elements.whatIfButton.textContent = '↩️ Back to History'
      this.elements.whatIfButton.style.background = '#10B981'
      
      // Create public revenue slice
      if (!this.elements.slicePublic) {
        const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
        path.setAttribute('fill', '#8B5CF6')
        path.setAttribute('stroke', 'white')
        path.setAttribute('stroke-width', '2')
        this.elements.pieGroup.appendChild(path)
        this.elements.slicePublic = path
      }
      
      // Animate to Single Tax distribution
      gsap.to(this.elements.sliceLand, {
        opacity: 0,
        duration: 0.5
      })
      
      gsap.to([this.elements.sliceLabor, this.elements.sliceCapital], {
        scale: 1.1,
        duration: 0.8,
        ease: 'back.out(1.7)'
      })
      
      // Update description
      this.elements.eraDescription.textContent = 
        'Single Tax: Land rent funds public services, workers & capital keep all earnings!'
      
      // Update insight
      this.elements.insight.textContent = 
        'By capturing land rent for public use, we can eliminate taxes on labor and capital'
    } else {
      // Return to historical view
      this.elements.whatIfButton.textContent = '✨ What if? Single Tax'
      this.elements.whatIfButton.style.background = '#8B5CF6'
      
      gsap.to(this.elements.sliceLand, {
        opacity: 1,
        duration: 0.5
      })
      
      gsap.to([this.elements.sliceLabor, this.elements.sliceCapital], {
        scale: 1,
        duration: 0.5
      })
      
      // Hide public slice if it exists
      if (this.elements.slicePublic) {
        gsap.to(this.elements.slicePublic, {
          opacity: 0,
          duration: 0.5,
          onComplete: () => {
            this.elements.slicePublic.remove()
            delete this.elements.slicePublic
          }
        })
      }
      
      this.selectEra(this.currentEra)
      
      // Reset insight
      this.elements.insight.textContent = 
        'As society progresses, land captures an increasing share of wealth'
    }
  }

  showTooltip(factor) {
    // Create tooltip if not exists
    if (!this.elements.tooltip) {
      const tooltip = document.createElement('div')
      tooltip.className = 'animation-element'
      tooltip.style.cssText = `
        position: absolute;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 8px 12px;
        border-radius: 6px;
        font-size: 0.9rem;
        pointer-events: none;
        z-index: 1000;
        opacity: 0;
      `
      this.elements.tooltip = this.manager.addElement('tooltip', tooltip)
    }
    
    const data = this.getCurrentData()
    const percentage = data[factor]
    const descriptions = {
      land: 'Returns to location and natural resources',
      labor: 'Wages and salaries for work',
      capital: 'Returns on produced assets and investments'
    }
    
    this.elements.tooltip.innerHTML = `
      <strong>${factor.charAt(0).toUpperCase() + factor.slice(1)}: ${percentage}%</strong><br>
      ${descriptions[factor]}
    `
    
    // Position tooltip
    const rect = this.elements.svgContainer.getBoundingClientRect()
    this.elements.tooltip.style.left = `${this.centerX}px`
    this.elements.tooltip.style.top = `${this.centerY + 200}px`
    
    gsap.to(this.elements.tooltip, {
      opacity: 1,
      duration: 0.2
    })
  }

  hideTooltip() {
    if (this.elements.tooltip) {
      gsap.to(this.elements.tooltip, {
        opacity: 0,
        duration: 0.2
      })
    }
  }

  buildTimeline() {
    const tl = this.manager.createTimeline()
    
    // Initial state
    tl.set([
      this.elements.title,
      this.elements.subtitle,
      this.elements.svgContainer,
      this.elements.legend,
      this.elements.timeline,
      this.elements.whatIfButton,
      this.elements.insight,
      ...Object.values(this.elements).filter(el => 
        el.id && el.id.startsWith('percent-')
      )
    ], { opacity: 0 })
    
    // Animate in sequence
    tl.add(this.manager.fadeIn(this.elements.title, 0.8))
      .add(this.manager.fadeIn(this.elements.subtitle, 0.6), '-=0.4')
      
    // Animate pie chart
    tl.add(this.manager.fadeIn(this.elements.svgContainer, 0.8), '-=0.3')
      .add(this.manager.scale(this.elements.pieGroup, 1.1, 0.5), '-=0.3')
      
    // Show percentage labels
    tl.to(Object.values(this.elements).filter(el => 
      el.id && el.id.startsWith('percent-')
    ), {
      opacity: 1,
      duration: 0.5,
      stagger: 0.1
    }, '-=0.2')
    
    // Show legend
    tl.add(this.manager.slideIn(this.elements.legend, 'right', 0.5), '-=0.3')
    
    // Show timeline
    tl.add(this.manager.fadeIn(this.elements.timeline, 0.8), '-=0.2')
    
    // Show button
    tl.add(this.manager.fadeIn(this.elements.whatIfButton, 0.5), '-=0.3')
      .add(this.manager.bounce(this.elements.whatIfButton, 0.4), '-=0.1')
    
    // Show insight
    tl.add(this.manager.fadeIn(this.elements.insight, 0.6), '-=0.2')
    
    // Auto-progress through eras
    tl.add(() => {
      this.animateThoughEras()
    }, '+=0.5')
  }

  animateThoughEras() {
    this.isAnimating = true
    const timeline = gsap.timeline({
      onComplete: () => {
        this.isAnimating = false
      }
    })
    
    // Progress through each era
    this.data.eras.forEach((era, index) => {
      if (index > 0) {
        timeline.add(() => {
          this.selectEra(index)
        }, `+=${index === 1 ? 1 : 2}`)
      }
    })
  }

  addInteractivity() {
    // Keyboard controls
    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft' && this.currentEra > 0) {
        this.selectEra(this.currentEra - 1)
      } else if (e.key === 'ArrowRight' && this.currentEra < this.data.eras.length - 1) {
        this.selectEra(this.currentEra + 1)
      } else if (e.key === ' ') {
        e.preventDefault()
        this.toggleWhatIfMode()
      }
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
    this.currentEra = 0
    this.isWhatIfMode = false
    this.updatePieChart(this.data.initial)
  }

  stop() {
    this.manager.pause()
    this.manager.clearStage()
  }

  seek(progress) {
    this.manager.seek(progress)
  }
}