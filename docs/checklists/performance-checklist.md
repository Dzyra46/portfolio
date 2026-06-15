# Performance Checklist

## Frontend Performance

- [ ] Use server components for public content where possible
- [ ] Minimize client components
- [ ] Avoid unnecessary `useEffect` data fetching
- [ ] Avoid large animation libraries unless necessary
- [ ] Lazy-load heavy interactive sections
- [ ] Lazy-load non-critical admin pages
- [ ] Optimize images
- [ ] Use `width` and `height` for images to prevent layout shift
- [ ] Use `next/image` where appropriate
- [ ] Use font optimization
- [ ] Avoid too many custom fonts
- [ ] Avoid large background videos in MVP
- [ ] Avoid blocking scripts
- [ ] Avoid excessive hydration
- [ ] Avoid duplicate API calls
- [ ] Cache public content where appropriate
- [ ] Respect `prefers-reduced-motion`
- [ ] Keep initial JavaScript small
- [ ] Test mobile performance
- [ ] Test slow network behavior

## Core Web Vitals

- [ ] LCP under 2.5s on good connection
- [ ] CLS under 0.1
- [ ] INP under 200ms
- [ ] Hero content loads quickly
- [ ] No layout shift from images
- [ ] No layout shift from fonts
- [ ] No layout shift from scrollbars
- [ ] No heavy animation during initial load
- [ ] No render-blocking third-party scripts
- [ ] Contact form interaction remains responsive

## Backend Performance

- [ ] Use database connection pooling
- [ ] Add indexes for common queries
- [ ] Paginate admin list endpoints
- [ ] Paginate analytics events
- [ ] Avoid N+1 queries
- [ ] Use selective columns when appropriate
- [ ] Validate payload size
- [ ] Keep analytics insert lightweight
- [ ] Do not block user requests with GitHub sync
- [ ] Add timeout for external GitHub API calls
- [ ] Add health check endpoint
- [ ] Log slow operations

## Database Performance

- [ ] Index `projects.slug`
- [ ] Index `projects.is_published`
- [ ] Index `projects.featured`
- [ ] Index `skills.sort_order`
- [ ] Index `experiences.sort_order`
- [ ] Index `certificates.sort_order`
- [ ] Index `analytics_events.event_type`
- [ ] Index `analytics_events.created_at`
- [ ] Index `contact_messages.created_at`
- [ ] Avoid storing large blobs directly in PostgreSQL
- [ ] Use JSONB only for flexible metadata
- [ ] Keep core searchable fields relational

## Docker Performance

- [ ] Use multi-stage builds
- [ ] Keep final images small
- [ ] Cache dependency installation
- [ ] Do not copy unnecessary files into images
- [ ] Use `.dockerignore`
- [ ] Avoid running as root in production containers
- [ ] Add health checks
- [ ] Use production environment variables
- [ ] Use persistent PostgreSQL volume
- [ ] Keep frontend and backend independently buildable
