// Airtable integration for service definitions and request tracking
import Airtable from 'airtable';
import { ServiceDefinition, AirtableService, AirtableRequest, CollectionRequest, CredentialField } from '@/types';

// Initialize Airtable
const base = new Airtable({ 
  apiKey: process.env.AIRTABLE_API_KEY 
}).base(process.env.AIRTABLE_BASE_ID || '');

const SERVICES_TABLE = process.env.AIRTABLE_SERVICES_TABLE || 'Services';
const REQUESTS_TABLE = process.env.AIRTABLE_REQUESTS_TABLE || 'Requests';

/**
 * Fetch all active service definitions from Airtable
 */
export async function getActiveServices(): Promise<ServiceDefinition[]> {
  try {
    const records = await base(SERVICES_TABLE)
      .select({
        filterByFormula: '{Active} = TRUE()',
        sort: [{ field: 'Name', direction: 'asc' }]
      })
      .all();

    return records.map(record => {
      const fields = record.fields as AirtableService;
      
      let parsedFields: CredentialField[] = [];
      try {
        parsedFields = JSON.parse(fields.Fields || '[]');
      } catch (error) {
        console.error(`Failed to parse fields for service ${fields.Name}:`, error);
      }

      return {
        id: record.id,
        name: fields.Name,
        description: fields.Description,
        credentialType: fields['Credential Type'],
        fields: parsedFields,
        validationEndpoint: fields['Validation Endpoint'],
        loomVideoId: fields['Loom Video ID'],
        instructions: fields.Instructions,
      };
    });
  } catch (error) {
    console.error('Failed to fetch services from Airtable:', error);
    throw new Error('Failed to load service definitions');
  }
}

/**
 * Get specific services by IDs
 */
export async function getServicesByIds(serviceIds: string[]): Promise<ServiceDefinition[]> {
  try {
    const allServices = await getActiveServices();
    return allServices.filter(service => serviceIds.includes(service.id));
  } catch (error) {
    console.error('Failed to fetch services by IDs:', error);
    throw new Error('Failed to load requested services');
  }
}

/**
 * Create a new request record in Airtable for audit tracking
 */
export async function createRequestRecord(
  requestId: string,
  request: CollectionRequest,
  services: ServiceDefinition[]
): Promise<string> {
  try {
    const record = await base(REQUESTS_TABLE).create({
      'Request ID': requestId,
      'Client Name': request.clientInfo.name,
      'Client Email': request.clientInfo.email,
      'Company': request.clientInfo.company || '',
      'Project': request.clientInfo.project || '',
      'Services': services.map(s => s.name).join(', '),
      'Created At': request.createdAt.toISOString(),
      'Expires At': request.expiresAt.toISOString(),
      'Admin Notes': request.adminNotes || '',
      'Status': 'pending',
    });

    return record.id;
  } catch (error) {
    console.error('Failed to create request record:', error);
    throw new Error('Failed to log request');
  }
}

/**
 * Update request status when credentials are submitted
 */
export async function updateRequestStatus(
  requestId: string,
  status: 'submitted' | 'expired',
  clientIP?: string
): Promise<void> {
  try {
    // Find the record by Request ID
    const records = await base(REQUESTS_TABLE)
      .select({
        filterByFormula: `{Request ID} = "${requestId}"`
      })
      .firstPage();

    if (records.length === 0) {
      throw new Error('Request record not found');
    }

    const updateData: Partial<AirtableRequest> = {
      Status: status,
      'Submitted At': status === 'submitted' ? new Date().toISOString() : undefined,
      'Client IP': clientIP,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key as keyof AirtableRequest] === undefined) {
        delete updateData[key as keyof AirtableRequest];
      }
    });

    await base(REQUESTS_TABLE).update(records[0].id, updateData);
  } catch (error) {
    console.error('Failed to update request status:', error);
    // Don't throw error for audit logging failures
  }
}

/**
 * Check if a request has already been submitted (for one-time use enforcement)
 */
export async function isRequestAlreadySubmitted(requestId: string): Promise<boolean> {
  try {
    const records = await base(REQUESTS_TABLE)
      .select({
        filterByFormula: `AND({Request ID} = "${requestId}", {Status} = "submitted")`,
        maxRecords: 1
      })
      .firstPage();

    return records.length > 0;
  } catch (error) {
    console.error('Failed to check request status:', error);
    return false; // Fail open for availability
  }
}