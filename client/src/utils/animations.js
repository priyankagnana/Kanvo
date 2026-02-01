// Framer Motion animation variants for Kanvo

// Fade in from bottom animation
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

// Scale in animation for modals
export const scaleIn = {
  initial: { scale: 0.95, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.95, opacity: 0 }
}

// Slide in from left for sidebar
export const slideInLeft = {
  initial: { x: -20, opacity: 0 },
  animate: { x: 0, opacity: 1 },
  exit: { x: -20, opacity: 0 }
}

// Card hover animation
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 1px 3px rgba(0,0,0,0.12)'
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
    transition: { duration: 0.2 }
  }
}

// Stagger children animation for lists
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1
    }
  }
}

// Individual stagger item
export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3 }
  }
}

// Modal overlay animation
export const modalOverlay = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
}

// Modal content animation
export const modalContent = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' }
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: { duration: 0.2 }
  }
}

// Collapse/expand animation
export const collapse = {
  initial: { height: 0, opacity: 0 },
  animate: {
    height: 'auto',
    opacity: 1,
    transition: { duration: 0.3 }
  },
  exit: {
    height: 0,
    opacity: 0,
    transition: { duration: 0.2 }
  }
}

// Quick action buttons animation
export const quickActions = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15 }
  },
  exit: {
    opacity: 0,
    scale: 0.8,
    transition: { duration: 0.1 }
  }
}

// Chip/filter animation
export const chipAnimation = {
  initial: { scale: 0.8, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.8, opacity: 0 },
  tap: { scale: 0.95 }
}

// Spring transition preset
export const springTransition = {
  type: 'spring',
  stiffness: 300,
  damping: 25
}

// Smooth transition preset
export const smoothTransition = {
  duration: 0.3,
  ease: 'easeInOut'
}
