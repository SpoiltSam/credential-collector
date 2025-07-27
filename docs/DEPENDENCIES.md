# Dependencies & Setup Plan

## Required Dependencies to Install

### Core Dependencies
```bash
npm install jsonwebtoken @types/jsonwebtoken
npm install nodemailer @types/nodemailer
npm install airtable
npm install crypto-js @types/crypto-js
npm install zod
npm install react-hook-form @hookform/resolvers
npm install date-fns
```

### UI/Form Dependencies (already have most via shadcn/ui)
```bash
# These may be needed for specific form components
npm install @radix-ui/react-select
npm install @radix-ui/react-checkbox
npm install @radix-ui/react-textarea
npm install react-dropzone
```

### Development Dependencies
```bash
npm install --save-dev @types/jest jest jest-environment-jsdom
npm install --save-dev @testing-library/react @testing-library/jest-dom
npm install --save-dev msw # for mocking API calls in tests
```

## Environment Variables Needed

Create `.env.local`:
```env
# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
ADMIN_EMAIL=admin@automateadvisory.com

# Airtable Configuration
AIRTABLE_API_KEY=your-airtable-api-key
AIRTABLE_BASE_ID=your-base-id
AIRTABLE_SERVICES_TABLE=Services
AIRTABLE_REQUESTS_TABLE=Requests

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ADMIN_URL=http://localhost:3000/admin
```

## Project Structure to Create

```
src/
├── app/
│   ├── admin/
│   │   ├── page.tsx              # Admin dashboard
│   │   └── generate/
│   │       └── page.tsx          # Generate collection URL
│   ├── collect/
│   │   └── [token]/
│   │       ├── page.tsx          # Dynamic collection form
│   │       └── loading.tsx       # Loading state
│   ├── api/
│   │   ├── generate/
│   │   │   └── route.ts          # POST - Generate JWT token
│   │   ├── submit/
│   │   │   └── route.ts          # POST - Handle form submission
│   │   ├── validate/
│   │   │   └── route.ts          # POST - Real-time validation
│   │   └── services/
│   │       └── route.ts          # GET - Fetch service definitions
│   └── globals.css               # Updated styles
├── components/
│   ├── forms/
│   │   ├── credential-form.tsx   # Main dynamic form
│   │   ├── service-field.tsx     # Individual service input
│   │   └── validation-feedback.tsx
│   ├── admin/
│   │   ├── admin-dashboard.tsx   # Admin interface
│   │   └── url-generator.tsx     # URL generation form
│   ├── ui/                       # shadcn/ui components (existing)
│   └── videos/
│       └── loom-embed.tsx        # Loom video integration
├── lib/
│   ├── jwt.ts                    # JWT token utilities
│   ├── email.ts                  # Email service functions
│   ├── airtable.ts               # Airtable API integration
│   ├── encryption.ts             # Client-side encryption
│   ├── validators.ts             # Credential validation logic
│   ├── services.ts               # Service definition types
│   └── utils.ts                  # Existing utilities
├── types/
│   ├── index.ts                  # Core type definitions
│   ├── services.ts               # Service-related types
│   └── forms.ts                  # Form-related types
└── __tests__/                    # Test files
    ├── components/
    ├── lib/
    └── api/
```

## Initial Setup Commands

1. **Install core dependencies:**
   ```bash
   npm install jsonwebtoken @types/jsonwebtoken nodemailer @types/nodemailer airtable crypto-js @types/crypto-js zod react-hook-form @hookform/resolvers date-fns
   ```

2. **Install testing dependencies:**
   ```bash
   npm install --save-dev @types/jest jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom msw
   ```

3. **Create environment file:**
   ```bash
   cp .env.example .env.local  # After creating .env.example
   ```

4. **Set up testing configuration:**
   - Add jest.config.js
   - Add test scripts to package.json
   - Set up MSW for API mocking

## Development Priority Order

1. **Core Infrastructure** (JWT, types, basic structure)
2. **Airtable Integration** (service definitions)
3. **Form Generation** (dynamic forms from JWT)
4. **Email System** (credential delivery)
5. **Admin Interface** (URL generation)
6. **Security Features** (encryption, validation)
7. **UI Polish** (styling, responsive design)
8. **Testing** (comprehensive test coverage)