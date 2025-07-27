# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development**: `npm run dev` - Start the Next.js development server on http://localhost:3000
- **Build**: `npm run build` - Create production build
- **Start**: `npm run start` - Start production server
- **Lint**: `npm run lint` - Run ESLint checks
- **Test**: `npm test` - Run test suite (when implemented)

## Development Workflow Best Practices

### Planning and Documentation
- Create planning documents or scratchpads before implementing features
- Use markdown files to outline implementation steps for complex features
- Document decisions and architectural choices in commit messages
- Leverage "think" modes for thorough planning before execution

### Testing Strategy
- Follow Test-Driven Development (TDD) approach:
  1. Write tests first
  2. Confirm tests fail initially
  3. Implement code to make tests pass
  4. Refactor while keeping tests green
- Create comprehensive test coverage for new features
- Use subagents to verify implementation quality

### Git Workflow
- Commit frequently after each feature implementation
- Write descriptive commit messages that explain the "why" not just the "what"
- Use the pattern: "Explore → Plan → Code → Test → Commit"
- Leverage GitHub CLI (`gh`) for issue and PR management

### Code Style Guidelines
- Follow existing TypeScript and React conventions
- Use consistent naming patterns throughout the codebase
- Leverage existing utilities (like `cn()` for className merging)
- Maintain consistent import organization and file structure

## Project Architecture

This is a Next.js 15 application using the App Router architecture with the following key characteristics:

### Framework & Dependencies
- **Next.js 15** with React 19 and TypeScript
- **Tailwind CSS v4** for styling with PostCSS
- **shadcn/ui** components configured (see `components.json`)
- **Utility libraries**: clsx, tailwind-merge for className handling

### Project Structure
- `/src/app/` - Next.js App Router pages and layouts
  - `layout.tsx` - Root layout with Geist fonts
  - `page.tsx` - Homepage (currently default Next.js template)
- `/src/lib/` - Shared utilities
  - `utils.ts` - Contains `cn()` utility for className merging
- `/public/` - Static assets (SVG icons)

### Configuration
- **TypeScript**: Configured with strict mode and `@/*` path aliases
- **ESLint**: Uses Next.js recommended config with TypeScript support
- **shadcn/ui**: New York style, configured for components at `@/components`

### Key Features
- App Router with TypeScript
- Geist font family (Sans and Mono variants)
- CSS variables for theming
- Lucide icons as icon library
- Path aliases configured (`@/` maps to `./src/`)

## Project Context

This is a **Credential Collection Tool** for an AI automation agency - a self-hosted, secure system for collecting client credentials (API keys, passwords, OAuth tokens) with professional UX.

### Key Business Requirements
- Zero-storage security model (no database for credentials)
- JWT-based stateless form generation
- Support for multiple credential types per request
- Real-time credential validation with visual feedback
- Loom video integration for instructions
- Auto-expiring, one-time-use forms
- Mobile-responsive, professional interface

### Architecture Overview
- **JWT tokens** contain all form data (client info, services, expiration)
- **Airtable** stores service definitions and audit metadata only
- **Nodemailer** for encrypted credential email delivery
- **Dynamic forms** generated from JWT payload
- **Stateless design** eliminates cleanup jobs and data breach risk

### Security Model
- No persistent credential storage
- JWT signatures prevent URL tampering
- Client-side encryption before email transmission
- Automatic token expiration (7 days default)
- One-time form usage enforcement
- IP audit logging

### Deployment Target
- Subdomain: credentials.automateadvisory.com
- Vercel deployment as separate project
- Environment-based configuration for secrets

## Development Notes

Reference `docs/PROJECT_PLAN.md` for detailed implementation roadmap and `docs/DEPENDENCIES.md` for setup instructions. Follow TDD approach with frequent commits after each feature completion.