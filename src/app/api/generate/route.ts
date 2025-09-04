import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { generateCollectionToken, generateCollectionUrl } from '@/lib/jwt';
import { getServicesByIds, createRequestRecord } from '@/lib/airtable';
import { generateSecureId } from '@/lib/encryption';
import { sendClientInvitationEmail } from '@/lib/email-templates';
import { AdminGenerateRequestSchema } from '@/types/forms';
import { ApiResponse } from '@/types';

const GenerateRequestBodySchema = AdminGenerateRequestSchema.extend({
  deliveryMethod: z.enum(['url', 'email']),
});

export async function POST(
  request: NextRequest
): Promise<NextResponse> {
  try {
    const body = await request.json();
    const validatedData = GenerateRequestBodySchema.parse(body);

    // Get service definitions
    const services = await getServicesByIds(validatedData.services);
    
    if (services.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid services found',
          message: 'Please select at least one valid service',
        },
        { status: 400 }
      );
    }

    // Create collection request
    const requestId = generateSecureId();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + (validatedData.expirationDays * 24 * 60 * 60 * 1000));

    const collectionRequest = {
      clientInfo: validatedData.clientInfo,
      services: validatedData.services,
      expiresAt,
      createdAt: now,
      adminNotes: validatedData.adminNotes,
      oneTimeUse: validatedData.oneTimeUse,
    };

    // Generate JWT token with requestId for tracking
    const tokenPayload = {
      ...collectionRequest,
      requestId, // Add requestId for submission tracking
    };

    const token = generateCollectionToken({
      request: tokenPayload,
      services,
      expirationDays: validatedData.expirationDays,
    });

    // Generate collection URL
    const url = generateCollectionUrl(token);

    // Log request to Airtable for audit trail
    try {
      await createRequestRecord(requestId, collectionRequest, services);
    } catch (auditError) {
      console.error('Failed to log request to Airtable:', auditError);
      // Continue with generation even if audit logging fails
    }

    // Handle email delivery if requested
    let emailSent = false;
    if (validatedData.deliveryMethod === 'email') {
      try {
        await sendClientInvitationEmail({
          clientInfo: validatedData.clientInfo,
          services,
          collectionUrl: url,
          expiresAt,
          adminNotes: validatedData.adminNotes,
        });
        emailSent = true;
      } catch (emailError) {
        console.error('Failed to send invitation email:', emailError);
        
        return NextResponse.json(
          {
            success: false,
            error: 'Failed to send email',
            message: 'URL was generated but email delivery failed. Please share the URL manually.',
            data: { token, url, emailSent: false },
          },
          { status: 207 } // 207 Multi-Status - partial success
        );
      }
    }

    return NextResponse.json({
      success: true,
      data: { token, url, emailSent },
      message: emailSent 
        ? 'Collection URL generated and email sent successfully'
        : 'Collection URL generated successfully',
    });

  } catch (error) {
    console.error('Failed to generate collection URL:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed',
          message: 'Please check your input and try again',
          data: { validationErrors: error.issues },
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: 'Internal server error',
        message: 'Failed to generate collection URL. Please try again.',
      },
      { status: 500 }
    );
  }
}