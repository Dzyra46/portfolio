# Feature Checklist

## Public Website

- [x] Hero section
- [x] About section
- [x] Skills / tech stack section
- [x] Featured projects section
- [x] Project detail page
- [x] Experience timeline
- [x] Education section
- [x] Certificates section
- [x] Testimonials section
- [x] Contact form
- [x] Footer
- [x] Social links
- [x] Download CV button
- [ ] GitHub link buttons
- [x] Dark mode first
- [x] Responsive layout
- [x] SEO metadata
- [x] Open Graph metadata
- [ ] Favicon
- [x] Sitemap
- [x] Robots.txt
- [x] 404 page
- [x] Error page
- [x] Loading states
- [x] Empty states

## Admin Dashboard

- [x] Admin login
- [x] Admin logout
- [x] Protected admin routes
- [x] Dashboard overview
- [x] Profile management
- [x] Social links management
- [x] Skills management
- [x] Projects management
- [ ] GitHub metadata view
- [ ] GitHub sync action
- [x] Experience management
- [x] Education management
- [x] Certificates management
- [x] Testimonials management
- [x] Contact messages inbox
- [x] Analytics overview
- [x] Form validation
- [x] Delete confirmation
- [ ] Success notifications
- [x] Error notifications
- [x] Loading states
- [x] Empty states

## Backend API

- [x] Health endpoint
- [x] Auth login endpoint
- [x] Auth logout / current admin endpoint
- [x] Public profile endpoint
- [x] Public skills endpoint
- [x] Public projects endpoint
- [x] Public project detail endpoint
- [x] Public experience endpoint
- [x] Public education endpoint
- [x] Public certificates endpoint
- [x] Public testimonials endpoint
- [x] Contact message endpoint
- [x] Analytics event endpoint
- [x] Admin profile CRUD
- [x] Admin skills CRUD
- [x] Admin projects CRUD
- [x] Admin experience CRUD
- [x] Admin education CRUD
- [x] Admin certificates CRUD
- [x] Admin testimonials CRUD
- [x] Admin contact messages endpoint
- [x] Admin analytics summary endpoint
- [ ] GitHub sync endpoint
- [x] Consistent error responses
- [x] Request validation
- [x] Response schemas

## Database

- [x] `admin_users` table
- [x] `profiles` table
- [x] `social_links` table
- [x] `skills` table
- [x] `projects` table
- [x] `project_github_metadata` table
- [x] `project_skills` join table
- [x] `experiences` table
- [x] `educations` table
- [x] `certificates` table
- [x] `testimonials` table
- [x] `contact_messages` table
- [x] `analytics_events` table
- [ ] `page_views` table (optional if separate from analytics_events)
- [x] `seo_settings` table
- [x] `created_at` columns
- [x] `updated_at` columns
- [x] Indexes for slug fields
- [x] Indexes for published/status fields
- [x] Indexes for analytics event type
- [x] Indexes for timestamps
- [x] Seed data
- [x] Alembic migrations
