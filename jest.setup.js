import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.JWT_SECRET = 'test-jwt-secret-key'
process.env.ENCRYPTION_KEY = 'test-encryption-key-32-chars-long'
process.env.SMTP_HOST = 'smtp.test.com'
process.env.SMTP_PORT = '587'
process.env.SMTP_USER = 'test@example.com'
process.env.SMTP_PASS = 'test-password'
process.env.ADMIN_EMAIL = 'admin@test.com'
process.env.AIRTABLE_API_KEY = 'test-api-key'
process.env.AIRTABLE_BASE_ID = 'test-base-id'
process.env.NEXT_PUBLIC_APP_URL = 'http://localhost:3000'

// Mock crypto for Node.js environment
Object.defineProperty(global, 'crypto', {
  value: {
    getRandomValues: (arr) => {
      for (let i = 0; i < arr.length; i++) {
        arr[i] = Math.floor(Math.random() * 256)
      }
      return arr
    },
  },
})