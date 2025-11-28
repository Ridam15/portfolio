# Portfolio Styles Guide

Complete reference for custom CSS classes and utilities in the portfolio application.

## 🎨 CSS Variables

### Color Palette

```css
--color-primary-cyan: #06b6d4;
--color-primary-electric-blue: #3b82f6;
--color-primary-neon-green: #10b981;
--color-primary-purple: #8b5cf6;
--color-primary-pink: #ec4899;
```

### Background Colors

```css
--color-bg-deepest: #030712;  /* Main background */
--color-bg-deep: #0f172a;     /* Secondary background */
--color-bg-dark: #1e293b;     /* Card backgrounds */
--color-bg-medium: #334155;   /* Hover states */
```

## 🪟 Glassmorphism Effects

### `.glass-card`
Basic glass card with blur effect
```html
<div class="glass-card p-6">
  <h3>Glass Card</h3>
  <p>Content here</p>
</div>
```

### `.glass-card-hover`
Glass card with hover effects
```html
<div class="glass-card-hover p-6">
  <h3>Hoverable Card</h3>
  <p>Lifts up on hover</p>
</div>
```

### `.glass-card-cyan`
Glass card with cyan border glow
```html
<div class="glass-card-cyan p-6">
  <h3>Cyan Accent</h3>
  <p>Subtle cyan glow</p>
</div>
```

### `.glass-card-glow`
Glass card with strong glow effect
```html
<div class="glass-card-glow p-6">
  <h3>Glowing Card</h3>
  <p>Strong cyan glow</p>
</div>
```

## ✨ Animations

### Gradient Animation
```html
<div class="bg-gradient-to-r from-cyan-500 to-blue-500 animate-gradient">
  Animated gradient background
</div>
```

### Pulse Glow
```html
<div class="border-2 border-cyan-500 animate-pulse-glow">
  Pulsing glow effect
</div>
```

### Slide In Animations
```html
<!-- Slide from left -->
<div class="animate-slide-in-left">Content</div>

<!-- Slide from right -->
<div class="animate-slide-in-right">Content</div>

<!-- Slide from bottom -->
<div class="animate-slide-in-up">Content</div>

<!-- Slide from top -->
<div class="animate-slide-in-down">Content</div>
```

### Fade In Animations
```html
<!-- Normal speed -->
<div class="animate-fade-in">Content</div>

<!-- Fast -->
<div class="animate-fade-in-fast">Quick fade</div>

<!-- Slow -->
<div class="animate-fade-in-slow">Slow fade</div>
```

### Scale In
```html
<div class="animate-scale-in">
  Scales from 90% to 100%
</div>
```

### Bounce In
```html
<div class="animate-bounce-in">
  Bounces into view
</div>
```

### Float
```html
<div class="animate-float">
  Floating element (infinite)
</div>
```

## 🎨 Gradient Text

### Basic Gradient
```html
<h1 class="text-gradient">
  Cyan to Blue Gradient
</h1>
```

### Cyan-Blue Gradient
```html
<h1 class="text-gradient-cyan-blue">
  Cyan to Blue
</h1>
```

### Purple-Pink Gradient
```html
<h1 class="text-gradient-purple-pink">
  Purple to Pink
</h1>
```

### Green-Cyan Gradient
```html
<h1 class="text-gradient-green-cyan">
  Green to Cyan
</h1>
```

### Rainbow Gradient
```html
<h1 class="text-gradient-rainbow">
  Multi-color Rainbow
</h1>
```

### Animated Gradient Text
```html
<h1 class="text-gradient-animate">
  Animated shifting gradient
</h1>
```

## 🎯 Background Patterns

### Grid Pattern
```html
<div class="bg-grid-pattern min-h-screen">
  Subtle grid background
</div>
```

### Dots Pattern
```html
<div class="bg-dots-pattern min-h-screen">
  Subtle dots background
</div>
```

## 🔘 Buttons

### Primary Button
```html
<button class="btn-primary">
  Click Me
</button>
```

### Secondary Button
```html
<button class="btn-secondary">
  Secondary Action
</button>
```

### Ghost Button
```html
<button class="btn-ghost">
  Ghost Button
</button>
```

## 📝 Form Elements

### Input Field
```html
<input 
  type="text" 
  class="input-field" 
  placeholder="Enter text..."
/>
```

### Textarea
```html
<textarea 
  class="input-field" 
  rows="4"
  placeholder="Enter message..."
></textarea>
```

## 🎴 Cards

### Basic Card
```html
<div class="card">
  <h3>Card Title</h3>
  <p>Card content</p>
</div>
```

### Hoverable Card
```html
<div class="card-hover">
  <h3>Interactive Card</h3>
  <p>Lifts on hover</p>
</div>
```

## 🎯 Utility Classes

### Container
```html
<div class="container-responsive">
  Responsive container with proper padding
</div>
```

### Focus Ring
```html
<button class="focus-ring">
  Accessible focus indicator
</button>
```

### Transitions
```html
<!-- Fast transition (150ms) -->
<div class="transition-fast">Fast</div>

<!-- Normal transition (300ms) -->
<div class="transition-smooth">Normal</div>

<!-- Slow transition (500ms) -->
<div class="transition-slow">Slow</div>
```

### Aspect Ratios
```html
<!-- 16:9 aspect ratio -->
<div class="aspect-video">
  <img src="video.jpg" alt="Video" />
</div>

<!-- Square aspect ratio -->
<div class="aspect-square">
  <img src="avatar.jpg" alt="Avatar" />
</div>
```

## ♿ Accessibility

### Screen Reader Only
```html
<span class="sr-only">
  Hidden text for screen readers
</span>
```

### Not Screen Reader Only
```html
<span class="sr-only md:not-sr-only">
  Hidden on mobile, visible on desktop
</span>
```

## 📋 Complete Component Examples

### Hero Section
```html
<section class="min-h-screen bg-grid-pattern flex items-center justify-center">
  <div class="container-responsive animate-fade-in">
    <h1 class="text-gradient-animate text-6xl font-bold mb-4">
      Ridam Chhapiya
    </h1>
    <p class="text-xl text-gray-400 mb-8">
      Software Engineer
    </p>
    <div class="flex gap-4">
      <button class="btn-primary">
        View Projects
      </button>
      <button class="btn-secondary">
        Contact Me
      </button>
    </div>
  </div>
</section>
```

### Project Card
```html
<div class="glass-card-hover animate-slide-in-up">
  <img 
    src="/project.jpg" 
    alt="Project" 
    class="w-full aspect-video object-cover rounded-lg mb-4"
  />
  <h3 class="text-gradient text-2xl font-bold mb-2">
    Project Name
  </h3>
  <p class="text-gray-400 mb-4">
    Project description goes here
  </p>
  <div class="flex gap-2">
    <span class="px-3 py-1 bg-cyan-500/20 text-cyan-400 rounded-full text-sm">
      React
    </span>
    <span class="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm">
      TypeScript
    </span>
  </div>
  <button class="btn-ghost mt-4 w-full">
    View Details →
  </button>
</div>
```

### Skill Card
```html
<div class="glass-card-cyan p-4 animate-scale-in">
  <div class="flex items-center justify-between mb-2">
    <span class="font-semibold">React</span>
    <span class="text-cyan-400">90%</span>
  </div>
  <div class="w-full bg-gray-800 rounded-full h-2">
    <div 
      class="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full"
      style="width: 90%"
    ></div>
  </div>
</div>
```

### Contact Form
```html
<form class="glass-card p-8 max-w-2xl mx-auto">
  <h2 class="text-gradient text-3xl font-bold mb-6">
    Get In Touch
  </h2>
  
  <div class="mb-4">
    <label class="block text-gray-400 mb-2">Name</label>
    <input 
      type="text" 
      class="input-field" 
      placeholder="Your name"
    />
  </div>
  
  <div class="mb-4">
    <label class="block text-gray-400 mb-2">Email</label>
    <input 
      type="email" 
      class="input-field" 
      placeholder="your@email.com"
    />
  </div>
  
  <div class="mb-6">
    <label class="block text-gray-400 mb-2">Message</label>
    <textarea 
      class="input-field" 
      rows="4"
      placeholder="Your message..."
    ></textarea>
  </div>
  
  <button type="submit" class="btn-primary w-full">
    Send Message
  </button>
</form>
```

### Stats Section
```html
<div class="grid grid-cols-1 md:grid-cols-3 gap-6">
  <div class="glass-card-glow p-6 text-center animate-bounce-in">
    <div class="text-4xl font-bold text-gradient-cyan-blue mb-2">
      50+
    </div>
    <div class="text-gray-400">
      Projects Completed
    </div>
  </div>
  
  <div class="glass-card-glow p-6 text-center animate-bounce-in" style="animation-delay: 0.1s">
    <div class="text-4xl font-bold text-gradient-purple-pink mb-2">
      5+
    </div>
    <div class="text-gray-400">
      Years Experience
    </div>
  </div>
  
  <div class="glass-card-glow p-6 text-center animate-bounce-in" style="animation-delay: 0.2s">
    <div class="text-4xl font-bold text-gradient-green-cyan mb-2">
      100%
    </div>
    <div class="text-gray-400">
      Client Satisfaction
    </div>
  </div>
</div>
```

## 🎨 Color Usage Best Practices

1. **Primary Actions**: Use `btn-primary` with cyan-blue gradient
2. **Secondary Actions**: Use `btn-secondary` with gray background
3. **Emphasis**: Use `text-gradient` for headlines
4. **Backgrounds**: Use `glass-card` variants for containers
5. **Borders**: Use cyan accents (`border-cyan-500/20`) for highlights
6. **Text**: 
   - Primary: `text-white`
   - Secondary: `text-gray-400`
   - Muted: `text-gray-500`

## ⚡ Performance Tips

1. Use `will-change` sparingly for heavy animations
2. Prefer `transform` and `opacity` for animations
3. Use `backdrop-filter` carefully (can be expensive)
4. Test animations on lower-end devices
5. Consider reduced-motion preferences

## 📱 Responsive Design

All utilities work with Tailwind's responsive prefixes:

```html
<div class="glass-card md:glass-card-hover">
  Only hover on medium+ screens
</div>

<h1 class="text-2xl md:text-4xl lg:text-6xl text-gradient">
  Responsive gradient text
</h1>
```

## 🌙 Dark Mode

All styles are designed for dark mode by default. The deep space theme with cyan accents creates a futuristic, professional look.

## 🔍 Accessibility Checklist

- ✅ Sufficient color contrast (WCAG AA)
- ✅ Focus indicators on interactive elements
- ✅ Screen reader text where needed
- ✅ Keyboard navigation support
- ✅ Reduced motion support (add `@media (prefers-reduced-motion)` queries)

