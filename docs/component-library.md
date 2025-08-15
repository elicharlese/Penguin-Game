# Component Library

## Overview

This document outlines the atomic component structure for the Penguin Surf Game UI. All components follow the atomic design principle and are built with React and Tailwind CSS.

## Atomic Design Principles

1. **Atoms**: Basic building blocks (buttons, inputs, labels)
2. **Molecules**: Groups of atoms bonded together (form fields, cards)
3. **Organisms**: Groups of molecules joined together (headers, sections)
4. **Templates**: Page-level layouts
5. **Pages**: Specific instances of templates

## Component Structure

### Atoms

- `Button` - Primary and secondary button variants
- `Input` - Text, number, and select inputs
- `Label` - Form labels with proper styling
- `Icon` - SVG icons for UI elements
- `Avatar` - Player avatar display
- `Badge` - Status indicators
- `Progress` - Progress bars for stats

### Molecules

- `Card` - Generic card container with header and content
- `FormField` - Label and input combination
- `StatDisplay` - Player stats display with icon and value
- `WaveIndicator` - Visual wave condition indicator
- `GameModeSelector` - Toggle between game modes
- `PlayerInfo` - Player name, avatar, and stats

### Organisms

- `GameHeader` - Top navigation with player info and game controls
- `GameMenu` - Main menu with navigation options
- `BeachHut` - Beach hut interface with customization options
- `SurfShop` - Shop interface for purchasing items
- `CompetitionPanel` - Competition mode interface
- `SettingsPanel` - Game settings and preferences

### Templates

- `GameLayout` - Main game layout with header and content area
- `MenuLayout` - Menu screen layout
- `ShopLayout` - Shop interface layout
- `CompetitionLayout` - Competition mode layout

### Pages

- `MainMenuPage` - Main menu with game options
- `GamePage` - Main game view
- `BeachPage` - Beach hut view
- `ShopPage` - Shop view
- `CompetitionPage` - Competition mode view
- `SettingsPage` - Settings view

## Implementation Guidelines

### File Structure

```
libs/ui-components/src/
  atoms/
    Button/
      Button.tsx
      Button.stories.tsx
      index.ts
    Input/
      Input.tsx
      Input.stories.tsx
      index.ts
    ...
  molecules/
    Card/
      Card.tsx
      Card.stories.tsx
      index.ts
    ...
  organisms/
    GameHeader/
      GameHeader.tsx
      GameHeader.stories.tsx
      index.ts
    ...
  templates/
    GameLayout/
      GameLayout.tsx
      index.ts
    ...
  index.ts
```

### Component Structure

Each component should follow this structure:

```tsx
import React from 'react';
import classNames from 'classnames';

interface ComponentNameProps {
  // Props interface
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  // Props
}) => {
  // Component implementation
  return (
    // JSX
  );
};

export default ComponentName;
```

### Styling

All components use Tailwind CSS for styling. Custom classes should be avoided in favor of Tailwind utility classes.

### Testing

Each component should have:

1. Storybook stories for visualization
2. Unit tests with Jest and React Testing Library
3. Accessibility tests

### Export Structure

Components are exported through barrel files at each level:

```ts
// libs/ui-components/src/atoms/index.ts
export { default as Button } from './Button';
export { default as Input } from './Input';
// ...
```

```ts
// libs/ui-components/src/index.ts
export * from './atoms';
export * from './molecules';
export * from './organisms';
export * from './templates';
```
