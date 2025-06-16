# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
```bash
npm run dev              # Start development server at localhost:4321
npm run build            # Build for production (outputs to ./dist/)
npm run preview          # Preview production build locally
npm run check            # Run Astro type checking
npm run typecheck        # Alias for check
```

### Environment Setup
```bash
npm install              # Install all dependencies
```

## Architecture Overview

### Content Management
Uses Astro Content Collections for type-safe content:
- Blog posts in `src/content/blog/` with MDX support
- Projects in `src/content/projects/` for portfolio items
- Schemas defined in `src/content/config.ts` using Zod

### Styling Approach
- Tailwind CSS v4 with custom component classes in `src/styles/global.css`
- Dark mode with system preference detection and manual toggle
- Custom utility classes: `.btn`, `.input`, `.card`
- Responsive design with mobile-first approach

## Key Files and Their Purposes

- `src/layouts/BaseLayout.astro` - Main layout for all pages
- `src/env.d.ts` - TypeScript environment variable types
- `astro.config.mjs` - Static site configuration

## Static Site

This is a static Astro website with no backend dependencies. All content is managed through Content Collections and built at compile time.

## File Structure Guidelines

When making structural changes:
1. Always explain the proposed changes and their impact before executing
2. For reorganizations affecting more than 5 files, ask for confirmation
3. Create a backup plan or document the original structure
4. Update any related documentation after structural changes

## Error Prevention and Debugging

### Common Issues and Solutions
- **YAML Parsing**: Check for special characters in frontmatter (especially apostrophes)
- **Tailwind CSS v4**: Avoid @apply with utility classes in component styles; use direct CSS
- **Markdown Rendering**: Verify syntax highlighting configuration in astro.config.mjs

### Debugging Approach
1. Check error stack traces for specific line numbers
2. Validate configuration files before major changes
3. Test incrementally when implementing complex features

## Content Creation Guidelines

When creating multiple content items:
1. For requests of 5+ items, create 2-3 examples first for approval
2. Maintain consistent quality across all items
3. Use varied examples and perspectives
4. Save incrementally to prevent data loss

## Technology Stack Specifics

### Tailwind CSS v4
- Typography plugin imports differently than v3
- @apply directive has limitations in component styles
- Use direct CSS values in scoped styles
- Configuration is handled via CSS, not config files

### Astro-Specific
- Content collections support nested folder structures
- Markdown processing includes Shiki for syntax highlighting
- Use :global() for styling markdown-generated HTML

## Working with Visual Evidence

When users provide screenshots or images:
1. Acknowledge what you observe in the image
2. Identify the specific issue shown
3. Propose solutions based on visual evidence
4. Ask for clarification if the image is unclear