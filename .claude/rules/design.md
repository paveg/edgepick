---
paths: ["apps/web/**"]
---

# Design Rules

## Color

- Never hardcode color values in components or pages
- Always reference design tokens via CSS custom properties (e.g., `bg-primary`, `text-muted-foreground`)
- Color definitions live only in `apps/web/src/styles/globals.css`

## Components

- Use shadcn/ui components first; only create custom components when no suitable shadcn/ui component exists
- When extending shadcn/ui components, wrap them rather than modifying the generated source
- Add new shadcn/ui components via `pnpm dlx shadcn@latest add <component>` from `apps/web/`

## Separation of Concerns

- Astro files (`.astro`): layout, static content, SEO — no client-side interactivity
- React files (`.tsx`): interactive UI, state, event handlers — hydrated via `client:load` or `client:visible`
- Do not mix static layout logic with interactive component logic in the same file
- Keep data fetching, presentation, and business logic in separate layers

## Accessibility

- Follow WCAG 2.1 AA as a baseline
- Color contrast: 4.5:1 for normal text, 3:1 for large text and UI components
- Never convey information by color alone — pair with icons, labels, or patterns
- All interactive elements must be keyboard accessible and have visible focus indicators
- Use semantic HTML elements (`nav`, `main`, `section`, `button`) over generic `div`/`span`
- Images require meaningful `alt` text; decorative images use `alt=""`
- Form inputs must have associated `label` elements
