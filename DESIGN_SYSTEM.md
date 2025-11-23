# ► Blancbeu Premium Design System

## Overview
A comprehensive luxury design framework for Blancbeu providing sophisticated typography, refined animations, premium components, and elegant visual patterns.

## ► Design Tokens

### Typography
• **Serif Font:** Playfair Display (headings)
• **Sans Font:** Poppins (body text)

Sizes:
• H1: 3.5rem (luxury headlines)
• H2: 2.5rem (section titles)  
• H3: 1.75rem (subsections)
• Body: 1rem (standard text)
• Small: 0.875rem (captions)

### Spacing System
• XS: 0.25rem
• SM: 0.5rem
• MD: 1rem
• LG: 1.5rem
• XL: 2rem
• 2XL: 3rem
• 3XL: 4rem

### Shadows
• None: no shadow
• SM: light shadow
• MD: medium shadow
• LG: strong shadow
• Luxury: premium depth with inset gold

### Transitions
• Fast: 150ms (quick interactions)
• Normal: 250ms (standard transitions)
• Slow: 350ms (smooth animations)
• Luxury: 400ms (premium feel)

## ► Premium Components

### Button (btn-luxury)
```html
<button class="btn-luxury">Refined Action</button>
```
Features:
• Gold gradient background
• Shimmer effect on hover
• Smooth lift animation
• Professional padding

### Card (card-luxury)
```html
<div class="card-luxury">
    <h3>Premium Content</h3>
    <p>Elegant information</p>
</div>
```
Features:
• Gold border on hover
• Top accent line appears
• Smooth elevation
• Professional spacing

### Input Fields
```html
<input type="email" placeholder="Enter email">
```
Features:
• Gold focus ring
• Subtle background change
• Smooth transitions
• Professional styling

### Badge (badge-luxury)
```html
<span class="badge-luxury">Premium</span>
```
Features:
• Gold gradient
• Uppercase text
• Professional shadow
• Small, impactful design

## ► Premium Animations

### Entrance Animations
• **fade-in-up:** Fade in while moving up
• **fade-in-down:** Fade in while moving down
• **slide-in-left:** Slide from left
• **slide-in-right:** Slide from right
• **scale-in:** Scale from small to normal

Usage:
```html
<div class="fade-in-up">Content appears elegantly</div>
```

### Continuous Animations
• **float:** Gentle floating motion
• **pulse:** Breathing effect
• **shimmer:** Loading shimmer effect
• **glow:** Glowing box shadow

## ► Hover Effects

### Hover Lift
```html
<div class="hover-lift">Lifts on hover</div>
```

### Hover Glow
```html
<div class="hover-glow">Glows on hover</div>
```

### Hover Scale
```html
<div class="hover-scale">Scales on hover</div>
```

## ► Utility Classes

### Visual Elements
• `.divider` - Elegant gradient divider
• `.divider-dot` - Decorative dot divider

### Animation Utilities
• `.fade-in-up`, `.fade-in-down`
• `.slide-in-left`, `.slide-in-right`
• `.scale-in`
• `.float`, `.pulse`
• `.shimmer`

## ► Color Palette

Dark Theme (Default):
• Primary: #000000 (black)
• Gold: #FFD700 (24k gold)
• Text: #ffffff (white)
• Accents: Gold gradients

Light Theme:
• Primary: #ffffff (white)
• Gold: #b8860b (dark gold)
• Text: #1a1a1a (dark)
• Accents: Subtle gold

## ► Usage Examples

### Premium Heading
```html
<h1>Welcome to Blancbeu</h1>
```
Automatically styled with serif font and gold gradient.

### Premium Section
```html
<div class="card-luxury">
    <h3>Our Services</h3>
    <p>Premium beauty treatments</p>
    <button class="btn-luxury">Book Now</button>
</div>
```

### Premium List
```html
<div class="fade-in-up">
    <h2>Why Choose Us</h2>
    <div class="divider"></div>
    <p>Luxury service, expert care</p>
</div>
```

## ► Responsive Design

Automatically adapts for:
• Desktop: Full design
• Tablet: Adjusted spacing (768px)
• Mobile: Compact design (480px)

Typography scales appropriately on smaller screens.

## ► Implementation Tips

1. **Use Semantic HTML** - Headings automatically get serif styling
2. **Combine Classes** - Mix `card-luxury` + `hover-lift` + `fade-in-up`
3. **Color Consistency** - Theme variables handle light/dark automatically
4. **Animation Caution** - Use animations sparingly for elegance
5. **Spacing** - Use CSS variables for consistent spacing

## ► Best Practices

► Use premium animations for entrance only (not continuous)
► Combine hover effects for depth
► Keep typography hierarchy clear
► Use gold accents strategically
► Maintain white space for elegance
► Test on mobile for responsive feel

---

**Status:** Complete
**Version:** 1.0.0 Production
**Last Updated:** November 23, 2025

Built for refined elegance and luxury visual experience.
