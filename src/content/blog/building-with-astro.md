---
title: "Why I Built My Portfolio with Astro"
description: "A look at why Astro is the perfect framework for building fast, content-focused websites with zero JavaScript by default."
pubDate: 2026-01-01
tags: ["astro", "webdev", "performance"]
---

When it came time to rebuild my portfolio, I had plenty of options. React, Next.js, SvelteKit, plain HTML... but I chose **Astro**. Here's why.

## The Performance Advantage

Astro ships **zero JavaScript by default**. In a world where the average webpage is bloated with megabytes of JavaScript, this is revolutionary. My portfolio loads in milliseconds because there's simply less to download.

```javascript
// Astro components are server-rendered by default
---
const greeting = "Hello, World!";
---

<h1>{greeting}</h1>
```

## Island Architecture

When I do need interactivity, Astro's island architecture lets me hydrate only the components that need it. The rest stays as static HTML.

## Content Collections

For this blog, I'm using Astro's built-in content collections. It gives me:

- Type-safe frontmatter validation
- Automatic slug generation
- Easy querying and filtering

## The Developer Experience

The DX is incredible. I can use my favorite UI frameworks, write in TypeScript, and the build times are lightning fast.

If you're building a content-focused site, give Astro a try. You won't regret it.
