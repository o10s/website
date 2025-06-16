# Personal Portfolio & Blog

A modern, performant portfolio website and technical blog built with Astro. This static site showcases professional work, technical articles on cloud computing, DevOps, and platform engineering.

## 🚀 Tech Stack

### Core Framework
- **[Astro 5.9](https://astro.build/)** - Static site generator with excellent performance
- **TypeScript** - Type-safe development
- **Static Output** - Pre-rendered for GitHub Pages deployment

### Styling & UI
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS with Vite plugin
- **Lucide Icons** - Modern icon library for Astro
- **Dark Mode** - System preference detection with manual toggle

### Features
- **Content Collections** - Type-safe content management for 50+ blog posts and projects
- **MDX Support** - Enhanced markdown with component capabilities
- **Syntax Highlighting** - Shiki with GitHub Dark theme
- **Responsive Design** - Mobile-first approach
- **Draft Support** - Hide unfinished content from production
- **Chronological Organization** - Blog posts organized by year/month

## 📁 Project Structure

```
/
├── public/               # Static assets
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── Header.astro  # Navigation header
│   │   ├── Footer.astro  # Site footer with social links
│   │   ├── ThemeToggle.astro # Dark mode toggle
│   │   ├── BlogPostCard.astro # Blog post preview cards
│   │   └── ProjectCard.astro  # Project showcase cards
│   ├── content/          # Content collections with 50+ posts
│   │   ├── blog/         # Blog posts organized by year/month
│   │   │   └── 2024/     # e.g., 01/, 02/, 03/...
│   │   ├── projects/     # Project showcases
│   │   └── config.ts     # Content schemas with Zod validation
│   ├── layouts/          # Page layouts
│   │   └── BaseLayout.astro # Main layout for all pages
│   ├── pages/            # Route pages
│   │   ├── index.astro   # Portfolio homepage
│   │   ├── about.astro   # About page
│   │   ├── cv.astro      # Resume/CV page
│   │   ├── blog/         # Blog listing and dynamic posts
│   │   │   ├── index.astro    # Blog listing page
│   │   │   └── [...slug].astro # Dynamic blog post routes
│   │   └── projects/     # Projects showcase
│   │       ├── index.astro    # Projects listing
│   │       └── [...slug].astro # Dynamic project routes
│   └── styles/           # Global styles
│       └── global.css    # Custom utilities and Tailwind imports
├── astro.config.mjs      # Astro configuration
└── package.json          # Dependencies and scripts
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/o10s/test-astro-website.git
   cd test-astro-website
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   Open [http://localhost:4321](http://localhost:4321)

### Available Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run check` | Run Astro diagnostics |
| `npm run typecheck` | Run TypeScript type checking |

## 📝 Content Management

### Blog Posts
Blog posts are organized by year and month in `src/content/blog/YYYY/MM/` as MDX files:

```markdown
---
title: "Post Title"
description: "Post description"
pubDate: 2024-01-15
author: "Olivier Alves"
tags: ["kubernetes", "devops", "cloud"]
draft: false  # Set to true to hide from production
---

Your content here...
```

Current topics include:
- Kubernetes & Container Orchestration
- Cloud Computing (AWS, Azure, GCP)
- DevOps & Platform Engineering
- Infrastructure as Code
- Security & Best Practices

### Projects
Projects are in `src/content/projects/` with the following structure:

```markdown
---
title: "Project Name"
description: "Project description"
techStack: ["Astro", "TypeScript", "Tailwind CSS"]
githubUrl: "https://github.com/..."
demoUrl: "https://..."
featured: true
---

Project details...
```

## 🎨 Customization

### Theme Colors
The site uses Tailwind CSS v4 for theming with custom utility classes defined in `src/styles/global.css`:
- Primary actions: Blue scale
- Text: Gray scale with dark mode variants
- Dark mode: System preference with manual toggle via `ThemeToggle` component

### Custom CSS Classes
- `.btn` - Button styles
- `.input` - Form input styles  
- `.card` - Card component styles

## 🚀 Deployment

This site is configured for GitHub Pages deployment:

```bash
npm run build    # Creates static site in ./dist/
```

The build output is optimized for static hosting with:
- Pre-rendered HTML pages
- Optimized assets
- Proper routing for GitHub Pages

## 📄 License

This project is open source. See LICENSE file for details.

## 👤 Author

**Olivier Alves**
- Portfolio: [o10s.github.io](https://o10s.github.io)
- GitHub: [@o10s](https://github.com/o10s)
- Email: contact@o10s.ch

## 🙏 Acknowledgments

Built with [Astro](https://astro.build/) and the amazing web development community.