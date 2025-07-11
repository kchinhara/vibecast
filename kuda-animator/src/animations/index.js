// Animation exports
export { default as IntroAnimation } from './IntroAnimation.js'
export { default as ConceptsAnimation } from './ConceptsAnimation.js'
export { default as InteractiveAnimation } from './InteractiveAnimation.js'

// Henry George Economic Animations
export { default as LandValueGradientAnimation } from './LandValueGradientAnimation.js'
export { default as RentWedgeAnimation } from './RentWedgeAnimation.js'
export { default as ThreeFactorPieAnimation } from './ThreeFactorPieAnimation.js'
export { default as LVTSimulatorAnimation } from './LVTSimulatorAnimation.js'

// Animation metadata for loader
export const animationMetadata = {
  intro: {
    name: 'Introduction',
    description: 'Welcome to Kuda Animator',
    duration: '30s',
    category: 'basics'
  },
  concepts: {
    name: 'Animation Concepts',
    description: 'Learn timing, easing, and sequencing',
    duration: '45s',
    category: 'basics'
  },
  interactive: {
    name: 'Interactive Creator',
    description: 'Create your own animations',
    duration: 'unlimited',
    category: 'basics'
  },
  landValueGradient: {
    name: 'Land Value Gradient',
    description: 'How location creates value',
    duration: '60s',
    category: 'georgist'
  },
  rentWedge: {
    name: 'The Wedge of Rent',
    description: 'Why workers get less as society progresses',
    duration: '90s',
    category: 'georgist'
  },
  threeFactorPie: {
    name: 'Three Factors of Production',
    description: 'Land, Labor, and Capital distribution',
    duration: '75s',
    category: 'georgist'
  },
  lvtSimulator: {
    name: 'Land Value Tax Simulator',
    description: 'Interactive city economics simulator',
    duration: 'unlimited',
    category: 'georgist'
  }
}