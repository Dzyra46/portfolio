# Security Checklist

- [ ] No secrets committed to version control
- [ ] `.env.example` exists with all variables documented
- [ ] Strong JWT secret required (minimum 32 characters)
- [ ] Admin passwords hashed (bcrypt or argon2)
- [ ] No plain-text password storage
- [ ] Admin routes protected with authentication
- [ ] CORS allowlist configured (no wildcard in production)
- [ ] Contact form validates all input
- [ ] Contact form has basic spam/rate-limit protection
- [ ] Production errors do not expose stack traces
- [ ] Backend validates all request payloads
- [ ] Frontend does not expose backend secrets
- [ ] GitHub token is backend-only
- [ ] Admin cookie is `HttpOnly` if cookie auth is used
- [ ] `Secure` cookie enabled in production
- [ ] `SameSite` cookie configured
- [ ] SQL injection prevented through ORM/parameterized queries
