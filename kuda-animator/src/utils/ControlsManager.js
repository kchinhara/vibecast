// ControlsManager - Handle animation playback controls
export class ControlsManager {
  constructor() {
    this.controls = {}
    this.callbacks = {}
    this.isEnabled = true
  }
  
  // Bind control elements
  bindControls(controls) {
    this.controls = controls
    this.setupKeyboardShortcuts()
  }
  
  // Setup keyboard shortcuts
  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (!this.isEnabled) return
      
      switch(e.code) {
        case 'Space':
          e.preventDefault()
          this.controls.playPause?.click()
          break
        case 'KeyR':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault()
            this.controls.reset?.click()
          }
          break
        case 'ArrowLeft':
          this.adjustTimeline(-5)
          break
        case 'ArrowRight':
          this.adjustTimeline(5)
          break
      }
    })
  }
  
  // Adjust timeline position
  adjustTimeline(delta) {
    const timeline = this.controls.timeline
    if (!timeline) return
    
    const newValue = parseFloat(timeline.value) + delta
    timeline.value = Math.max(0, Math.min(100, newValue))
    timeline.dispatchEvent(new Event('input'))
  }
  
  // Enable/disable controls
  setEnabled(enabled) {
    this.isEnabled = enabled
    
    Object.values(this.controls).forEach(control => {
      if (control) {
        control.disabled = !enabled
      }
    })
  }
  
  // Update play/pause button state
  updatePlayPauseState(isPlaying) {
    const btn = this.controls.playPause
    if (btn) {
      btn.textContent = isPlaying ? '⏸️ Pause' : '▶️ Play'
    }
  }
  
  // Update timeline position
  updateTimelinePosition(progress) {
    const timeline = this.controls.timeline
    if (timeline) {
      timeline.value = progress * 100
    }
  }
  
  // Register callback
  on(event, callback) {
    if (!this.callbacks[event]) {
      this.callbacks[event] = []
    }
    this.callbacks[event].push(callback)
  }
  
  // Trigger callbacks
  trigger(event, data) {
    if (this.callbacks[event]) {
      this.callbacks[event].forEach(cb => cb(data))
    }
  }
  
  // Show keyboard shortcuts help
  showShortcuts() {
    const shortcuts = [
      'Space - Play/Pause',
      'R - Reset animation',
      '← → - Scrub timeline',
      'Ctrl/Cmd + R - Reset'
    ]
    
    return shortcuts
  }
}