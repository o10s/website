# Olivier Alves - Personal Website

A modern, performant personal website and blog built with cutting-edge web technologies. This site showcases my professional work, thoughts on technology, and various projects.

## 🚀 Tech Stack

### Core Framework
- **[Astro](https://astro.build/)** - Static site generator with excellent performance and developer experience
- **TypeScript** - For type-safe development
- **Static Output** - Pre-rendered at build time for optimal performance

### Styling
- **[Tailwind CSS v4](https://tailwindcss.com/)** - Utility-first CSS framework
- **Custom CSS** - For markdown rendering and specific component styles
- **Dark Mode** - System preference detection with manual toggle

### Features
- **Content Collections** - Type-safe content management for blog posts and projects
- **MDX Support** - Enhanced markdown with component embedding capabilities
- **Syntax Highlighting** - Using Shiki with GitHub Dark theme
- **SEO Optimized** - Meta tags, Open Graph, and structured data
- **Responsive Design** - Mobile-first approach
- **Search Functionality** - Client-side blog post filtering

## 📁 Project Structure

```
/
├── public/               # Static assets (favicon, robots.txt)
├── scripts/              # Build and utility scripts
├── src/
│   ├── components/       # Reusable Astro components
│   │   ├── Header.astro  # Navigation with construction banner
│   │   ├── Footer.astro  # Site footer
│   │   └── ...
│   ├── content/          # Content collections
│   │   ├── blog/         # Blog posts in MDX
│   │   └── projects/     # Project showcases
│   ├── layouts/          # Page layouts
│   │   └── Layout.astro  # Base layout
│   ├── pages/            # Route pages
│   │   ├── index.astro   # Homepage
│   │   ├── about.astro   # About page
│   │   ├── blog/         # Blog listing and posts
│   │   └── projects/     # Projects showcase
│   └── styles/           # Global styles
├── astro.config.mjs      # Astro configuration
├── tailwind.config.js    # Tailwind configuration
└── package.json          # Dependencies and scripts
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/o10s/personal-website.git
   cd personal-website
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
Blog posts are stored in `src/content/blog/` as MDX files with frontmatter:

```markdown
---
title: "Post Title"
description: "Post description"
pubDate: 2024-01-15
author: "Olivier Alves"
tags: ["web-development", "astro"]
---

Your content here...
```

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

### Toggle Construction Banner
In `src/components/Header.astro`:
```javascript
const SHOW_UNDER_CONSTRUCTION = true; // Set to false to hide
```

### Theme Colors
The site uses Tailwind CSS for theming. Main colors:
- Primary: Blue (`blue-600`)
- Text: Gray scale
- Dark mode: Automatic with system preference


## 📄 License

This project is private and proprietary. All rights reserved.

## 👤 Author

**Olivier Alves**
- Website: [me.o10s.ch](https://me.o10s.ch)
- GitHub: [@o10s](https://github.com/o10s)

## 🙏 Acknowledgments

Built with [Astro](https://astro.build/) and inspired by modern web development best practices.