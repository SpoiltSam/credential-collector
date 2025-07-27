# Credential Collection Tool - Implementation Plan

## Project Summary
Self-hosted, secure credential collection system for AI automation agency. Zero-storage approach using JWT tokens for stateless form generation with professional client experience.

## Core Features to Implement

### Phase 1: Foundation & Core Functionality
1. **JWT Token System**
   - Token generation with embedded form data
   - Service definitions and expiration handling
   - URL generation with self-contained information

2. **Dynamic Form Generation**
   - Support for multiple credential types (API keys, email/password, OAuth JSON, SMTP configs)
   - Service-specific form fields based on JWT payload
   - Real-time validation with visual feedback

3. **Professional UI/UX**
   - Mobile-responsive design using shadcn/ui (Slate theme)
   - Loom video integration for instructions
   - Clean, trustworthy interface

### Phase 2: Security & Integration
4. **Email Delivery System**
   - Encrypted credential transmission via Nodemailer
   - Professional email templates
   - Admin notification system

5. **Airtable Integration**
   - Service definitions storage
   - Request tracking and audit trail
   - Metadata logging (no sensitive data)

### Phase 3: Admin & Management
6. **Admin Interface**
   - Simple form for generating collection requests
   - Service selection and client information input
   - URL generation and sharing

7. **Security Features**
   - One-time form usage enforcement
   - IP logging for audit trail
   - Automatic token expiration

## Technical Implementation Plan

### Dependencies to Add
- `jsonwebtoken` - JWT token handling
- `nodemailer` - Email delivery
- `airtable` - Service definitions and tracking
- `crypto-js` - Client-side encryption
- `zod` - Form validation schemas
- `react-hook-form` - Form state management

### Project Structure
```
src/
├── app/
│   ├── admin/              # Admin interface for generating requests
│   ├── collect/[token]/    # Dynamic credential collection forms
│   ├── api/               # API routes
│   │   ├── generate/      # Token generation endpoint
│   │   ├── submit/        # Form submission handler
│   │   └── validate/      # Real-time credential validation
├── components/
│   ├── forms/             # Dynamic form components
│   ├── ui/                # shadcn/ui components
│   └── videos/            # Loom video integration
├── lib/
│   ├── jwt.ts             # JWT utilities
│   ├── email.ts           # Email service
│   ├── airtable.ts        # Airtable integration
│   ├── encryption.ts      # Encryption utilities
│   └── validators.ts      # Credential validation logic
├── types/
│   └── index.ts           # TypeScript definitions
```

### API Design
- `POST /api/generate` - Generate collection URL with JWT token
- `GET /collect/[token]` - Render collection form from JWT
- `POST /api/submit` - Handle credential submission
- `POST /api/validate` - Real-time credential validation

## Development Workflow

### Following TDD Approach
1. **Write tests first** for each component/feature
2. **Implement functionality** to pass tests
3. **Refactor** while maintaining test coverage
4. **Commit frequently** after each feature completion

### Planning Process
- Create feature-specific planning documents before implementation
- Use scratchpads for complex workflows
- Document architectural decisions in commit messages

## Security Considerations
- JWT signatures prevent tampering
- No persistent storage of credentials
- Client-side encryption before transmission
- Automatic token expiration
- One-time use enforcement
- IP audit logging

## Deployment Strategy
- Vercel deployment on subdomain: credentials.automateadvisory.com
- Environment variables for secrets (JWT secret, email credentials, Airtable API key)
- Separate repository and project structure