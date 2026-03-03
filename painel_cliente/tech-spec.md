# 99Freelas Dashboard - Technical Specification

## 1. Tech Stack Overview

| Category | Technology |
|----------|------------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS 3.4 |
| UI Components | shadcn/ui |
| Icons | Lucide React |
| State Management | React useState/useContext |
| Animation | CSS Transitions + Framer Motion (optional) |

## 2. Tailwind Configuration

```javascript
// tailwind.config.js extensions
{
  theme: {
    extend: {
      colors: {
        primary: '#00A8E8',
        'primary-dark': '#0088C8',
        secondary: '#2D3E50',
        surface: '#FFFFFF',
        background: '#F5F5F5',
        'text-primary': '#333333',
        'text-secondary': '#666666',
        'text-muted': '#999999',
        border: '#E0E0E0',
        success: '#4CAF50',
        warning: '#FF9800',
        danger: '#F44336',
        purple: '#9C27B0',
        orange: '#FF5722',
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px rgba(0,0,0,0.1)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.15)',
        dropdown: '0 4px 12px rgba(0,0,0,0.15)',
      },
    },
  },
}
```

## 3. Component Inventory

### Shadcn/UI Components (Pre-installed)
- Button
- Card
- DropdownMenu
- Input
- Avatar
- Progress
- Checkbox
- Separator

### Custom Components

| Component | Props | Description |
|-----------|-------|-------------|
| Header | - | Main navigation header with logo, nav, search, user |
| NavDropdown | title, items | Navigation dropdown menu |
| UserDropdown | user | User profile switcher dropdown |
| StatCard | icon, count, label, color | Statistics display card |
| ProfilePanel | user | User profile with progress |
| ProjectsPanel | projects | Projects list with filters |
| GoalsPanel | goals | Goals checklist with progress |
| HelpButton | - | Floating help button |
| Footer | - | Page footer |

## 4. Animation Implementation Plan

| Interaction | Tech | Implementation |
|-------------|------|----------------|
| Page Load | CSS | Staggered fade-in with animation-delay |
| Card Hover | Tailwind | hover:translate-y-[-2px] hover:shadow-card-hover transition-all duration-200 |
| Dropdown Open | CSS/Framer | opacity + translateY animation, 200ms |
| Button Hover | Tailwind | hover:brightness-110 hover:scale-[1.02] transition-transform |
| Progress Bar | CSS | width animation on mount with transition-width |
| Link Hover | Tailwind | hover:underline transition-all |
| Nav Item Hover | Tailwind | hover:bg-white/10 transition-colors |

## 5. Project File Structure

```
src/
├── components/
│   ├── ui/                    # shadcn/ui components
│   ├── Header.tsx             # Main header with navigation
│   ├── NavDropdown.tsx        # Reusable nav dropdown
│   ├── UserDropdown.tsx       # User profile dropdown
│   ├── StatCard.tsx           # Statistics card
│   ├── ProfilePanel.tsx       # User profile panel
│   ├── ProjectsPanel.tsx      # Projects panel
│   ├── GoalsPanel.tsx         # Goals checklist panel
│   ├── HelpButton.tsx         # Floating help button
│   └── Footer.tsx             # Page footer
├── hooks/
│   └── useDropdown.ts         # Dropdown state management
├── types/
│   └── index.ts               # TypeScript interfaces
├── data/
│   └── mockData.ts            # Mock data for the dashboard
├── App.tsx                    # Main app component
├── App.css                    # Global styles
└── main.tsx                   # Entry point
```

## 6. Package Installation

```bash
# Already included in shadcn init
# Additional packages if needed:
npm install framer-motion  # For advanced animations (optional)
```

## 7. Data Types

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'cliente' | 'freelancer';
  profileCompletion: number;
  rating: number;
  reviewCount: number;
}

interface ProjectStats {
  published: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

interface Goal {
  id: string;
  title: string;
  completed: boolean;
}

interface NavDropdownItem {
  label: string;
  href: string;
  icon?: string;
}

interface NavDropdownMenu {
  title: string;
  items: NavDropdownItem[];
}
```

## 8. Responsive Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| Mobile | < 640px | Single column, hamburger menu |
| Tablet | 640-1024px | 2-column stats, stacked panels |
| Desktop | > 1024px | Full 4-column stats, side-by-side panels |

## 9. Accessibility Requirements

- All interactive elements keyboard accessible
- Proper focus indicators
- ARIA labels on icons and buttons
- Color contrast ratio >= 4.5:1
- Reduced motion support via prefers-reduced-motion
