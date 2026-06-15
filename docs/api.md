# API Reference

## Base URLs

| Environment | URL |
|-------------|-----|
| Development | `http://localhost:8000` |
| Production | `https://api.yourdomain.com` |

## Authentication

Admin endpoints require JWT token in the `Authorization` header:
```
Authorization: Bearer <token>
```

Or HTTP-only cookie (if cookie auth is used).

---

## Public Endpoints

These endpoints require no authentication and only return published content.

### Health Check
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Application health status |

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/profile` | Developer profile with social links |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/skills` | Published skills sorted by `sort_order` |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/projects` | Published projects (optional `?featured=true`) |
| `GET` | `/api/public/projects/{slug}` | Single project by slug |

### Experience
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/experience` | Published work experiences |

### Education & Certificates
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/education` | Published education entries |
| `GET` | `/api/public/certificates` | Published certificates |

### Testimonials
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/testimonials` | Published testimonials |

### Contact
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/public/contact` | Submit contact form message |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/public/analytics` | Track analytics event |

### SEO
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/public/seo/{page_key}` | SEO metadata for a page |

---

## Auth Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login |
| `POST` | `/api/auth/logout` | Admin logout |
| `GET` | `/api/auth/me` | Current admin user |

---

## Admin Endpoints (Protected)

All admin endpoints require valid authentication.

### Profile
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/profile` | Get admin profile |
| `PUT` | `/api/admin/profile` | Update profile |

### Skills
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/skills` | List all skills |
| `POST` | `/api/admin/skills` | Create skill |
| `PUT` | `/api/admin/skills/{id}` | Update skill |
| `DELETE` | `/api/admin/skills/{id}` | Delete skill |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/projects` | List all projects (including drafts) |
| `POST` | `/api/admin/projects` | Create project |
| `GET` | `/api/admin/projects/{id}` | Get project detail |
| `PUT` | `/api/admin/projects/{id}` | Update project |
| `DELETE` | `/api/admin/projects/{id}` | Delete project |

### Experience
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/experience` | List all experiences |
| `POST` | `/api/admin/experience` | Create experience |
| `PUT` | `/api/admin/experience/{id}` | Update experience |
| `DELETE` | `/api/admin/experience/{id}` | Delete experience |

### Education
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/education` | List all education entries |
| `POST` | `/api/admin/education` | Create education |
| `PUT` | `/api/admin/education/{id}` | Update education |
| `DELETE` | `/api/admin/education/{id}` | Delete education |

### Certificates
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/certificates` | List all certificates |
| `POST` | `/api/admin/certificates` | Create certificate |
| `PUT` | `/api/admin/certificates/{id}` | Update certificate |
| `DELETE` | `/api/admin/certificates/{id}` | Delete certificate |

### Testimonials
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/testimonials` | List all testimonials |
| `POST` | `/api/admin/testimonials` | Create testimonial |
| `PUT` | `/api/admin/testimonials/{id}` | Update testimonial |
| `DELETE` | `/api/admin/testimonials/{id}` | Delete testimonial |

### Contact Messages
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/messages` | List contact messages (paginated) |
| `GET` | `/api/admin/messages/{id}` | Get single message |
| `PATCH` | `/api/admin/messages/{id}` | Update message status |

### Analytics
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/analytics/summary` | Aggregate analytics summary |
| `GET` | `/api/admin/analytics/events` | Paginated event list |

### GitHub Sync
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/admin/github/sync` | Trigger GitHub repository sync |
| `GET` | `/api/admin/github/repos` | List synced repositories |

---

## Response Format

### Success Response
```json
{
  "data": { ... },
  "message": "Success"
}
```

### Error Response
```json
{
  "detail": "Error description",
  "status_code": 400
}
```

### Paginated Response
```json
{
  "data": [ ... ],
  "total": 100,
  "page": 1,
  "page_size": 20
}
```
