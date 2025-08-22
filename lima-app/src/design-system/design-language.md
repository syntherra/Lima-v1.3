# Lima Modern Design Language
## Stunning • Minimal • Intuitive

### Design Philosophy
Lima embodies the future of B2B software design—where elegance meets functionality. Our design language creates an experience that feels premium, effortless, and surprisingly delightful.

**Core Principles:**
- **Effortless Clarity**: Every element serves a purpose, nothing is superfluous
- **Sophisticated Simplicity**: Complex features presented with elegant simplicity
- **Intuitive Flow**: Natural navigation that feels like breathing
- **Premium Feel**: High-end aesthetic that builds trust and confidence

---

## 1. Visual Foundation

### Color Philosophy
**Primary Palette**: Deep, sophisticated tones that convey trust and intelligence
- **Neural**: `#0A0B0D` - Deep space black for premium feel
- **Graphite**: `#1A1D21` - Rich dark gray for elevated surfaces
- **Slate**: `#2D3238` - Mid-tone for secondary elements
- **Ash**: `#F8F9FA` - Pure, clean white for content areas

**Accent System**: Vibrant, purposeful colors that guide attention
- **Electric Blue**: `#00D4FF` - Primary brand, energy, innovation
- **Violet**: `#8B5CF6` - Premium features, AI intelligence
- **Emerald**: `#10B981` - Success, growth, positive metrics
- **Amber**: `#F59E0B` - Attention, warnings, pending states
- **Rose**: `#EF4444` - Errors, critical actions

**Gradient System**: Sophisticated depth and movement
- **Primary**: `linear-gradient(135deg, #00D4FF 0%, #8B5CF6 100%)`
- **Success**: `linear-gradient(135deg, #10B981 0%, #059669 100%)`
- **Premium**: `linear-gradient(135deg, #8B5CF6 0%, #6366F1 100%)`
- **Neural**: `linear-gradient(135deg, #1A1D21 0%, #374151 100%)`

---

## 2. Typography System

### Font Stack
**Primary**: `'Inter', -apple-system, BlinkMacSystemFont, sans-serif`
**Code**: `'JetBrains Mono', 'Fira Code', monospace`

### Hierarchy
```css
/* Display - Hero sections */
.text-display: 48px, 900 weight, -0.02em tracking

/* H1 - Page titles */
.text-h1: 32px, 700 weight, -0.01em tracking

/* H2 - Section headers */
.text-h2: 24px, 600 weight, -0.005em tracking

/* H3 - Subsection headers */
.text-h3: 18px, 600 weight, normal tracking

/* Body Large - Important content */
.text-lg: 16px, 500 weight, normal tracking

/* Body - Default text */
.text-base: 14px, 400 weight, normal tracking

/* Small - Secondary info */
.text-sm: 12px, 400 weight, 0.01em tracking

/* Micro - Captions, metadata */
.text-xs: 10px, 500 weight, 0.02em tracking
```

---

## 3. Spacing & Layout

### Spacing Scale (8px base)
```css
0.5: 4px    /* Tight elements */
1: 8px      /* Small gaps */
2: 16px     /* Standard spacing */
3: 24px     /* Section spacing */
4: 32px     /* Large spacing */
6: 48px     /* Extra large */
8: 64px     /* Massive spacing */
12: 96px    /* Hero spacing */
```

### Grid System
- **Container**: Max 1400px, responsive padding
- **Columns**: 12-column grid with 24px gutters
- **Breakpoints**: Mobile-first approach
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px
  - `2xl`: 1536px

---

## 4. Component Architecture

### Card System
**Elevated Cards**: Floating elements with subtle shadows
```css
background: rgba(255, 255, 255, 0.95)
backdrop-filter: blur(12px)
border: 1px solid rgba(255, 255, 255, 0.2)
border-radius: 16px
box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08)
```

**Glass Cards**: Modern glassmorphism effect
```css
background: rgba(255, 255, 255, 0.1)
backdrop-filter: blur(20px)
border: 1px solid rgba(255, 255, 255, 0.15)
border-radius: 20px
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15)
```

### Button System
**Primary**: Gradient background, bold presence
**Secondary**: Clean outline, subtle fill on hover
**Ghost**: Minimal, text-only, elegant hover states
**Icon**: Perfect squares, consistent sizing

---

## 5. Motion & Interaction

### Animation Principles
- **Duration**: 150ms for micro, 300ms for standard, 500ms for complex
- **Easing**: `cubic-bezier(0.4, 0, 0.2, 1)` for natural movement
- **Purpose**: Every animation has meaning—feedback, guidance, delight

### Micro-interactions
- **Hover**: Subtle scale (1.02x), color transitions
- **Focus**: Prominent outline, inner glow
- **Active**: Quick scale down (0.98x), immediate feedback
- **Loading**: Elegant skeletal states, pulsing gradients

---

## 6. Data Visualization

### Chart Colors
- **Primary Data**: Electric Blue gradient
- **Secondary Data**: Violet gradient
- **Success Metrics**: Emerald gradient
- **Neutral Data**: Graphite to Ash gradient

### Table Design
- **Zebra Striping**: Subtle, almost imperceptible
- **Hover States**: Soft highlight, smooth transition
- **Active States**: Stronger highlight, clear selection
- **Headers**: Bold, slightly elevated appearance

---

## 7. Navigation Design

### Sidebar
- **Width**: 280px desktop, full-width mobile
- **Background**: Neural with subtle texture
- **Items**: Rounded, smooth state transitions
- **Active**: Electric Blue accent, subtle glow

### Header
- **Height**: 72px for breathing room
- **Background**: Glass effect over content
- **Search**: Prominent, always accessible
- **Profile**: Clean, professional presentation

---

## 8. Form Design

### Input Fields
- **Background**: Subtle ash with transparency
- **Border**: Thin, increases on focus
- **Label**: Floating animation on focus
- **States**: Clear visual feedback for all states

### Validation
- **Success**: Emerald accent, checkmark icon
- **Error**: Rose accent, clear error message
- **Warning**: Amber accent, informative tone

---

## 9. Mobile Optimization

### Touch Targets
- **Minimum**: 44px for comfortable tapping
- **Spacing**: Adequate gap between interactive elements
- **Gestures**: Intuitive swipe, pinch, tap interactions

### Responsive Behavior
- **Fluid**: Content adapts gracefully
- **Progressive**: Features enhance on larger screens
- **Performance**: Optimized for mobile networks

---

## 10. Accessibility

### Contrast
- **Text**: Minimum 4.5:1 ratio
- **Interactive**: Minimum 3:1 ratio
- **Focus**: High contrast, clearly visible

### Motion
- **Reduced Motion**: Respects user preferences
- **Alt Text**: Comprehensive image descriptions
- **Keyboard**: Full navigation support