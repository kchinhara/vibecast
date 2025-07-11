// InteractiveAnimation - Interactive drag and drop animation creator
export default class InteractiveAnimation {
  constructor(manager) {
    this.manager = manager
    this.elements = {}
    this.isRecording = false
    this.recordedActions = []
    this.draggedElement = null
  }
  
  load() {
    this.manager.clearStage()
    this.createElements()
    this.setupInteractions()
  }
  
  createElements() {
    // Instructions
    const instructions = document.createElement('div')
    instructions.className = 'animation-element'
    instructions.style.cssText = `
      position: absolute;
      top: 10px;
      left: 50%;
      transform: translateX(-50%);
      text-align: center;
      color: #6B7280;
      font-size: 0.9rem;
    `
    instructions.innerHTML = `
      <strong>Interactive Mode</strong><br>
      Drag shapes to create your animation!
    `
    this.elements.instructions = this.manager.addElement('instructions', instructions)
    
    // Create shape palette
    const palette = document.createElement('div')
    palette.className = 'animation-element'
    palette.style.cssText = `
      position: absolute;
      left: 20px;
      top: 60px;
      background: #F3F4F6;
      padding: 10px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    `
    
    const shapes = [
      { type: 'circle', color: '#10B981' },
      { type: 'square', color: '#3B82F6' },
      { type: 'triangle', color: '#8B5CF6' }
    ]
    
    shapes.forEach((shape, index) => {
      const elem = this.manager.createElement(shape.type, {
        x: '10px',
        y: `${10 + index * 70}px`,
        width: '50px',
        height: '50px',
        color: shape.color,
        style: {
          cursor: 'grab',
          position: 'relative'
        }
      })
      elem.dataset.shapetype = shape.type
      elem.dataset.color = shape.color
      palette.appendChild(elem)
    })
    
    this.elements.palette = this.manager.addElement('palette', palette)
    
    // Create workspace
    const workspace = document.createElement('div')
    workspace.className = 'animation-element'
    workspace.style.cssText = `
      position: absolute;
      left: 120px;
      top: 60px;
      right: 20px;
      bottom: 80px;
      background: white;
      border: 2px dashed #E5E7EB;
      border-radius: 8px;
    `
    workspace.id = 'workspace'
    this.elements.workspace = this.manager.addElement('workspace', workspace)
    
    // Control buttons
    const controls = document.createElement('div')
    controls.className = 'animation-element'
    controls.style.cssText = `
      position: absolute;
      bottom: 20px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 10px;
    `
    
    const recordBtn = this.createButton('🔴 Record', () => this.toggleRecording())
    const playbackBtn = this.createButton('▶️ Playback', () => this.playbackRecording())
    const clearBtn = this.createButton('🗑️ Clear', () => this.clearWorkspace())
    
    controls.appendChild(recordBtn)
    controls.appendChild(playbackBtn)
    controls.appendChild(clearBtn)
    
    this.elements.controls = this.manager.addElement('controls', controls)
    this.elements.recordBtn = recordBtn
    this.elements.playbackBtn = playbackBtn
  }
  
  createButton(text, onClick) {
    const btn = document.createElement('button')
    btn.textContent = text
    btn.style.cssText = `
      padding: 8px 16px;
      background: #3B82F6;
      color: white;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 500;
    `
    btn.addEventListener('click', onClick)
    return btn
  }
  
  setupInteractions() {
    // Make palette shapes draggable
    const paletteShapes = this.elements.palette.querySelectorAll('.shape')
    paletteShapes.forEach(shape => {
      shape.addEventListener('mousedown', (e) => this.startDrag(e, true))
    })
    
    // Setup workspace drop zone
    this.elements.workspace.addEventListener('dragover', (e) => e.preventDefault())
    this.elements.workspace.addEventListener('drop', (e) => this.handleDrop(e))
  }
  
  startDrag(e, fromPalette = false) {
    const shape = e.target
    if (!shape.classList.contains('shape')) return
    
    if (fromPalette) {
      // Clone shape from palette
      const clone = shape.cloneNode(true)
      clone.style.position = 'absolute'
      clone.style.left = '0px'
      clone.style.top = '0px'
      clone.style.cursor = 'grabbing'
      clone.dataset.id = `shape-${Date.now()}`
      
      this.elements.workspace.appendChild(clone)
      this.draggedElement = clone
      
      // Setup drag for cloned element
      clone.addEventListener('mousedown', (e) => this.startDrag(e, false))
    } else {
      this.draggedElement = shape
      shape.style.cursor = 'grabbing'
    }
    
    const startX = e.clientX
    const startY = e.clientY
    const startLeft = parseInt(this.draggedElement.style.left) || 0
    const startTop = parseInt(this.draggedElement.style.top) || 0
    
    const handleMouseMove = (e) => {
      const dx = e.clientX - startX
      const dy = e.clientY - startY
      
      this.draggedElement.style.left = `${startLeft + dx}px`
      this.draggedElement.style.top = `${startTop + dy}px`
    }
    
    const handleMouseUp = () => {
      this.draggedElement.style.cursor = 'grab'
      
      if (this.isRecording && this.draggedElement.dataset.id) {
        this.recordAction({
          type: 'move',
          elementId: this.draggedElement.dataset.id,
          position: {
            x: this.draggedElement.style.left,
            y: this.draggedElement.style.top
          },
          timestamp: Date.now()
        })
      }
      
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      this.draggedElement = null
    }
    
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  
  handleDrop(e) {
    e.preventDefault()
    // Drop handling if needed
  }
  
  toggleRecording() {
    this.isRecording = !this.isRecording
    
    if (this.isRecording) {
      this.recordedActions = []
      this.elements.recordBtn.textContent = '⏹️ Stop'
      this.elements.recordBtn.style.background = '#EF4444'
      console.log('🔴 Recording started')
    } else {
      this.elements.recordBtn.textContent = '🔴 Record'
      this.elements.recordBtn.style.background = '#3B82F6'
      console.log('⏹️ Recording stopped. Actions:', this.recordedActions.length)
    }
  }
  
  recordAction(action) {
    this.recordedActions.push(action)
  }
  
  playbackRecording() {
    if (this.recordedActions.length === 0) {
      alert('No recording to playback!')
      return
    }
    
    console.log('▶️ Playing back', this.recordedActions.length, 'actions')
    
    // Create timeline for playback
    const tl = this.manager.createTimeline()
    
    this.recordedActions.forEach((action, index) => {
      if (action.type === 'move') {
        const element = this.elements.workspace.querySelector(`[data-id="${action.elementId}"]`)
        if (element) {
          tl.to(element, {
            left: action.position.x,
            top: action.position.y,
            duration: 0.5,
            ease: 'power2.inOut'
          }, index * 0.3)
        }
      }
    })
    
    tl.play()
  }
  
  clearWorkspace() {
    const shapes = this.elements.workspace.querySelectorAll('.shape')
    shapes.forEach(shape => shape.remove())
    this.recordedActions = []
    console.log('🗑️ Workspace cleared')
  }
  
  play() {
    // No timeline in interactive mode
  }
  
  pause() {
    // No timeline in interactive mode
  }
  
  reset() {
    this.clearWorkspace()
  }
  
  stop() {
    this.manager.clearStage()
  }
  
  seek(progress) {
    // No timeline in interactive mode
  }
}