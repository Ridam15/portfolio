# Projects Component - Usage Guide

## Basic Usage

```typescript
import Projects from '@/components/public/Projects';

export default function HomePage() {
  return (
    <main>
      <Projects />
    </main>
  );
}
```

## Props

```typescript
interface ProjectsProps {
  className?: string; // Optional additional CSS classes
}
```

### Example with Custom Styling

```typescript
<Projects className="bg-gradient-to-b from-gray-900 to-gray-950" />
```

---

## Data Structure

The component uses `usePortfolioData()` hook to fetch projects from Firestore. 

### Expected Firestore Data Structure

**Collection:** `portfolio_content`  
**Document ID:** `main`  
**Field:** `projects` (array)

### Project Object Schema

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  longDescription?: string; // Used in modal
  techStack: string[]; // e.g., ["React", "Next.js", "TypeScript"]
  features: string[]; // Key features list
  links: {
    live?: string; // Live demo URL
    github?: string; // GitHub repository URL
    demo?: string; // Alternative demo URL
  };
  media: Array<{
    type: 'image' | 'video';
    url: string;
    alt?: string;
  }>;
  thumbnail?: string; // Primary image URL
  featured: boolean; // Display as large card
  order: number; // Display order (lower = earlier)
  status?: 'completed' | 'in-progress' | 'planned';
  role?: string; // Your role in the project
  teamSize?: number; // Team size
}
```

---

## Example Firestore Data

```json
{
  "projects": [
    {
      "id": "proj-1",
      "title": "AI-Powered Analytics Dashboard",
      "description": "Real-time analytics platform with AI-driven insights.",
      "longDescription": "A comprehensive analytics platform that leverages machine learning...",
      "techStack": ["React", "Next.js", "TypeScript", "Python", "TensorFlow", "AWS"],
      "features": [
        "Real-time data visualization",
        "AI-powered predictive analytics",
        "Custom dashboard builder"
      ],
      "links": {
        "live": "https://demo.example.com",
        "github": "https://github.com/username/project"
      },
      "media": [
        {
          "type": "image",
          "url": "https://example.com/image.jpg",
          "alt": "Dashboard screenshot"
        }
      ],
      "thumbnail": "https://example.com/thumb.jpg",
      "featured": true,
      "order": 1,
      "status": "completed",
      "role": "Lead Developer",
      "teamSize": 4
    }
  ]
}
```

---

## Customization

### Tech Stack Colors

Modify the `techColors` object in the `TechBadge` component:

```typescript
const techColors: Record<string, string> = {
  'React': 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
  'Next.js': 'bg-white/10 text-white border-white/30',
  // Add your custom technology colors
  'YourTech': 'bg-purple-500/10 text-purple-300 border-purple-500/30',
};
```

### Card Sizing Logic

Modify the `getCardSize()` function:

```typescript
const getCardSize = (project: ProjectType, index: number) => {
  if (project.featured) return 'large'; // Featured = large
  if (index % 3 === 0) return 'medium'; // Every 3rd = medium
  return 'small'; // Default = small
};
```

### Filter Display

The component automatically generates filter buttons from all unique technologies in your projects. No configuration needed!

---

## Styling Variants

### Default Styling (Dark Theme)
```typescript
<Projects />
```

### Custom Background
```typescript
<Projects className="bg-gray-900" />
```

### Different Accent Color
Modify the component or use Tailwind's configuration to change the primary accent from cyan to another color.

---

## Performance Best Practices

### 1. Image Optimization
- Use optimized images (WebP format recommended)
- Keep file sizes under 500KB
- Provide proper aspect ratios (16:9 or 4:3)

### 2. Featured Projects
- Limit to 2-3 featured projects for best visual impact
- Featured projects load with `priority={true}` for faster LCP

### 3. Number of Projects
- Optimal: 6-12 projects for initial load
- For more projects, consider implementing pagination or "Load More"
- Filter feature helps manage large project lists

### 4. Tech Stack
- Keep tech stack arrays to 5-10 items per project
- Most relevant technologies first
- Component automatically truncates display

---

## Integration with Firebase

### Initial Setup

1. **Create Firestore Document:**
   ```javascript
   // In Firebase Console or via script
   const portfolioContent = {
     projects: [
       // Your projects array
     ]
   };
   
   await setDoc(doc(db, 'portfolio_content', 'main'), portfolioContent);
   ```

2. **Update Project:**
   ```typescript
   import { updatePortfolioSection } from '@/lib/firebase/firestore';
   
   await updatePortfolioSection('projects', updatedProjectsArray);
   ```

3. **Add New Project:**
   ```typescript
   const currentData = await getPortfolioContent();
   const updatedProjects = [
     ...currentData.projects,
     newProject
   ];
   
   await updatePortfolioSection('projects', updatedProjects);
   ```

---

## Common Use Cases

### Use Case 1: Simple Portfolio
```typescript
// Just drop the component in your page
import Projects from '@/components/public/Projects';

export default function Portfolio() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
      <Contact />
    </>
  );
}
```

### Use Case 2: Projects-Only Page
```typescript
export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-gray-950">
      <Navigation />
      <Projects className="pt-20" />
      <Footer />
    </div>
  );
}
```

### Use Case 3: Custom Styling
```typescript
<Projects 
  className="bg-gradient-to-b from-gray-950 via-gray-900 to-gray-950" 
/>
```

---

## Accessibility Features

- ✅ Semantic HTML (`<section>`, `<article>`, `<nav>`)
- ✅ Proper heading hierarchy (h2 → h3)
- ✅ Alt text on all images
- ✅ ARIA labels on interactive elements
- ✅ Keyboard accessible links
- ✅ Focus states on interactive elements
- ✅ Screen reader friendly

**Future Enhancement:** Add keyboard navigation for modal (Escape to close, Tab trap)

---

## Browser Support

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Note:** Uses modern CSS features like `backdrop-filter`, which may need fallbacks for older browsers.

---

## Testing

### Test Page Available
Visit `/test-projects` to see the component with mock data and test all features interactively.

### Features to Test
1. Filter switching (All, React, Python, etc.)
2. Card hover effects
3. Modal open/close
4. External links (Live Demo, GitHub)
5. Responsive design (resize browser)
6. Image loading states
7. Error handling (try breaking image URLs)

---

## Troubleshooting

### Issue: Images Not Loading
**Solution:** Ensure image domains are configured in `next.config.ts`:
```typescript
images: {
  remotePatterns: [
    { protocol: 'https', hostname: 'yourdomain.com' },
  ],
}
```

### Issue: No Projects Displayed
**Solution:** Check:
1. Firestore data exists at `portfolio_content/main`
2. `projects` field is an array
3. Projects have required fields (id, title, description, techStack)
4. Firebase configuration is correct

### Issue: Filter Buttons Not Working
**Solution:** Ensure:
1. Projects have `techStack` array
2. Tech stack items are strings
3. React state is updating correctly

### Issue: Modal Not Opening
**Solution:** Check:
1. No JavaScript errors in console
2. `selectedProject` state is updating
3. `AnimatePresence` is wrapping modal correctly

---

## Advanced Customization

### Custom Card Layout

Modify the grid template in the main render:

```typescript
// Change from 3-column to 4-column
<div className="grid grid-cols-1 md:grid-cols-4 gap-6">
  {/* projects */}
</div>
```

### Custom Animation Variants

```typescript
const cardVariants = {
  hidden: { opacity: 0, y: 50 }, // Start further down
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8, // Slower animation
      ease: 'easeOut',
    },
  },
};
```

### Custom Tech Badge Colors

```typescript
const techColors: Record<string, string> = {
  'YourFramework': 'bg-pink-500/10 text-pink-300 border-pink-500/30',
  // Add as many as needed
};
```

---

## Dependencies

Required packages (already in `package.json`):
- `framer-motion` - Animations
- `lucide-react` - Icons
- `next` - Framework
- `react` - UI library
- `clsx` + `tailwind-merge` - Class utilities (via `cn()`)

---

## Component Files

```
components/public/Projects.tsx       # Main component
lib/hooks/useFirestore.ts            # Data fetching hook
lib/utils.ts                         # Utility functions (cn)
components/effects/GlassCard.tsx     # Card wrapper
types/portfolio.ts                   # TypeScript types
```

---

## Support

For issues or questions:
1. Check console for error messages
2. Verify Firestore data structure
3. Ensure all dependencies are installed
4. Review test page at `/test-projects`
5. Check `PROJECTS_COMPONENT_TEST_RESULTS.md` for detailed test results

---

**Last Updated:** November 25, 2024  
**Version:** 1.0.0  
**Status:** Production Ready ✅

