// Core type definitions for the credential collection system

export interface ClientInfo {
  name: string;
  email: string;
  company?: string;
  project?: string;
}

export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  credentialType: CredentialType;
  fields: CredentialField[];
  validationEndpoint?: string;
  loomVideoId?: string;
  instructions?: string;
}

export interface CredentialField {
  name: string;
  label: string;
  type: 'text' | 'password' | 'email' | 'url' | 'json' | 'textarea';
  required: boolean;
  placeholder?: string;
  validation?: string; // regex pattern
  helpText?: string;
}

export type CredentialType = 
  | 'api_key' 
  | 'email_password' 
  | 'oauth_json' 
  | 'smtp_config'
  | 'custom';

export interface CollectionRequest {
  clientInfo: ClientInfo;
  services: string[]; // Service IDs
  expiresAt: Date;
  createdAt: Date;
  adminNotes?: string;
  oneTimeUse: boolean;
}

export interface JWTPayload {
  request: CollectionRequest;
  services: ServiceDefinition[];
  iat?: number;
  exp?: number;
}

export interface SubmittedCredentials {
  serviceId: string;
  credentials: Record<string, string>;
  isValid?: boolean;
  validationError?: string;
}

export interface FormSubmission {
  token: string;
  credentials: SubmittedCredentials[];
  clientIP?: string;
  submittedAt: Date;
}

// Airtable related types
export interface AirtableService {
  id: string;
  Name: string;
  Description: string;
  'Credential Type': CredentialType;
  Fields: string; // JSON string of CredentialField[]
  'Validation Endpoint'?: string;
  'Loom Video ID'?: string;
  Instructions?: string;
  Active: boolean;
}

export interface AirtableRequest {
  'Request ID': string;
  'Client Name': string;
  'Client Email': string;
  Company?: string;
  Project?: string;
  Services: string; // Comma-separated service IDs
  'Created At': string;
  'Expires At': string;
  'Admin Notes'?: string;
  Status: 'pending' | 'submitted' | 'expired';
  'Submitted At'?: string;
  'Client IP'?: string;
}

// Validation and error types
export interface ValidationResult {
  isValid: boolean;
  error?: string;
  details?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}