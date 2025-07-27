// Form-specific type definitions
import { z } from 'zod';
import { CredentialType } from './index';

// Zod schemas for form validation
export const ClientInfoSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  company: z.string().optional(),
  project: z.string().optional(),
});

export const CredentialFieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: z.enum(['text', 'password', 'email', 'url', 'json', 'textarea']),
  required: z.boolean(),
  placeholder: z.string().optional(),
  validation: z.string().optional(),
  helpText: z.string().optional(),
});

export const ServiceDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  credentialType: z.enum(['api_key', 'email_password', 'oauth_json', 'smtp_config', 'custom']),
  fields: z.array(CredentialFieldSchema),
  validationEndpoint: z.string().optional(),
  loomVideoId: z.string().optional(),
  instructions: z.string().optional(),
});

// Admin form schemas
export const AdminGenerateRequestSchema = z.object({
  clientInfo: ClientInfoSchema,
  services: z.array(z.string()).min(1, 'At least one service must be selected'),
  expirationDays: z.number().min(1).max(30).default(7),
  adminNotes: z.string().optional(),
  oneTimeUse: z.boolean().default(true),
});

// Credential submission schemas
export const CredentialSubmissionSchema = z.object({
  serviceId: z.string(),
  credentials: z.record(z.string()),
});

export const FormSubmissionSchema = z.object({
  token: z.string(),
  credentials: z.array(CredentialSubmissionSchema),
});

// Form state types
export interface FormFieldProps {
  field: z.infer<typeof CredentialFieldSchema>;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  isValidating?: boolean;
}

export interface ServiceFormProps {
  service: z.infer<typeof ServiceDefinitionSchema>;
  values: Record<string, string>;
  onChange: (serviceId: string, fieldName: string, value: string) => void;
  errors?: Record<string, string>;
  validationStates?: Record<string, boolean>;
}

export type AdminGenerateFormData = z.infer<typeof AdminGenerateRequestSchema>;
export type FormSubmissionData = z.infer<typeof FormSubmissionSchema>;
export type ClientInfoData = z.infer<typeof ClientInfoSchema>;